# HPay API Contract

**Base URL (local):** `http://localhost:5000`
**Base URL (prod):** `<deploy-edilince-doldurulacak>`
**Interactive docs:** `http://localhost:5000/scalar/v1`

> Tüm request/response body'leri JSON. Auth gerekli endpoint'lerde header:
> `Authorization: Bearer <token>`

---

## Auth

### POST /api/v1/auth/register
Yeni kullanıcı + cüzdan oluşturur. Cüzdan otomatik açılır (initial balance 0).

Body:
```json
{
  "email": "user@example.com",
  "username": "user123",
  "password": "Test123!",
  "fullName": "Furkan Y."
}
```

Validation:
- `email` — required, email format, max 150
- `username` — required, 3-50 char, regex `^[a-zA-Z0-9_]+$`
- `password` — required, 8-100 char
- `fullName` — required, 2-150 char

Response **201 Created**:
```json
{
  "token": "eyJhbGc...",
  "userId": "15572bfd-1eca-463e-9c92-c477f37026fc",
  "username": "user123",
  "expiresAt": "2026-05-05T19:46:07.42Z"
}
```

Errors:
- `400` — `"Email is already registered."`
- `400` — `"Username is already taken."`
- `400` — Validation hatası (errors map'i ile)

---

### POST /api/v1/auth/login
Email **veya** username ile giriş.

Body:
```json
{
  "emailOrUsername": "user123",
  "password": "Test123!"
}
```

Response **200 OK**: Aynı `AuthResponse` (yukarıdaki gibi).

Errors:
- `401` — `"Invalid credentials."` (kullanıcı yok veya şifre yanlış — security için aynı mesaj)

---

## Wallet (JWT required)

### GET /api/v1/wallet
Giriş yapan kullanıcının cüzdanı.

Response **200 OK**:
```json
{
  "userId": "15572bfd-...",
  "balance": 22086.00,
  "currency": "TRY"
}
```

Errors: `401`, `404` (`"Wallet not found."`)

---

### POST /api/v1/wallet/add-funds
Demo amaçlı para ekleme. Atomik transaction içinde.

Body:
```json
{ "amount": 5000 }
```

Validation: `amount > 0`, `≤ 1.000.000.000`

Response **200 OK**: Güncel `WalletDto`.

Errors:
- `400` — `"Amount must be greater than zero."`
- `401`, `404`

---

## Transactions (JWT required)

### POST /api/v1/transactions/transfer
Para transferi. Atomik (rollback garanti) + race-safe (yetersiz bakiye SQL guard) + fraud detection.

Headers (önerilir):
```
X-Device-Id: web-fp-aabbccdd11        # fraud detection sinyali
X-Lyrabit-Channel: Web                # MobileApp | Web | QR | Api (default: Api)
```

Body:
```json
{
  "receiverEmailOrUsername": "ayse",
  "amount": 250,
  "description": "Pizza paylaşımı"
}
```

Validation:
- `receiverEmailOrUsername` — required, 3-150 char
- `amount` — required, > 0, ≤ 1.000.000.000
- `description` — optional, max 500 char

Response **201 Created**:
```json
{
  "id": "7f3a91b2-...",
  "senderUsername": "furkan",
  "receiverUsername": "ayse",
  "amount": 250.00,
  "currency": "TRY",
  "description": "Pizza paylaşımı",
  "status": "Completed",
  "riskScore": 5,
  "category": null,
  "createdAt": "2026-05-05T17:30:42.12Z",
  "ipAddress": "172.18.0.1",
  "deviceId": "web-fp-aabbccdd11",
  "channel": "Web",
  "senderAccountAgeDays": 30
}
```

`status` değerleri:
- `"Completed"` — başarılı, para hareketi gerçekleşti
- `"FlaggedForReview"` — risk skoru ≥ 70, **transfer yine de gerçekleşti** ama incelemeye düştü → UI'da amber uyarı göster
- `"Pending"` / `"Failed"` — şu an üretilmiyor

Yüksek risk örneği:
```json
{
  "id": "...",
  "status": "FlaggedForReview",
  "riskScore": 78,
  "amount": 50000.00,
  ...
}
```

Errors:
- `400` — `"Amount must be greater than zero."`
- `400` — `"Cannot transfer to yourself."`
- `400` — `"Insufficient funds."` ⭐ UI'da öne çıkar
- `401` — token yok / sender problem
- `404` — `"Receiver not found."`

---

### GET /api/v1/transactions
Giriş yapan kullanıcının tüm işlem geçmişi (gönderdiği + aldığı), `createdAt` desc.

Response **200 OK**: `TransactionResponseDto[]` (yukarıdaki shape).

Pagination yok — liste küçük, client-side filtre/sayfalama yeterli.

Errors: `401`.

---

### GET /api/v1/transactions/{id}
Tek işlem detayı. **Sadece sender veya receiver görebilir.**

Response **200 OK**: `TransactionResponseDto`.

Errors:
- `401` — `"You are not a participant of this transaction."`
- `404` — `"Transaction not found."`

---

### POST /api/v1/transactions/{id}/confirm
Sender, flagged işlemini "ben yaptım, onaylıyorum" der → status `Completed` olur. Para zaten transfer'de hareket etti, bu sadece status güncellemesi.

Response **200 OK**: Güncel `TransactionResponseDto` (status `Completed`).

Errors:
- `400` — `"Transaction already confirmed."`
- `400` — `"Only flagged transactions can be confirmed."`
- `401` — `"Only the sender can confirm this transaction."`
- `404` — `"Transaction not found."`

---

### GET /api/v1/transactions/analytics/summary
Server-side aggregate. Frontend tüm tx'leri çekip kendi tarafında toplamak zorunda kalmaz.

Response **200 OK**:
```json
{
  "totalThisMonth": 4250.50,
  "totalLastMonth": 3890.00,
  "deltaPct": 9,
  "transactionCountThisMonth": 12,
  "flaggedCount": 1,
  "averageRiskScore": 18.4,
  "categoryBreakdown": [
    { "category": "Food", "total": 1450.50, "count": 5 },
    { "category": "Subscriptions", "total": 318.80, "count": 3 },
    { "category": "Other", "total": 2481.20, "count": 4 }
  ],
  "lastSixMonths": [
    { "year": 2025, "month": 12, "total": 8200.00 },
    { "year": 2026, "month":  1, "total": 9100.00 },
    { "year": 2026, "month":  2, "total": 8800.00 },
    { "year": 2026, "month":  3, "total": 11200.00 },
    { "year": 2026, "month":  4, "total": 10400.00 },
    { "year": 2026, "month":  5, "total": 4250.50 }
  ]
}
```

Notlar:
- `deltaPct` — geçen aya göre yüzde değişim. Geçen ay 0 ise `null` döner.
- `category` `null` olan tx'ler `"Other"` adıyla gruplanır.
- Sadece **giden** (sender = current user) tx'ler hesaba katılır.

Errors: `401`.

---

## Users (JWT required)

### GET /api/v1/users/me
Giriş yapan kullanıcının profil bilgisi + cüzdan özeti.

Response **200 OK**:
```json
{
  "id": "15572bfd-...",
  "email": "furkan@hpay.com.tr",
  "username": "furkan",
  "fullName": "Furkan Bağdemir",
  "createdAt": "2026-04-05T12:00:00Z",
  "accountAgeDays": 30,
  "balance": 22086.00,
  "currency": "TRY"
}
```

Errors: `401`, `404` (`"User not found."`).

---

### GET /api/v1/users/search?q={query}&limit={n}
Kullanıcı arama (transfer formunda autocomplete için).

Query params:
- `q` — required, min 2 karakter. Username, email veya fullName içinde LIKE filtre.
- `limit` — optional, default 10, max 25.

Response **200 OK**:
```json
[
  { "id": "...", "username": "ayse", "fullName": "Ayşe Kaya" },
  { "id": "...", "username": "ali_yilmaz", "fullName": "Ali Yılmaz" }
]
```

Notlar:
- Boş veya 2 karakterden kısa `q` → boş array döner (404 değil).
- Giriş yapan kullanıcı **kendi**si sonuçlardan filtrelenir.

Errors: `401`.

---

## Categories (JWT required)

### GET /api/v1/categories
Tx'lerde kullanılan kategori listesi (frontend dropdown için).

Response **200 OK**:
```json
[
  { "id": 1, "name": "Food",          "icon": "restaurant" },
  { "id": 2, "name": "Subscriptions", "icon": "subscriptions" },
  { "id": 3, "name": "Rent",          "icon": "home" },
  { "id": 4, "name": "Transport",     "icon": "directions_car" },
  { "id": 5, "name": "Entertainment", "icon": "movie" },
  { "id": 6, "name": "Groceries",     "icon": "local_grocery_store" },
  { "id": 7, "name": "Gift",          "icon": "card_giftcard" },
  { "id": 8, "name": "Health",        "icon": "fitness_center" },
  { "id": 9, "name": "Education",     "icon": "menu_book" }
]
```

`icon` field'ı Material Symbols ismi. UI'da direkt kullanılabilir.

Errors: `401`.

---

## Notifications (JWT required)

### GET /api/v1/notifications
Türetilmiş bildirim listesi. Ayrı tablo değil — son işlemlerden derive edilir.

Üç tip bildirim üretilir:
1. **`fraud`** — sender'ın flagged işlemleri (tümü, en yeniden eskiye)
2. **`received`** — son 48 saatte alınan transferler (max 5)
3. **`monthly_summary`** — bu ay kullanıcı para gönderdiyse aylık özet (1 tane)

Response **200 OK**:
```json
[
  {
    "id": "fraud-7f3a91b2-...",
    "type": "fraud",
    "title": "Şüpheli İşlem Tespit Edildi",
    "body": "50.000,00 TL'lik \"Acil havale\" işlemi yüksek risk skoru aldı (skor: 78). İncelemeyi onayla.",
    "createdAt": "2026-05-04T03:00:00Z",
    "unread": true,
    "riskScore": 78,
    "transactionId": "7f3a91b2-..."
  },
  {
    "id": "received-...",
    "type": "received",
    "title": "Para alındı",
    "body": "ali_yilmaz sana 500,00 TL gönderdi.",
    "createdAt": "2026-05-05T15:20:00Z",
    "unread": true,
    "riskScore": null,
    "transactionId": "..."
  },
  {
    "id": "monthly-2026-5",
    "type": "monthly_summary",
    "title": "Aylık özet hazır",
    "body": "Bu ay 4.250,50 TL harcadın, en yoğun kategori: Food (1.450,50 TL).",
    "createdAt": "2026-05-01T00:00:00Z",
    "unread": false,
    "riskScore": null,
    "transactionId": null
  }
]
```

Notlar:
- `unread` — fraud bildirimleri her zaman unread; received son 12 saat içindeyse unread.
- Sıralama: önce `unread: true`, sonra `createdAt` desc.
- Şu an persist edilmiyor → "okundu işaretle" backend tarafında çalışmaz (frontend kendi state'inde tutsun).

Errors: `401`.

---

## Hata Formatı (RFC 7807 ProblemDetails)

Tüm hatalar standart ProblemDetails JSON döner. UI'da `title` mesajını kullanıcıya göster:
```json
{
  "type": "https://httpstatuses.com/400",
  "title": "Insufficient funds.",
  "status": 400,
  "instance": "/api/v1/transactions/transfer"
}
```

Validation hatası (400) ek alan içerir:
```json
{
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Email": ["The Email field is required."],
    "Password": ["..."]
  }
}
```
`errors` map'ini ilgili form alanlarının altında göster.

---

## TypeScript Tipleri

```ts
export type AuthResponse = {
  token: string;
  userId: string;
  username: string;
  expiresAt: string;
};

export type WalletDto = {
  userId: string;
  balance: number;
  currency: string;
};

export type TransactionStatus =
  | "Pending" | "Completed" | "Failed" | "FlaggedForReview";

export type TransactionResponseDto = {
  id: string;
  senderUsername: string;
  receiverUsername: string;
  amount: number;
  currency: string;
  description: string | null;
  status: TransactionStatus;
  riskScore: number | null;
  category: string | null;
  createdAt: string;          // ISO 8601
  ipAddress: string | null;
  deviceId: string | null;
  channel: string | null;     // "MobileApp" | "Web" | "QR" | "Api"
  senderAccountAgeDays: number;
};

export type ProblemDetails = {
  type?: string;
  title: string;
  status: number;
  instance?: string;
  errors?: Record<string, string[]>;
};

export type UserProfileDto = {
  id: string;
  email: string;
  username: string;
  fullName: string;
  createdAt: string;
  accountAgeDays: number;
  balance: number;
  currency: string;
};

export type UserSummaryDto = {
  id: string;
  username: string;
  fullName: string;
};

export type CategoryDto = {
  id: number;
  name: string;
  icon: string | null;
};

export type CategoryBreakdownDto = {
  category: string;
  total: number;
  count: number;
};

export type MonthlyTotalDto = {
  year: number;
  month: number;
  total: number;
};

export type AnalyticsSummaryDto = {
  totalThisMonth: number;
  totalLastMonth: number;
  deltaPct: number | null;
  transactionCountThisMonth: number;
  flaggedCount: number;
  averageRiskScore: number;
  categoryBreakdown: CategoryBreakdownDto[];
  lastSixMonths: MonthlyTotalDto[];
};

export type NotificationType =
  | "fraud" | "received" | "monthly_summary" | "subscription";

export type NotificationDto = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  unread: boolean;
  riskScore: number | null;
  transactionId: string | null;
};
```

---

## Auth Notları

- Token süresi: **60 dakika**. Süresi dolduysa 401 → otomatik login'e yönlendir.
- Token claims: `sub` (userId), `username`, `email`, `jti`, `exp`, `iss`, `aud`.
- **Body'den userId asla gönderilmez** — backend kim olduğunu JWT'den anlar.
- Storage: web → `localStorage`, mobile → `expo-secure-store` / `react-native-keychain`.

---

## Demo Kullanıcılar (test için)

Şifre hepsinde: `Password123!`

| Username | Email |
|---|---|
| `furkan` | furkan@hpay.com.tr |
| `semra` | semra@hpay.com.tr |
| `ali_yilmaz` | ali@hpay.com.tr |
| `ayse` | ayse@hpay.com.tr |
| `mehmet` | mehmet@hpay.com.tr |

Her biri 75.000 TL bakiye ile başlar. Demo işlem geçmişi seed'lenmiştir (Yemeksepeti, Spotify Türkiye, Netflix, BiTaksi vb).

---

## Şu an OLMAYAN endpoint'ler

Boş yere bu route'ları çağırma — 404 alırsın.

| Beklenebilecek | Durum | Workaround |
|---|---|---|
| `POST /api/v1/auth/logout` | Yok (gerekmez) | Client'ta token'ı sil |
| `POST /api/v1/auth/refresh` | Yok | Süre dolunca yeniden login |
| `GET /api/v1/cards` | Yok | Sanal kart entity yok |
| `GET /api/v1/exchange-rates` | Yok | Döviz takibi entity yok |
| `GET /api/v1/subscriptions` | Yok | Tx'lerden `category=Subscriptions` ile filtrele |
| Group wallets | Entity hazır, endpoint yok (P1) | — |
| Notification "okundu" persist | Yok | Frontend state'inde tut |

---

## Hızlı Test

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"furkan","password":"Password123!"}' \
  | jq -r .token)

# Wallet
curl http://localhost:5000/api/v1/wallet \
  -H "Authorization: Bearer $TOKEN"

# Transfer
curl -X POST http://localhost:5000/api/v1/transactions/transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Device-Id: web-fp-test" \
  -H "X-Lyrabit-Channel: Web" \
  -d '{"receiverEmailOrUsername":"ayse","amount":100,"description":"test"}'
```

---

Soru olursa **Furkan**'a yaz. Eksik endpoint gerekirse hızlı eklenebilir.
