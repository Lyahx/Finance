# LyraBit — Deploy Rehberi

İki servisli mimari:
- **Backend** (`LyraBit.API` · .NET 10 · root `Dockerfile`) — port 8080
- **Frontend** (`Alternative-web-ui` · Next.js 14 · standalone) — port 3000
- **Veritabanı** — SQL Server 2022 (lokal compose'da yerleşik; production'da external)

---

## 0. Lokal Test (Docker Compose)

Compose dosyası 3 servisi birden ayağa kaldırır.

```bash
docker compose up -d --build
docker compose logs -f lyrabit-api    # Database is ready. yazısını bekle
docker compose logs -f lyrabit-web    # next start, port 3000
```

Erişim:
- Backend API:  http://localhost:5000
- Backend Docs: http://localhost:5000/scalar/v1
- Frontend:     http://localhost:3000

Temizleme:
```bash
docker compose down -v   # -v volume'leri de siler (DB sıfırlanır)
```

---

## 1. ⚠️ Veritabanı: Önemli Not

Backend **SQL Server**'a göre yazılmış (`UseSqlServer`, EF migrations). Railway'in
yerleşik veritabanları **PostgreSQL/MySQL/Mongo**; **SQL Server yok.**

**3 seçenek var:**

### A) Railway'de SQL Server (kendi container)
Railway "Empty Service" → SQL Server image'ı çalıştır. **Volume + ücretli plan
gerektirir** (~5 USD/ay başlangıç). Connection string:
```
Server=<railway-internal-host>,1433;Database=LyraBitDb;User Id=sa;Password=...;TrustServerCertificate=True;
```

### B) External SQL Server (Azure free tier / Somee / vs.)
- Azure SQL Database serverless (5GB free tier var)
- Connection string Azure'dan al, Railway backend env'ine yaz.

### C) PostgreSQL'e port et (en sürdürülebilir)
1. `LyraBit.Data` projesinde `Microsoft.EntityFrameworkCore.SqlServer` →
   `Npgsql.EntityFrameworkCore.PostgreSQL`
2. `DependencyInjection.cs` içinde `UseSqlServer` → `UseNpgsql`
3. Migration'ları yeniden oluştur:
   ```bash
   rm -rf LyraBit.Data/Migrations
   dotnet ef migrations add InitialCreate -p LyraBit.Data -s LyraBit.API
   ```
4. Railway → **+ New → Database → Add PostgreSQL** → `DATABASE_URL` ortam
   değişkeni gelir. Connection string'i Postgres formatına çevirip backend'e ver.

> Hackathon timeline'ında (A) ya da (B) hızlıdır; (C) doğru iştir.

---

## 2. Backend → Railway

```bash
# Railway CLI kuruluysa
railway login
railway init        # mevcut proje yoksa
railway up
```

Veya UI üzerinden: **New Project → Deploy from GitHub Repo →** root dizini seç.

### Required Environment Variables (Railway → Variables)

```
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=<yukarıdaki seçeneklerden biri>
Jwt__Key=<en az 32 karakter rastgele string — örn: openssl rand -base64 48>
Jwt__Issuer=LyraBit
Jwt__Audience=LyraBit.Clients
Jwt__ExpiryMinutes=60
```

> `PORT` Railway tarafından otomatik atanır, Dockerfile entrypoint bunu okur.

### Build & Run
- Builder: **Dockerfile** (`railway.toml` içinde tanımlı)
- Start Command: `sh -c 'ASPNETCORE_HTTP_PORTS=${PORT:-8080} dotnet LyraBit.API.dll'`
- Healthcheck: `/scalar/v1`

### Doğrulama
```bash
curl https://<your-backend>.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"furkan","password":"Password123!"}'
```

---

## 3. Frontend → Railway

UI üzerinden: **+ New Service → GitHub Repo →** root dizin: `Alternative-web-ui`.

### Required Environment Variables

**Build args (önemli — public env'ler build-time'da bake olur):**
```
NEXT_PUBLIC_API_URL=https://<your-backend>.up.railway.app
```

Railway'de **Settings → Variables** altında set et, hem **Build Variables** hem
**Runtime Variables** olarak işaretle (bazı dağıtımlarda runtime'a iletmez).

### Build & Run
- Builder: **Dockerfile** (multi-stage Next.js standalone)
- Start Command: `node server.js`
- Healthcheck: `/`

### Doğrulama
- `https://<your-frontend>.up.railway.app/` — landing
- `/login` → demo kullanıcılar `furkan / Password123!`
- Login sonrası dashboard cüzdan bakiyesi geliyorsa frontend ↔ backend bağlantısı OK.

---

## 4. CORS

Backend `Program.cs` şu an `AllowAnyOrigin/Method/Header` (hackathon kolaylığı).
Production'da daraltmak istersen:

```csharp
builder.Services.AddCors(opt => opt.AddPolicy(CorsPolicy, policy => policy
    .WithOrigins("https://<your-frontend>.up.railway.app")
    .AllowAnyMethod()
    .AllowAnyHeader()));
```

---

## 5. Hızlı Sorun Giderme

| Belirti | Sebep | Çözüm |
|---|---|---|
| Backend `Database initialization failed` | Connection string yanlış / DB erişilemiyor | Railway DB host/port doğru mu? `TrustServerCertificate=True` var mı? |
| Backend `Jwt:Key must be at least 32 characters` | Env eksik | `Jwt__Key` set et (32+ char) |
| Frontend "Failed to fetch" | CORS veya yanlış API URL | `NEXT_PUBLIC_API_URL` doğru mu? Build sonrası tekrar deploy gerekir |
| Frontend bakiye 0 görünüyor | Token henüz yok / register-only akış | `/login`'den giriş yapıp dashboard'ı kontrol et |
| Railway port hatası | Dockerfile $PORT'u okumadı | shell-form ENTRYPOINT (`sh -c '... ${PORT}'`) doğru mu? |
| Next.js build "Module not found" | tsconfig path alias çözülemedi | `Dockerfile` builder stage `npm ci` ile dependencies geliyor mu kontrol et |

---

## 6. Domain & SSL

Railway her servise otomatik `*.up.railway.app` subdomain verir. Custom domain
istersen: **Settings → Networking → Custom Domain →** CNAME ekle. SSL otomatik.

---

## Demo Hesaplar (production seed)

Şifre hepsinde: `Password123!`

| Username | Email | Bakiye |
|---|---|---|
| furkan | furkan@hpay.com.tr | 75.000 ₺ |
| semra | semra@hpay.com.tr | 75.000 ₺ |
| ali_yilmaz | ali@hpay.com.tr | 75.000 ₺ |
| ayse | ayse@hpay.com.tr | 75.000 ₺ |
| mehmet | mehmet@hpay.com.tr | 75.000 ₺ |

DB seed `SeedData.SeedAsync` ile ilk migration'da otomatik düşer.
