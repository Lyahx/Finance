# LyraBit — Frontend Brief

> **Slogan:** PayPal para taşır, biz paranı yönetiriz.
>
> Bu doküman LyraBit backend'inin sunduğu API üzerinden web (Next.js) ve mobile (React Native) ekiplerinin oluşturacağı UI'ın **tek kaynaklı brief'idir**. Sayfaları, endpoint'leri, tipleri, akışları ve kuralları içerir.

---

## İçindekiler

1. [Proje özeti](#proje-özeti)
2. [Backend'e bağlanma](#backende-bağlanma)
3. [Tasarım yönü](#tasarım-yönü)
4. [API endpoint referansı](#api-endpoint-referansı)
5. [TypeScript tipleri](#typescript-tipleri)
6. [Sayfa sayfa UI](#sayfa-sayfa-ui)
7. [Demo akışı](#demo-akışı-jüriye-gösterilecek)
8. [Şu an OLMAYAN endpoint'ler](#şu-an-olmayan-endpointler)
9. [Cross-cutting davranışlar](#cross-cutting-davranışlar)
10. [Hızlı kurulum](#hızlı-kurulum)

---

## Proje Özeti

**LyraBit** "PayPal alternatifi" hackathon teması için geliştirilen, sıradan ödeme uygulamasının ötesine geçen **akıllı finans asistanı**. Üç pillar:

1. **Akıllı Fraud Tespiti** — her transferde 7 kurallı risk skoru, gerçek zamanlı flag.
2. **Harcama Asistanı** — kategorize edilmiş işlemler, abonelik takibi, harcama trendleri.
3. **Anlık Transfer** — kullanıcılar arası çekilmez para hareketi.

Frontend'in görevi bu üç pillar'ı **görsel olarak ön plana çıkarmak** — sıradan bir e-cüzdan UI'ı yapmıyoruz, kullanıcının "asistanı" gibi hissetmesini istiyoruz.

---

## Backend'e Bağlanma

| Ortam | Base URL |
|---|---|
| Local development | `http://localhost:5000` |
| API docs (interaktif) | `http://localhost:5000/scalar/v1` |

**Auth:** JWT Bearer.
- Login/Register → response'tan `token` al → `localStorage` (web) / `expo-secure-store` (mobile) içinde sakla.
- Sonraki tüm korumalı isteklerde:
  ```
  Authorization: Bearer <token>
  ```
- Token expiry: 60 dk. Süresi dolduysa 401 dönüyor → otomatik login'e yönlendir.
- **Body'den userId asla gönderilmez.** Backend kim olduğunu JWT'den anlar.

**Custom header'lar (transfer endpoint'inde gönderilmesi önerilen):**
- `X-Device-Id: <device fingerprint>` — fraud detection için
- `X-Lyrabit-Channel: MobileApp | Web | QR | Api` — analitik için (default: `Api`)

**Hata formatı:** RFC 7807 ProblemDetails JSON.
```json
{
  "type": "https://httpstatuses.com/400",
  "title": "Insufficient funds.",
  "status": 400,
  "instance": "/api/v1/transactions/transfer"
}
```
UI'da `title` mesajını kullanıcıya göster.

**Validation hatası (400) ek field:**
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

## Tasarım Yönü

| Konu | Öneri |
|---|---|
| **Renk paleti** | Trust + smart hissi → koyu mavi/mor primary, mint yeşil vurgu, amber/turuncu (FlaggedForReview), kırmızı (Failed) |
| **Tipografi** | Web: Inter / Manrope. Mobile: system font |
| **İkon seti** | Material Symbols. Backend `category.icon` field'ı zaten Material Symbols ismi gönderiyor (`restaurant`, `subscriptions`, `home`, `directions_car`, `movie`, `local_grocery_store`, `card_giftcard`, `fitness_center`, `menu_book`) |
| **Currency** | `Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })` → "75.000,00 ₺" |
| **Tarih** | `Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })` |
| **Status renkleri** | `Pending` gri, `Completed` yeşil, `Failed` kırmızı, `FlaggedForReview` amber |
| **Risk skoru görselleştirme** | 0-100 arası bar/gauge. 0-30 yeşil, 31-69 sarı, 70-100 kırmızı |

---

## API Endpoint Referansı

### 🔓 Auth (Anonymous)

#### `POST /api/v1/auth/register`
Yeni kullanıcı + cüzdan oluşturur. Cüzdan otomatik açılır (initial balance 0).

**Body:**
```json
{
  "email": "user@example.com",
  "username": "kullanici1",
  "password": "Password123!",
  "fullName": "Ad Soyad"
}
```

**Validation:**
| Alan | Kural |
|---|---|
| `email` | required, email formatı, max 150 |
| `username` | required, 3-50 char, regex `^[a-zA-Z0-9_]+$` |
| `password` | required, 8-100 char |
| `fullName` | required, 2-150 char |

**Success — `201 Created`:**
```json
{
  "token": "eyJhbGciOi...",
  "userId": "15572bfd-1eca-463e-9c92-c477f37026fc",
  "username": "kullanici1",
  "expiresAt": "2026-05-05T19:46:07.42Z"
}
```

**Errors:**
- `400` — `"Email is already registered."`
- `400` — `"Username is already taken."`
- `400` — Validation hatası

---

#### `POST /api/v1/auth/login`
Email veya username ile giriş.

**Body:**
```json
{
  "emailOrUsername": "kullanici1",
  "password": "Password123!"
}
```

**Validation:**
| Alan | Kural |
|---|---|
| `emailOrUsername` | required, 3-150 char |
| `password` | required, 8-100 char |

**Success — `200 OK`:** `AuthResponse` (yukarıdaki gibi).

**Errors:**
- `401` — `"Invalid credentials."` (kullanıcı yanlış veya şifre yanlış — security'den dolayı aynı mesaj)

---

### 💰 Wallet `[Auth: Bearer]`

#### `GET /api/v1/wallet`
Giriş yapan kullanıcının cüzdanı.

**Success — `200 OK`:**
```json
{
  "userId": "15572bfd-...",
  "balance": 22086.00,
  "currency": "TRY"
}
```

**Errors:** `401`, `404` (`"Wallet not found."`)

---

#### `POST /api/v1/wallet/add-funds`
Demo amaçlı para ekleme. Atomik transaction içinde.

**Body:**
```json
{ "amount": 5000 }
```

**Validation:** `amount > 0`, `≤ 1.000.000.000`

**Success — `200 OK`:** Güncel `WalletDto`.

**Errors:**
- `400` — `"Amount must be greater than zero."`
- `401`
- `404` — `"Wallet not found."`

---

### 💸 Transactions `[Auth: Bearer]`

#### `POST /api/v1/transactions/transfer`
Para transferi. Atomik (rollback garanti) + race-safe (yetersiz bakiye SQL guard) + fraud detection.

**Headers:**
```
Authorization: Bearer <token>
X-Device-Id: ios-7f3a91b2c4d8       (opsiyonel)
X-Lyrabit-Channel: MobileApp        (opsiyonel, default Api)
```

**Body:**
```json
{
  "receiverEmailOrUsername": "ayse",
  "amount": 250,
  "description": "Pizza paylaşımı"
}
```

**Validation:**
| Alan | Kural |
|---|---|
| `receiverEmailOrUsername` | required, 3-150 char |
| `amount` | required, > 0, ≤ 1.000.000.000 |
| `description` | optional, max 500 char |

**Success — `201 Created`:** `TransactionResponseDto`
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
  "deviceId": "ios-abc123",
  "channel": "MobileApp",
  "senderAccountAgeDays": 30
}
```

**`status` değerleri:**
- `"Completed"` — başarılı, para hareketi gerçekleşti
- `"FlaggedForReview"` — risk skoru ≥ 70, **transfer yine de gerçekleşti** ama incelemeye düştü → UI'da amber uyarı göster
- `"Pending"` / `"Failed"` — şu an üretilmiyor

**Errors:**
- `400` — `"Amount must be greater than zero."`
- `400` — `"Cannot transfer to yourself."`
- `400` — `"Insufficient funds."` ⭐ UI'da öne çıkar
- `401` — token yok / sender problem
- `404` — `"Receiver not found."`

---

#### `GET /api/v1/transactions`
Giriş yapan kullanıcının tüm işlem geçmişi (gönderdiği + aldığı).

**Success — `200 OK`:** `TransactionResponseDto[]` (CreatedAt desc).

**Notlar:**
- Pagination yok. Liste küçük, in-memory filtre/sayfalama yeterli.
- Filtre/sayfalama gerekirse backend'e query param eklenebilir, söyle.

**Errors:** `401`.

---

#### `GET /api/v1/transactions/{id}`
Tek işlem detayı. **Sadece sender veya receiver görebilir.**

**Path:** `id` (Guid)

**Success — `200 OK`:** `TransactionResponseDto`.

**Errors:**
- `401` — `"You are not a participant of this transaction."` (başkasının transferi)
- `404` — `"Transaction not found."`

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
  | "Pending"
  | "Completed"
  | "Failed"
  | "FlaggedForReview";

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
  createdAt: string;
  ipAddress: string | null;
  deviceId: string | null;
  channel: string | null;
  senderAccountAgeDays: number;
};

export type RegisterRequest = {
  email: string;
  username: string;
  password: string;
  fullName: string;
};

export type LoginRequest = {
  emailOrUsername: string;
  password: string;
};

export type TransferRequest = {
  receiverEmailOrUsername: string;
  amount: number;
  description?: string;
};

export type AddFundsRequest = {
  amount: number;
};

export type ProblemDetails = {
  type?: string;
  title: string;
  status: number;
  instance?: string;
  errors?: Record<string, string[]>;
};

export type TokenClaims = {
  sub: string;        // userId
  username: string;
  email: string;
  jti: string;
  exp: number;
  iss: string;
  aud: string;
};
```

---

## Sayfa Sayfa UI

### Web (Next.js) için 11 sayfa

| # | Sayfa | Önem | Auth |
|---|---|---|---|
| 1 | Landing | P0 | — |
| 2 | Login | P0 | — |
| 3 | Register | P0 | — |
| 4 | Dashboard ⭐ | P0 | required |
| 5 | Transfer ⭐ | P0 | required |
| 6 | Transactions | P0 | required |
| 7 | Transaction Detail | P0 | required |
| 8 | Security Center ⭐⭐ | P0 | required |
| 9 | Spending Insights ⭐⭐ | P0 | required |
| 10 | Profile / Settings | P1 | required |
| 11 | Add Funds (modal) | P0 | required |

⭐ = LyraBit'in farkını gösteren sayfalar — jüriye bunlar gösterilecek.

### Mobile (React Native) — 5 ana tab
1. **Home** (Dashboard)
2. **Transfer** (göndermek için)
3. **Activity** (Transactions)
4. **Insights** (Spending + Security birleşik)
5. **Profile**

---

### 1. Landing Page (Web)

**Amaç:** Marketing + ürün açıklaması + giriş CTA.

**İçerik:**
- Hero: Slogan + 2 CTA ("Demo'yu Dene" → Login, "Kayıt Ol" → Register)
- 3-4 özellik kartı: Akıllı Fraud Tespiti, Kategorize Harcama, Anlık Transfer, Mobil Erişim
- "Güvenlik" anchor section: BCrypt, JWT auth, fraud detection açıklaması (statik)
- Footer

**API:** Yok — pure marketing.

---

### 2. Login

**Amaç:** Kayıtlı kullanıcı girişi.

**Form:**
- `emailOrUsername` (string, 3-150)
- `password` (string, 8-100)

**API:** `POST /api/v1/auth/login`

**Akış:**
1. Form doldurulur, submit edilir.
2. Loading state.
3. Success → `token`'ı sakla, `/dashboard`'a yönlendir.
4. `401` → "Email veya şifre hatalı." mesajı (form altında).
5. Validation hatası → ilgili input altında göster.

**Demo kullanıcılar (test için):**
- `furkan` / `Password123!`
- `semra` / `Password123!`
- `ali_yilmaz` / `Password123!`
- `ayse` / `Password123!`
- `mehmet` / `Password123!`

---

### 3. Register

**Amaç:** Yeni hesap aç.

**Form:**
- `email` (string, email formatı, max 150)
- `username` (string, 3-50, regex `^[a-zA-Z0-9_]+$`)
- `password` (string, min 8)
- `fullName` (string, 2-150)

**Client-side validation:**
- Email format check
- Username regex match (yumuşak ipucu metni: "Sadece harf, rakam ve _")
- Password strength indicator (görsel meter — opsiyonel)

**API:** `POST /api/v1/auth/register`

**Akış:**
1. Form doldurulur.
2. Submit → backend
3. Success → `token`'ı sakla, `/dashboard`'a yönlendir.
4. `400` → server-side hatalar:
   - `"Email is already registered."` → email field altında
   - `"Username is already taken."` → username field altında
   - Validation hatası → `errors` map'i kullan

---

### 4. Dashboard ⭐

**Amaç:** Anasayfa — kullanıcının asistanıyla karşılaştığı ekran.

**Layout (web):**
- Sol kolon: Büyük cüzdan kartı (bakiye + "Para Ekle" CTA)
- Sağ kolon: Smart insights kartları + son işlemler

**Layout (mobile):**
- Üst: Cüzdan kartı (kompakt)
- Orta: Hızlı aksiyonlar (Para Gönder, Para Ekle)
- Alt: Son işlemler listesi

**Bileşenler:**

#### Wallet Card
- Bakiye (büyük, currency formatlı)
- Currency badge ("TRY")
- "Para Ekle" CTA (modal açar — Sayfa 11)

#### Smart Insights Card
- "Bu ay X TL harcadın, geçen aydan %Y az/çok." (client-side hesap)
- Kullanıcının sender olduğu, son 30 günlük transaction'ları toplama

#### Subscriptions Card
- `category === "Subscriptions"` filtreli son 30 gün transactions
- "Aylık abonelik gideriniz: 274 TL"
- Spotify / Netflix / vb. listele

#### Security Badge
- Eğer `status === "FlaggedForReview"` transaction varsa kırmızı uyarı: "X işlem incelenmeyi bekliyor. → Detay"
- Tıklanınca Security Center'a (Sayfa 8) götürür

#### Recent Transactions
- Son 5 işlem (status renk koduyla, sender/receiver, amount, tarih)

**API:**
- `GET /api/v1/wallet`
- `GET /api/v1/transactions` (ilk 5'i göster, geri kalanını agregat için kullan)

---

### 5. Transfer ⭐

**Amaç:** Para gönder.

**Form:**
- `receiverEmailOrUsername` (text input)
- `amount` (number input, decimal)
- `description` (textarea, opsiyonel)

**Akış:**
1. Form doldurulur.
2. Submit'te API'ye POST + headers (`X-Device-Id`, `X-Lyrabit-Channel`).
3. Loading.
4. Yanıta göre:
   - `status: "Completed"` → ✅ Yeşil success ekranı: "Transfer başarılı! 250 TL Ayşe'ye gönderildi."
   - `status: "FlaggedForReview"` → ⚠️ Amber warning ekranı: "Transfer gerçekleşti ancak güvenlik ekibimiz inceliyor." + risk skorunu göster (gauge)
   - `400 "Insufficient funds."` → "Yetersiz bakiye"
   - `400 "Cannot transfer to yourself."` → "Kendine transfer yapamazsın"
   - `404 "Receiver not found."` → "Alıcı bulunamadı, email/username doğru mu?"

**API:** `POST /api/v1/transactions/transfer`

**Bonus (P1):** Alıcı autocomplete — backend search endpoint yok, ama sen Furkan'a söylersen ekleyebiliriz.

---

### 6. Transactions (Activity)

**Amaç:** Tüm işlem geçmişi.

**Layout:** Liste, sonsuz scroll veya basit pagination (client-side).

**Filtreler (client-side, ilk fetch sonrası):**
- Tarih aralığı (date range picker)
- Sent / Received toggle
- Status (multi-select chip)
- Kategori (multi-select chip)
- Search box (description içinde arama)

**Liste item:**
- Avatar (initials veya placeholder)
- Sender → Receiver username (sen değilsen highlight et)
- Açıklama (varsa)
- Kategori chip (varsa, icon ile)
- Tutar (sent ise -, received ise +, renk farkı)
- Tarih (relative: "2 saat önce") veya tam tarih
- Status badge

**API:** `GET /api/v1/transactions`

**Tıklayınca:** Transaction Detail (Sayfa 7).

---

### 7. Transaction Detail

**Amaç:** Tek işlemin tüm detayı.

**Üst kısım (header):**
- Tutar (büyük)
- Status badge
- Sender → Receiver

**Detaylar:**
- Açıklama
- Kategori (icon + label)
- Tarih (tam, TR formatı)
- Risk Skoru (gauge görsel — eğer `riskScore != null`)
- IP adresi
- Cihaz (DeviceId)
- Kanal (MobileApp/Web/QR/Api)
- Sender hesap yaşı (`senderAccountAgeDays` günü)
- ID (kopyalanabilir)

**Flagged ise:**
- Üstte amber uyarı banner: "Bu işlem yüksek risk skoru aldı. Detaylı inceleme için Security Center'a git."

**API:** `GET /api/v1/transactions/{id}`

---

### 8. Security Center ⭐⭐

**Amaç:** LyraBit'in farkı. "Asistan" hissi. Risk insights + flagged işlemler.

**Bölümler:**

#### Üst Özet Kartı
- Toplam transaction sayısı (last 30d)
- Flagged transaction sayısı
- Ortalama risk skoru
- Hesap yaşı (gün)

#### Flagged Transactions
- `status === "FlaggedForReview"` transactions
- Liste halinde, en yeniden eskiye
- Her item'da: tutar, alıcı, tarih, risk skoru
- Tıklayınca detay (Sayfa 7)

#### Activity Timeline
- Son 30 günün transactions'ları
- Gece (UTC 23:00-02:00 ≈ TR 02:00-05:00) yapılanlar amber dot
- ≥10K TL olanlar kırmızı dot
- Görsel timeline çizgisi

#### Risk Score Histogram
- 0-100 aralığında bar chart
- Kullanıcının normal aralığı vs aykırılar
- Ortalama çizgisi

#### Güvenlik Önerileri (statik kartlar)
- "Şüpheli IP tespiti aktif"
- "Cihaz parmak izi takibi"
- "BCrypt ile şifre hash'leme"
- "JWT token süre limiti"

**API:** `GET /api/v1/transactions` → client-side filtre/aggregate.

---

### 9. Spending Insights ⭐⭐

**Amaç:** "Akıllı asistan" pillar'ının ikinci ayağı — harcama analizi.

**Görseller:**

#### Pie Chart — Bu Ayın Kategori Dağılımı
- `category` field'ına göre grupla
- Her kategori için renk + label + tutar
- "Diğer" bucket null kategorilerin toplamı

#### Bar Chart — Son 6 Ay Aylık Toplam
- X ekseni: ay
- Y ekseni: harcama tutarı
- Trend çizgisi opsiyonel

#### Subscription Tracker
- `category === "Subscriptions"` filtreli recurring transferler
- Her aboneliğin son ödeme tarihi + ortalama tutar
- "Aylık toplam abonelik: 274 TL"

#### Top Recipients
- En çok kime para gidiyor
- Liste: receiver username + toplam gönderilen + son tarih

#### Smart Insights Cümleleri
- "Bu ay geçen aydan %12 daha çok harcadın"
- "En büyük kategori: Yiyecek (1.250 TL)"
- "3 aktif aboneliğin var"

**API:** `GET /api/v1/transactions` → client-side aggregate (Recharts / Victory Native).

---

### 10. Profile / Settings (P1)

**Amaç:** Kullanıcı hesap bilgisi + çıkış.

**Gösterilecek:**
- Username
- Email
- FullName
- Üye olma tarihi (JWT'de yok — backend `/me` endpoint'i eklenmeli, P1)

**Aksiyonlar:**
- Çıkış yap → token'ı sil → `/login`'e yönlendir

**API:** Henüz `/users/me` yok. JWT'yi decode et, claim'lerden bilgi al:
```ts
import { jwtDecode } from "jwt-decode";

const claims = jwtDecode<TokenClaims>(token);
// claims.username, claims.email
```

---

### 11. Add Funds Modal

**Amaç:** Dashboard'dan tetiklenen demo modal.

**Form:**
- `amount` (number, > 0)

**Akış:**
1. Modal aç
2. Tutar gir
3. Submit → API
4. Success → Modal'ı kapat, dashboard'da bakiyeyi yenile (toast: "5.000 TL eklendi")

**API:** `POST /api/v1/wallet/add-funds`

---

## Demo Akışı (jüriye gösterilecek)

1. **Landing** → "Demo'yu Dene" CTA tıkla
2. **Login** → `furkan` / `Password123!`
3. **Dashboard** → Bakiye + Spotify/Netflix abonelikleri kartı + "1 flagged işlem" uyarısı
4. **Security Center** ⭐ → 50.000 TL'lik "Acil havale" işlemi flagged görünüyor (gece TR 03:00, büyük tutar, ilk kez gönderim)
5. **Spending Insights** ⭐ → kategori pie chart, abonelik tracker, aylık trend
6. **Transfer** → küçük transfer dene (örn. Ayşe'ye 250 TL "Pizza") → ✅ Completed
7. **Transfer** (fraud demo) → 30.000+ TL ve hiç tanımadığın birine → ⚠️ FlaggedForReview, risk skor gauge'u 70+ gösteriyor
8. **Transactions** → tüm geçmiş, filtre demo'su
9. **Add Funds** → bakiyeye 10.000 TL ekle (demo amaçlı)

---

## Şu an OLMAYAN endpoint'ler

Boş yere bu route'ları çağırma — 404 alırsın. Bir tanesi gerçekten lazımsa Furkan'a söyle.

| Beklenebilecek endpoint | Durum | Workaround |
|---|---|---|
| `GET /api/v1/users/me` | Yok | JWT decode → `username`, `email` claim'leri |
| `PATCH /api/v1/users/me` | Yok (P1) | — |
| `POST /api/v1/auth/logout` | Yok (gerekmez) | Client tarafında token'ı sil, redirect |
| `POST /api/v1/auth/refresh` | Yok | Token süresi dolunca yeniden login |
| `GET /api/v1/users/search?q=...` | Yok | Transfer formunda autocomplete istiyorsan söyle |
| `GET /api/v1/categories` | Yok | TransactionResponseDto'daki `category` field'ı yeter |
| `POST /api/v1/transactions/{id}/confirm` | Yok (P1) | Flagged onaylama |
| `GET /api/v1/transactions/analytics/summary` | Yok | Client-side aggregate |
| `GET /api/v1/devices` | Yok (P1) | — |
| Group wallets endpoint'leri | Entity hazır, endpoint yok (P1) | — |

---

## Cross-cutting Davranışlar

### Header'lar

| Header | Tüm istekler? | Açıklama |
|---|---|---|
| `Content-Type: application/json` | Body olan istekler | Standart |
| `Authorization: Bearer <token>` | Korumalı endpoint'ler | Auth gerekli endpoint'lerde |
| `X-Device-Id` | Transfer'de gönder | Fraud detection sinyali |
| `X-Lyrabit-Channel` | Transfer'de gönder | `MobileApp`, `Web`, `QR`, `Api` |

### Token Storage

| Platform | Yöntem |
|---|---|
| Web (Next.js) | `localStorage` (basit, dev için yeter) |
| RN (Expo) | `expo-secure-store` veya `react-native-keychain` |

### Token Decode

```ts
import { jwtDecode } from "jwt-decode";

const claims = jwtDecode<TokenClaims>(token);
// { sub, username, email, exp, iss, aud, jti }

const isExpired = claims.exp * 1000 < Date.now();
```

### CORS

Açık (`AllowAnyOrigin/Method/Header`) — hackathon. Her yerden çağırabilirsin.

### Currency / Date Formatlaması

```ts
const tlFormat = (n: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(n);

const dateFormat = (iso: string) =>
  new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));

const relativeTime = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'şimdi';
  if (minutes < 60) return `${minutes} dakika önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün önce`;
  return dateFormat(iso);
};
```

### Hata Yönetimi (örnek fetch wrapper)

```ts
async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('lyrabit_token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const problem: ProblemDetails = await res.json().catch(() => ({
      title: 'Bilinmeyen hata',
      status: res.status,
    }));
    if (res.status === 401) {
      localStorage.removeItem('lyrabit_token');
      window.location.href = '/login';
    }
    throw problem;
  }

  return res.json();
}
```

### Mobile (RN) Network Setup

```env
# .env (Expo)
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000      # Android emulator
# EXPO_PUBLIC_API_URL=http://192.168.1.X:5000 # Fiziksel cihaz (host IP)
# EXPO_PUBLIC_API_URL=http://localhost:5000   # iOS simulator
```

---

## Hızlı Kurulum

### Backend'i lokalde çalıştırmak

```bash
# Repo root'unda
docker compose up -d --build
```

İlk seferde ~3-5 dakika (image'lar iniyor). Sonraki run'lar saniyeler.

**Hazır olduğunu doğrula:**
```bash
docker compose ps
docker compose logs -f lyrabit-api
```

`Database is ready.` mesajını gör → API kullanılabilir.

**Erişim:**
- API: `http://localhost:5000`
- Scalar UI (interaktif test): `http://localhost:5000/scalar/v1`

### Frontend setup

#### Next.js (Web)
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### React Native (Expo)
```env
# .env
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000
```

### Hızlı bir uçtan uca test

```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"furkan","password":"Password123!"}'

# Token'ı kopyala, sonra:
TOKEN="<token-buraya>"

# Wallet
curl http://localhost:5000/api/v1/wallet \
  -H "Authorization: Bearer $TOKEN"

# Transactions
curl http://localhost:5000/api/v1/transactions \
  -H "Authorization: Bearer $TOKEN"

# Transfer
curl -X POST http://localhost:5000/api/v1/transactions/transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Device-Id: web-test-fp" \
  -H "X-Lyrabit-Channel: Web" \
  -d '{"receiverEmailOrUsername":"ayse","amount":100,"description":"test"}'
```

---

## Sorular?

Backend tarafında yeni alan / endpoint / değişiklik gerekirse **Furkan**'a yaz. Hızlıca eklenebilir.

İletişim için bekleyen sorular varsa Slack/Discord'da ping at.

🚀 İyi kodlamalar.
