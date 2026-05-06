# Railway Deploy Günlüğü — LyraBit / Finance

Bu doküman 6 Mayıs 2026 deploy oturumunda **Railway tarafında ne yapıldığını** ve
**neden** yapıldığını adım adım kaydeder. Sorun çıkarsa bakılacak referans.

**Son durum:** 3 servis yan yana çalışıyor, demo erişilebilir.

| Servis | Durum | URL |
|---|---|---|
| `finance-production` (backend, .NET 10) | 🟢 Active | `https://finance-production-a3f2.up.railway.app` |
| `Frontend` (Next.js 14, root: `Alternative-web-ui`) | 🟢 Active | `https://frontend-production-85e3.up.railway.app` |
| `Postgres` (PostgreSQL 16) | 🟢 Online | internal-only |

Proje ismi: `honest-creativity`

---

## 1. Hesap & Proje Oluşturma

1. https://railway.com → **Login with GitHub** (Lyahx hesabı)
2. Trial otomatik başladı: **$5 / 30 gün**
3. Dashboard → **+ New Project** → **Deploy from GitHub Repo**
4. **Configure GitHub App** ile `Lyahx/Finance` reposuna erişim verildi
5. Repo seçildi, **Deploy Now** basıldı
6. Service tile oluştu, branch **`feat/backend`** olarak ayarlandı

---

## 2. Backend Servisi (`finance-production`)

### 2.1 Build pipeline
- Builder: **Dockerfile** (root'taki `Dockerfile`)
- .NET 10 SDK → publish → ASP.NET runtime image
- Build süresi ortalama 3-4 dk

### 2.2 PostgreSQL eklendi
Canvas'a **+ Create → Database → Add PostgreSQL** ile yeni servis eklendi.
Otomatik şu env'leri sağladı:
- `DATABASE_URL`, `DATABASE_PUBLIC_URL`
- `PGDATABASE`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`

### 2.3 Backend Variables (zorunlu env'ler)

Backend tile → **Variables** sekmesinde eklenenler:

| Name | Value | Açıklama |
|---|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Service Reference — Postgres'in URL'ini otomatik çeker |
| `Jwt__Key` | _(48 byte rastgele string, base64)_ | Çift altçizgi! `Jwt:Key` ile aynı |
| `Jwt__Issuer` | `LyraBit` | |
| `Jwt__Audience` | `LyraBit.Clients` | |
| `Jwt__ExpiryMinutes` | `60` | |
| `ASPNETCORE_ENVIRONMENT` | `Production` | |

> JWT key üretmek için: `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`

### 2.4 Public Domain
- **Settings → Networking → Generate Domain**
- Port: **8080**
- Atanan URL: `finance-production-a3f2.up.railway.app`

### 2.5 Healthcheck
- Path: `/health` (Program.cs'te tanımlı, DB'ye bakmaz)
- Timeout: 60s

---

## 3. Frontend Servisi (`Frontend`)

### 3.1 Servis oluşturma
- Aynı projede **+ Create → GitHub Repo → Lyahx/Finance** (yine aynı repo)
- Bu sefer **Settings → Source**:
  - **Branch:** `feat/backend`
  - **Root Directory:** `Alternative-web-ui` ← KRİTİK
  - Bu sayede Railway sadece `Alternative-web-ui/` klasörüne bakar, oradaki Dockerfile'ı kullanır

### 3.2 Build pipeline
- Builder: **Dockerfile** (`Alternative-web-ui/Dockerfile`)
- node:20-alpine multi-stage (deps → builder → runner)
- `output: "standalone"` ile minimal bundle
- Build süresi ~2-3 dk

### 3.3 Frontend Variables

| Name | Value | Açıklama |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://finance-production-a3f2.up.railway.app` | Backend URL, **slash YOK**, **/api/v1 YOK** |

> `NEXT_PUBLIC_*` env'leri build-time'da bake olur. Variable değiştirilince Railway
> otomatik redeploy eder. Manuel: Deployments → en üst → ⋯ → **Redeploy**.

### 3.4 Public Domain
- **Settings → Networking → Generate Domain**
- Port: **3000**
- Atanan URL: `frontend-production-85e3.up.railway.app`

---

## 4. Karşılaşılan Sorunlar ve Çözümler

### 4.1 SQL Server / PostgreSQL uyumsuzluğu
**Belirti:** İlk başta backend SQL Server'a göre yazılmıştı, Railway'de yerleşik SQL Server yok.

**Çözüm:** Backend tamamen PostgreSQL'e port edildi (commit `bed73bc`):
- `LyraBit.Data.csproj`: `Microsoft.EntityFrameworkCore.SqlServer` → `Npgsql.EntityFrameworkCore.PostgreSQL`
- `DependencyInjection.cs`: `UseSqlServer` → `UseNpgsql`
- 4 entity config: `GETUTCDATE()` → `"now() at time zone 'utc'"`
- Eski SQL Server migration'ları silindi, yeni Postgres migration üretildi
- `Program.cs`'e Postgres URI → Npgsql key=value normalize helper eklendi (Railway'in `DATABASE_URL` formatını kabul etmesi için)
- `docker-compose.yml`: SQL Server → `postgres:16-alpine`

### 4.2 Healthcheck failed: "service unavailable"
**Belirti:** Railway healthcheck `/scalar/v1`'i 30s boyunca bulamadı, deploy fail.

**Sebep:** Production'da scalar (API docs) endpoint'i kapalıydı (`if (app.Environment.IsDevelopment())` guard).

**Çözüm** (commit `4945784`):
- `Program.cs`'e `app.MapGet("/health", () => Results.Ok(...))` lightweight probe eklendi
- Scalar/OpenAPI artık her ortamda açık (demo için)
- `railway.toml`: `healthcheckPath` `/scalar/v1` → `/health`, timeout 60s

### 4.3 "ConnectionString property has not been initialized"
**Belirti:** Variables'a `DATABASE_URL` eklendiği halde backend startup'ta:
```
fail: An error occurred using the connection to database '' on server ''.
crit: System.InvalidOperationException: The ConnectionString property has not been initialized.
```

**Sebep:** `appsettings.json`'da `"ConnectionStrings": { "DefaultConnection": "" }` boş string vardı.
C#'ta `??` (null-coalesce) **sadece null** kontrol eder, **boş string null değildir**.
Yani `GetConnectionString("DefaultConnection")` `""` (boş string) dönüyor, `??` atlamıyor,
`DATABASE_URL` fallback'e hiç düşmüyor, boş string Npgsql'e gidiyor.

**Çözüm** (commit `9c28d70`):
```csharp
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
}
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("...");
}
```

### 4.4 Next.js HIGH severity CVE block
**Belirti:** Frontend deploy'ta Railway:
```
SECURITY VULNERABILITIES DETECTED
next@14.2.3 — Severity: HIGH
- CVE-2025-55184 (HIGH)
- CVE-2025-67779 (HIGH)
Upgrade to 14.2.35
```

Railway güvenlik guard'ı kararlı bir şekilde build'i blokluyordu.

**Çözüm** (commit `7eb9bce`):
```bash
npm install next@^14.2.35
```
`package.json` ve `package-lock.json` güncellendi, push edildi. Railway re-scan'de geçti.

### 4.5 Frontend "Add Root Directory" eksik gözüküyordu
**Belirti:** Frontend servisi ekledikten sonra Settings → Source'ta "Root Directory" alanı görünmüyordu.

**Sebep:** Default'ta gizli — açmak için **"Add Root Directory"** mavi linkine tıklamak gerekiyor.

**Çözüm:** Linke tıklayıp `Alternative-web-ui` yazıldı, üstteki **"Apply changes → Deploy"** ile uygulandı.

---

## 5. Commit Geçmişi (Railway Oturumu)

| Hash | Mesaj |
|---|---|
| `a041f51` | Frontend (Next.js HPay UI) eklendi, yeni API endpoint'leri ve Railway deploy hazırlığı |
| `bed73bc` | Backend SQL Server'dan PostgreSQL'e port edildi (Railway uyumlu) |
| `4945784` | Healthcheck düzeltildi: /health endpoint + scalar production'da açık |
| `9c28d70` | Connection string: boş string (appsettings) artık DATABASE_URL fallback'i bloke etmiyor |
| `7eb9bce` | Next.js 14.2.3 → 14.2.35: Railway HIGH severity CVE'leri kapatıldı |

Push hedefi: `lyahx remote → https://github.com/Lyahx/Finance.git → branch feat/backend`

---

## 6. Mimari (Final Hali)

```
[ honest-creativity Project ]
│
├── finance-production  (backend, .NET 10)
│     ↓ /api/v1, /health, /scalar/v1
│     ↓ Variables: DATABASE_URL, Jwt__*, ASPNETCORE_ENVIRONMENT
│     ↓ Source: Lyahx/Finance · feat/backend · root /
│     └─ Public: finance-production-a3f2.up.railway.app
│
├── Frontend  (Next.js 14.2.35 standalone)
│     ↓ Variables: NEXT_PUBLIC_API_URL
│     ↓ Source: Lyahx/Finance · feat/backend · root /Alternative-web-ui
│     └─ Public: frontend-production-85e3.up.railway.app
│
└── Postgres  (PostgreSQL 16, private)
      └─ Variables: DATABASE_URL, PG* (otomatik)
      └─ Volume: postgres-volume (persisted)
      └─ Internal: postgres.railway.internal:5432
```

**Network:**
- Backend ↔ Postgres: internal network (`*.railway.internal`), free
- Frontend ↔ Backend: public HTTPS, CORS açık (`AllowAnyOrigin`)
- Browser → Frontend: public HTTPS

---

## 7. Test ve Doğrulama

### 7.1 Backend health
```bash
curl https://finance-production-a3f2.up.railway.app/health
# {"status":"ok","service":"lyrabit-api"}
```

### 7.2 Backend login (DB sağlamlığı)
```bash
curl -X POST https://finance-production-a3f2.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"furkan","password":"Password123!"}'
# {"token":"eyJ...","userId":"...","username":"furkan",...}
```

### 7.3 Scalar API explorer
`https://finance-production-a3f2.up.railway.app/scalar/v1` → interaktif endpoint listesi.

### 7.4 Frontend uçtan uca
1. `https://frontend-production-85e3.up.railway.app/` → editorial landing
2. Giriş Yap → demo chip `furkan` → şifre `Password123!`
3. Dashboard → bakiye **75.000,00 ₺** görünüyorsa zincir tamam ✅

### 7.5 Demo hesaplar (seed)
Şifre: `Password123!`

| Username | Email |
|---|---|
| furkan | furkan@hpay.com.tr |
| semra | semra@hpay.com.tr |
| ali_yilmaz | ali@hpay.com.tr |
| ayse | ayse@hpay.com.tr |
| mehmet | mehmet@hpay.com.tr |

Her biri 75.000 ₺ bakiye + örnek transaction geçmişi (50.000 TL flagged transfer dahil).

---

## 8. Maliyet ve Yaşam Döngüsü

- **Trial:** $5 kredi / 30 gün (kart bağlanmamış)
- **Tahmini günlük yakım:** ~$0.10-0.20 (3 servis aktif, demo trafiği)
- **Trial bitince:** Servisler otomatik durur, kart eklemen istenir, **kart yokken para çekilmez**

---

## 9. Servisleri Durdurma / Silme

### A) Tek servisi pasifleştir (config kalır)
- Servis tile → **Deployments** sekmesi
- Aktif satırın sağındaki **⋯** menüsü → **Remove deployment** / **Stop**
- Container kapanır, kredi yanmaz
- Yeniden başlatmak için: **Deployments → Deploy** veya GitHub push

### B) Servisi tamamen sil
- Servis tile → **Settings → Danger Zone** (en alt) → **Delete Service**

### C) Tüm projeyi sil (en hızlı temizlik)
- Sol panelde **⚙ Project Settings** veya proje ismi yanında ▾ menü
- En alt **Danger Zone → Delete Project**
- Proje ismini onay olarak yaz: `honest-creativity` → **Delete**
- Postgres + tüm data + URL'ler geri dönüşsüz silinir

> Yeni Railway plan'ında **"Pause Service"** kaldırılmış. Geçici durdurma için tek
> yol **deployment'ı remove etmek** (yukarıdaki A).

---

## 10. Tekrar Aynı Setup'ı Kurmak İçin

Tüm proje silinirse aynı setup'ı kurmak için:

1. **+ New Project → Deploy from GitHub** → `Lyahx/Finance` → branch `feat/backend`
2. **+ Create → Database → Add PostgreSQL**
3. Backend Variables ekle (bölüm 2.3'teki tablo)
4. Backend → **Settings → Networking → Generate Domain**, port `8080`
5. Backend URL'ini kopyala
6. **+ Create → GitHub Repo → Lyahx/Finance**
7. Frontend → **Settings → Source → Add Root Directory** → `Alternative-web-ui`, branch `feat/backend`
8. Frontend Variables → `NEXT_PUBLIC_API_URL = <backend URL>`
9. Frontend → **Settings → Networking → Generate Domain**, port `3000`
10. Frontend URL'ini aç, `furkan / Password123!` ile test

`DEPLOY.md` aynı süreci daha detaylı anlatır (sorun giderme tablosu dahil).

---

## 11. Önemli Notlar

- **JWT key kaybolursa:** Tüm aktif token'lar geçersiz olur, kullanıcılar yeniden login. Yeni 32+ char generate et.
- **DATABASE_URL'i değiştirmek:** Postgres servisini silmeden Variable'ı değiştirme — backend bağlantısı kopar.
- **CORS:** Şu an `AllowAnyOrigin`. Production'da `WithOrigins("https://frontend-production-85e3.up.railway.app")` ile daraltılmalı.
- **Migration:** `Program.cs` startup'ta `db.Database.MigrateAsync()` çağırır. Yeni migration eklenirse otomatik düşer (schema değişikliklerinde dikkat).
- **Seed data:** İlk migration sonrası `SeedData.SeedAsync` çalışır, tablolar boşsa demo veriler düşer (idempotent — `if (db.Users.AnyAsync()) return`).

---

_Belge tarihi: 2026-05-06 · Hackathon demo deploy oturumu_
