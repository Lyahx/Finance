# LyraBit Backend

> **PayPal para taşır, biz paranı yönetiriz.**

Hackathon teması "Alternatif" için geliştirilen **LyraBit**, sıradan bir ödeme uygulamasının ötesine geçen, kullanıcının parasını aktif olarak koruyan ve yöneten bir akıllı finans asistanıdır. Bu repo backend tarafının (ASP.NET Core Web API + SQL Server) kaynak kodunu içerir.

---

## Özellikler

- 🔐 **JWT tabanlı kimlik doğrulama** (BCrypt password hashing)
- 💸 **Atomik para transferi** — `IDbContextTransaction` ile yarım kalan transfer yok
- 🛡️ **Fraud Detection** — risk skorlamalı transfer denetimi (5 kuralı C# fallback, ileride Python servisine geçiş için flag)
- 💰 **Cüzdan yönetimi** — bakiye sorgulama ve demo amaçlı para ekleme
- 🧾 **Transaction geçmişi** — kullanıcının gönderdiği ve aldığı tüm işlemler
- 📚 **Scalar API dokümantasyonu** — Swagger yerine modern UI
- 🐳 **Tek komutla Docker** — DB ve API container'da çalışır

---

## Tech Stack

| Katman | Teknoloji |
|---|---|
| Runtime | .NET 10 (`net10.0`) |
| Framework | ASP.NET Core 10 Web API (controllers) |
| ORM | Entity Framework Core 10 |
| DB | SQL Server 2022 (Docker) |
| Auth | JWT Bearer + BCrypt.Net-Next |
| API docs | Scalar.AspNetCore |
| Container | Docker Compose v2 |

---

## Proje Yapısı

```
LyraBit/
├── LyraBit.API/          → Controllers, Program.cs, middleware, JWT config
├── LyraBit.Services/     → Business logic, fraud detection, JWT token üretimi
├── LyraBit.Data/         → DbContext, repositories, migrations, seed
├── LyraBit.Core/         → Entities, enums, DTOs, constants (bağımlılığı yok)
├── docker-compose.yml    → SQL Server + API container
├── Dockerfile            → API multi-stage build (.NET 10)
└── LyraBit.slnx          → Solution dosyası (.NET 10 yeni format)
```

**Bağımlılık zinciri:** `API` → `Services` → `Data` → `Core`. Core hiçbir şeye bağımlı değil.

---

## Hızlı Başlangıç

### Ön gereksinimler
- Docker Desktop (Compose v2)
- (Opsiyonel — sadece geliştirme için) .NET 10 SDK + JetBrains Rider veya Visual Studio

### Yol A — Docker ile her şeyi tek komutta (önerilen demo yolu)

```bash
docker compose up -d --build
```

İlk seferde SQL Server image (~1.5 GB) + .NET image (~250 MB) iner, ~3-5 dakika alır. Sonraki run'lar saniyeler içinde.

**Hazır olduğunu doğrula:**
```bash
docker compose ps
docker compose logs -f lyrabit-api
```

`Database is ready.` ve `Now listening on http://+:8080` mesajlarını gördüğünde tamam.

**Erişim:**
- API: http://localhost:5000
- **Scalar UI: http://localhost:5000/scalar/v1**
- DB (DBeaver/SSMS): `localhost,1433` / `sa` / `LyraBitDev_2024!`

### Yol B — Rider'dan geliştirme (sadece DB container'da, API host'ta)

Backend developer breakpoint koyup debug etmek istediğinde tercih edilir.

```bash
docker compose up -d lyrabit-db
dotnet run --project LyraBit.API
```

API yine http://localhost:5000 üzerinde açılır (launchSettings http profili). Migration ve seed Program.cs içinde otomatik çalışır.

### Durdurma

```bash
docker compose stop          # geçici durdurma (veri durur)
docker compose down          # container'ları sil (volume duruyor)
docker compose down -v       # her şeyi sıfırla (DB verisi de silinir)
```

---

## Demo Kullanıcılar

Seed data otomatik ilk run'da yüklenir. **Tüm şifreler:** `Password123!`

| Username | Email | Tam Ad |
|---|---|---|
| `furkan` | furkan@lyrabit.com | Furkan Bağdemir |
| `semra` | semra@lyrabit.com | Semra Yeşilan |
| `ali_yilmaz` | ali@lyrabit.com | Ali Yılmaz |
| `ayse` | ayse@lyrabit.com | Ayşe Kaya |
| `mehmet` | mehmet@lyrabit.com | Mehmet Demir |

Her kullanıcının cüzdanı 75.000 TRY initial balance ile başlar (sonra seed'deki transferlerle değişir).

**Demo için özellikle hazırlanan transferler:**
- 🚩 **Furkan → Mehmet, 50.000 TL, gece TR 03:00** → status `FlaggedForReview`, riskScore 70 (büyük tutar + ilk kez gönderim + gece saati)
- Spotify, Netflix, Yemeksepeti açıklamalı transferler — Subscriptions/Food kategorileri ile

Toplam: 5 kullanıcı + 5 cüzdan + 26 transfer + 9 kategori.

---

## Endpoint Referansı

| Method | Route | Auth | Açıklama |
|---|---|---|---|
| POST | `/api/v1/auth/register` | — | Yeni kullanıcı kayıt + cüzdan oluştur, JWT döner |
| POST | `/api/v1/auth/login` | — | Email veya username ile giriş, JWT döner |
| GET | `/api/v1/wallet` | Bearer | Kendi cüzdan bakiyesi |
| POST | `/api/v1/wallet/add-funds` | Bearer | Cüzdana para ekle (demo) |
| POST | `/api/v1/transactions/transfer` | Bearer | Para transferi (fraud detection ile) |
| GET | `/api/v1/transactions` | Bearer | Tüm işlem geçmişi (sender veya receiver) |
| GET | `/api/v1/transactions/{id}` | Bearer | Tek işlem detayı (yetkili kullanıcıya) |

Scalar UI'da hepsi interaktif olarak denenebilir.

---

## Curl Örnekleri

### 1. Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@lyrabit.com",
    "username": "testuser",
    "password": "Password123!",
    "fullName": "Test User"
  }'
```

### 2. Login (token al)
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "emailOrUsername": "furkan", "password": "Password123!" }'
```

Response:
```json
{
  "token": "eyJhbG...",
  "userId": "...",
  "username": "furkan",
  "expiresAt": "2026-..."
}
```

### 3. Wallet bakiyesi (token gerekli)
```bash
TOKEN="<yukarıdaki token>"

curl http://localhost:5000/api/v1/wallet \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Transfer
```bash
curl -X POST http://localhost:5000/api/v1/transactions/transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "receiverEmailOrUsername": "ayse",
    "amount": 250,
    "description": "Pizza paylaşımı"
  }'
```

### 5. Transaction geçmişi
```bash
curl http://localhost:5000/api/v1/transactions \
  -H "Authorization: Bearer $TOKEN"
```

---

## Fraud Detection Kuralları

Her transfer denemesinde aşağıdaki kurallar uygulanır, skor toplanır:

| Kural | Puan |
|---|---|
| Tutar ≥ 10.000 TL | +30 |
| Alıcıya ilk kez gönderim | +25 |
| Son 1 saatte gönderen 3+ transfer yapmış | +20 |
| Saat 02:00–05:00 (Europe/Istanbul) | +15 |
| Tutar 1000'den büyük ve yuvarlak değil | +10 |

**Skor ≥ 70 → status `FlaggedForReview`.** Transfer yine de DB'ye yazılır (demo amaçlı görünür kalır).

`appsettings.json` → `FraudDetection.IsExternalServiceEnabled = true` yapılırsa Python tabanlı dış servise HTTP çağrı atılması planlanır (henüz entegre değil, C# fallback aktif kalır).

---

## Mimari Notlar

- **Layered architecture:** Controller → Service → Repository → DbContext.
- **Atomik transfer:** `BeginTransactionAsync` + `TryDecreaseBalanceAsync` (SQL `Balance >= amount` filter) + `UpdateBalanceAsync` + `Transaction.AddAsync` → tek transaction içinde commit/rollback.
- **Yetersiz bakiye:** Race-safe — `Balance >= amount` kısıtı SQL tarafında, in-memory pre-check yok.
- **Custom exception'lar:** `NotFoundException`, `BadRequestException`, `UnauthorizedException` → `GlobalExceptionMiddleware` tarafından `ProblemDetails` (RFC 7807) formatında HTTP yanıtlarına dönüştürülür.
- **JWT:** `sub` claim user ID, `MapInboundClaims = false` ile claim isimleri orijinal kalır. Token süresi 60 dakika (config).
- **Body'den userId kabul edilmez** — daima JWT'den `User.GetUserId()` extension method ile alınır (security).
- **Migration uygulamada otomatik:** Container/uygulama başlarken `db.Database.MigrateAsync()` çalışır, ardından idempotent `SeedData.SeedAsync()`.

---

## Sorun Giderme

**`docker compose up` "image must be lowercase" hatası**
Eski Compose format'ından kalma kontaminasyon. Çözüm: `docker compose down --remove-orphans` sonra tekrar up.

**API container'ı `MigrateAsync` aşamasında patlıyor**
DB hazır değil. `docker compose ps` ile `lyrabit-db`'nin `(healthy)` olduğunu doğrula. `depends_on` healthcheck zaten yönetiyor — yine de patlarsa logları izle: `docker compose logs lyrabit-db`.

**`LyraBitDb` veritabanı SSMS/DBeaver'da görünmüyor**
İlk uygulama çalıştırılana kadar oluşmaz. `up -d` sonrası API loglarında "Database is ready" gör.

**`401 Unauthorized` Scalar'dan beklenmedik geliyor**
Sağ üstteki "Authentication" → "Bearer" alanına `Bearer ...` ön ekini değil sadece **token string'ini** yapıştır (Scalar otomatik ekler).

**JWT key çok kısa hatası uygulamayı başlatırken**
`appsettings.Development.json` içinde `Jwt:Key` minimum 32 karakter olmalı. Default değer 64 karakter, normalde sorun olmaz.

---

## Lisans

MIT (bkz. [LICENSE](LICENSE))
