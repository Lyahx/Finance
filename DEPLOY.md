# LyraBit — Deploy Rehberi (Railway)

İki servisli mimari, native PostgreSQL:

- **Backend** (`LyraBit.API` · .NET 10 · root `Dockerfile`) — port 8080
- **Frontend** (`Alternative-web-ui` · Next.js 14 standalone) — port 3000
- **Veritabanı** — PostgreSQL 16 (Railway built-in olarak verilir, lokal compose'ta yerleşik)

---

## 0. Lokal Test (Docker Compose)

3 servisi birden ayağa kaldırır.

```bash
docker compose up -d --build
docker compose logs -f lyrabit-api    # "Database is ready." mesajını bekle
docker compose logs -f lyrabit-web    # next start, port 3000
```

Erişim:
- Backend API: http://localhost:5000
- Backend Docs: http://localhost:5000/scalar/v1
- Frontend: http://localhost:3000

Demo kullanıcılar (şifre `Password123!`): `furkan`, `semra`, `ali_yilmaz`, `ayse`, `mehmet`.

Temizleme:
```bash
docker compose down -v   # -v volume'leri de siler (DB sıfırlanır)
```

---

## 1. Backend → Railway

### 1.1 Servisi Oluştur

Railway Dashboard → **+ New Project → Deploy from GitHub Repo** → repo seç, root dizin (Dockerfile burada).

### 1.2 PostgreSQL Ekle

Aynı projeye **+ New → Database → Add PostgreSQL**.

Railway otomatik şu env'leri sağlar (Postgres servisi içinde):
- `DATABASE_URL` (`postgresql://user:pass@host:port/dbname`)
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

### 1.3 Backend Servisi Variables

Backend servisinin **Variables** sekmesinde ekle:

```
ASPNETCORE_ENVIRONMENT=Production
DATABASE_URL=${{Postgres.DATABASE_URL}}
Jwt__Key=<32+ karakter rastgele string>
Jwt__Issuer=LyraBit
Jwt__Audience=LyraBit.Clients
Jwt__ExpiryMinutes=60
```

> `${{Postgres.DATABASE_URL}}` Railway'in **service reference** sözdizimi —
> Postgres servisinin URL'ini otomatik backend env'ine geçer.

> `PORT` Railway tarafından otomatik atanır, Dockerfile entrypoint okur.

> `Jwt__Key` üretmek için: `openssl rand -base64 48` veya
> `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`.

### 1.4 Build & Run

- Builder: **Dockerfile** (`railway.toml` içinde tanımlı)
- Start command: `sh -c 'ASPNETCORE_HTTP_PORTS=${PORT:-8080} dotnet LyraBit.API.dll'`
- Healthcheck path: `/scalar/v1`

`Program.cs` startup'ta:
1. `DATABASE_URL`'i Npgsql formatına çevirir (postgres URI → key=value)
2. Migration'ı uygular (`db.Database.MigrateAsync`)
3. Seed data ekler (`SeedData.SeedAsync` — boş DB'de demo kullanıcılar/işlemler)
4. JWT auth + CORS açık + scalar docs (production'da kapalı)

### 1.5 Doğrulama

```bash
curl https://<your-backend>.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"furkan","password":"Password123!"}'
```

`200 OK + { token, userId, ... }` döndüyse backend ↔ DB sağlam.

---

## 2. Frontend → Railway

### 2.1 Servisi Oluştur

**+ New Service → GitHub Repo →** root dizin: `Alternative-web-ui`.

### 2.2 Variables

`NEXT_PUBLIC_API_URL` build-time'da bake olur — hem **Build Variables** hem
**Service Variables**'a ekle (Railway Dockerfile builder her ikisinde de okur):

```
NEXT_PUBLIC_API_URL=https://<your-backend>.up.railway.app
```

> Bu değer `/api/v1` içermez — `services/api.ts` ekliyor.

### 2.3 Build & Run

- Builder: **Dockerfile** (multi-stage Next.js standalone)
- Start command: `node server.js`
- Healthcheck path: `/`

### 2.4 Doğrulama

- `https://<your-frontend>.up.railway.app/` → editorial landing
- `/login` → `furkan / Password123!`
- Login sonrası dashboard cüzdan bakiyesi geliyorsa frontend ↔ backend bağlantısı OK.

---

## 3. CORS

Backend `Program.cs` şu an `AllowAnyOrigin/Method/Header` (hackathon kolaylığı).
Production'da daraltmak için:

```csharp
builder.Services.AddCors(opt => opt.AddPolicy(CorsPolicy, policy => policy
    .WithOrigins("https://<your-frontend>.up.railway.app")
    .AllowAnyMethod()
    .AllowAnyHeader()));
```

---

## 4. Connection String Formatları (Referans)

Backend `DATABASE_URL` veya `ConnectionStrings__DefaultConnection`'dan birini okur.
URI formatı varsa otomatik Npgsql'e çevirir.

**Postgres URI (Railway default):**
```
postgresql://user:pass@host:5432/dbname
```

**Npgsql key=value (lokal compose veya manuel):**
```
Host=lyrabit-db;Port=5432;Database=lyrabit;Username=lyrabit;Password=...;SSL Mode=Require;Trust Server Certificate=true
```

URI verirsen `Program.cs`'teki `NormalizePostgresConnectionString` SSL Mode'u
otomatik `Require` yapar — Railway Postgres bunu zorunlu kılar.

---

## 5. Hızlı Sorun Giderme

| Belirti | Sebep | Çözüm |
|---|---|---|
| `Database initialization failed` | Connection string yanlış / DB erişilemiyor | Backend Variables'da `DATABASE_URL=${{Postgres.DATABASE_URL}}` referansı doğru mu? |
| `Cannot write DateTime with Kind=Unspecified` | Kod `.Date` veya `new DateTime(...)` kullanıyor, Kind=Utc değil | `DateTime.SpecifyKind(x, DateTimeKind.Utc)` ekle (kod tarafında düzeltildi) |
| `Jwt:Key must be at least 32 characters` | Env eksik | `Jwt__Key` set et (32+ char) |
| Frontend "Failed to fetch" | CORS veya yanlış API URL | `NEXT_PUBLIC_API_URL` doğru mu? Build sonrası tekrar deploy gerekir (build-time bake) |
| Frontend bakiye 0 görünüyor | Token henüz yok | `/login` üzerinden gir |
| Railway port hatası | Dockerfile $PORT'u okumadı | Shell-form ENTRYPOINT (`sh -c '... ${PORT}'`) |
| Migration çakışması | `dotnet ef migrations` daha önce SQL Server'a göre üretilmişti | `LyraBit.Data/Migrations/` boşaltıp yeniden `dotnet ef migrations add InitialCreate` |
| `SSL connection error` | Railway Postgres SSL zorunlu | Connection string'de `SSL Mode=Require;Trust Server Certificate=true` (URI verilirse otomatik eklenir) |

---

## 6. Domain & SSL

Railway her servise otomatik `*.up.railway.app` subdomain verir. Custom domain
istersen: **Settings → Networking → Custom Domain →** CNAME ekle. SSL otomatik.

---

## 7. Test Hesapları (production seed)

Şifre hepsinde: `Password123!`

| Username | Email | Bakiye |
|---|---|---|
| furkan | furkan@hpay.com.tr | 75.000 ₺ |
| semra | semra@hpay.com.tr | 75.000 ₺ |
| ali_yilmaz | ali@hpay.com.tr | 75.000 ₺ |
| ayse | ayse@hpay.com.tr | 75.000 ₺ |
| mehmet | mehmet@hpay.com.tr | 75.000 ₺ |

Boş DB'ye ilk migration düştüğünde `SeedData.SeedAsync` otomatik çalışır.
DB zaten doluysa skip eder (idempotent — `if (db.Users.AnyAsync()) return;`).
