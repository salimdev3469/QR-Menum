# QR Menüm (Next.js 15 + Firebase)

Restoran/kafe işletmeleri için QR menü yönetim uygulaması.

## Özellikler
- Email + şifre + işletme kodu ile kayıt/giriş
- İşletme profili (slug, logo, arka plan, galeri)
- Marka uyumlu menü tasarımı (ana renk, vurgu, metin rengi, açık/koyu stil)
- Sosyal medya etkileşim linkleri (Instagram, Facebook, X, YouTube, TikTok)
- Kategori yönetimi (CRUD, arşiv, kalıcı silme, drag-drop sıralama)
- Ürün yönetimi (CRUD, arşiv, kalıcı silme, fiyat/indirim, görseller)
- Ürün varyasyonları (ör. küçük/orta/büyük fiyat seçenekleri)
- Ürün etiketleri (Şef Özel, Sezonluk, Yeni, Fırsat, Favori + özel etiket)
- Alerjen uyarıları (preset + özel alan)
- Promosyon / kampanya yönetimi (tüm menü, kategori veya ürün bazlı)
- QR stant siparişi (₺50/adet, hazır tasarım veya görsel yükleme)
- Sistem satın alım talep formu (plan + dönem seçimi)
- Platform admin paneli (`/admin`) müşteri/satış/stant siparişi takibi
- QR kod oluşturma ve PNG indirme
- Public menü: `/menu/[slug]` (girişsiz)
- TR / EN / RU / AR dil desteği
- Gemini ile kaydetme anında public metin çevirisi (fallback destekli)
- Paket bazlı gerçek modül kısıtları (Starter/Growth/Premium)

## Teknoloji
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- React Hook Form + Zod
- `qrcode`
- `browser-image-compression`

## Kurulum
```bash
npm install
cp .env.example .env.local
npm run dev
```

Uygulama: `http://localhost:3000`

## Environment Değişkenleri
`.env.local` içinde:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

GEMINI_API_KEY=
```

## Firebase Rules
- Firestore rules: `firestore.rules`
- Storage rules: `storage.rules`
- Firebase config: `firebase.json`

Deploy için (Firebase CLI):
```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### Admin kullanıcı
Admin paneline erişim için ilgili kullanıcı dokümanında `role` alanını `"admin"` yapın:

`users/{uid}.role = "admin"`

Paket yönetimi:
- Müşteri paketleri yalnızca admin panelinden (`/admin/customers`) değiştirilir.
- İşletme sahibi dashboard üzerinden paket yükseltme/düşürme yapamaz.

## Firestore Veri Modeli
Detaylar: `firestore/schema.md`

## Scriptler
```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Notlar
- Görseller client-side sıkıştırılır (WebP, max 1200px, hedef < 500KB).
- Ürün başına max 3 görsel, galeri max 10 görsel kuralı uygulanır.
- Slug restoran adına göre otomatik güncellenir, çakışmada `-2`, `-3` eklenir.
