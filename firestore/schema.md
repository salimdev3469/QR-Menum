# Firestore Veri Modeli

## `users/{userId}`
- `id: string`
- `name: string`
- `email: string`
- `phone: string`
- `businessCode: string`
- `restaurantId: string`
- `role: "owner" | "admin"`
- `createdAt: Timestamp`

## `restaurants/{restaurantId}`
- `id: string`
- `ownerUserId: string`
- `name: string`
- `managerName: string`
- `phone: string`
- `address: string`
- `slug: string`
- `logoUrl: string`
- `backgroundImageUrl: string`
- `isActive: boolean`
- `createdAt: Timestamp`
- `updatedAt: Timestamp`
- `nameI18n: { tr, en, ru, ar }`
- `addressI18n: { tr, en, ru, ar }`
- `menuDesign: { primaryColor, accentColor, textColor, backgroundStyle }`
- `socialLinks: { instagram, facebook, x, youtube, tiktok }`
- `initialPlan: "starter" | "growth" | "premium"` (kayıt anındaki ilk paket)
- `plan: "starter" | "growth" | "premium"` (güncel paket)
- `tableCount: number`
- `floorCount: number` (1-20)
- `floorTableCounts: number[]` (kat sırasına göre masa adetleri, örn. `[5, 10]`)

Starter deneme takibi:
- Başlangıç paketi `starter` olan restoranlarda deneme süresi `createdAt` baz alınarak 14 gün olarak hesaplanır.

## `restaurants/{restaurantId}/gallery/{imageId}`
- `id: string`
- `imageUrl: string`
- `sortOrder: number`
- `createdAt: Timestamp`

## `restaurants/{restaurantId}/categories/{categoryId}`
- `id: string`
- `name: string`
- `nameI18n: { tr, en, ru, ar }`
- `sortOrder: number`
- `isActive: boolean`
- `isArchived: boolean`
- `archivedAt: Timestamp | null`
- `createdAt: Timestamp`
- `updatedAt: Timestamp`

## `restaurants/{restaurantId}/menuItems/{menuItemId}`
- `id: string`
- `categoryId: string`
- `name: string`
- `nameI18n: { tr, en, ru, ar }`
- `description: string`
- `descriptionI18n: { tr, en, ru, ar }`
- `price: number`
- `discountPrice: number | null`
- `isDiscounted: boolean`
- `isAvailable: boolean`
- `sortOrder: number`
- `imageUrls: string[]`
- `labels: string[]`
- `allergens: string[]`
- `variations: [{ id, name, price, isDefault, isAvailable, sortOrder }]`
- `isArchived: boolean`
- `archivedAt: Timestamp | null`
- `createdAt: Timestamp`
- `updatedAt: Timestamp`

## `restaurants/{restaurantId}/promotions/{promotionId}`
- `id: string`
- `title: string`
- `titleI18n: { tr, en, ru, ar }`
- `description: string`
- `descriptionI18n: { tr, en, ru, ar }`
- `scope: "all" | "category" | "menuItem"`
- `targetId: string | null`
- `startsAt: string` (ISO / datetime-local)
- `endsAt: string` (ISO / datetime-local)
- `isActive: boolean`
- `isArchived: boolean`
- `createdAt: Timestamp`
- `updatedAt: Timestamp`

## `restaurants/{restaurantId}/waiterCalls/{callId}`
- `id: string`
- `tableNumber: number`
- `isActive: boolean`
- `requestedAt: Timestamp`
- `resolvedAt: Timestamp | null`
- `updatedAt: Timestamp`

## `restaurants/{restaurantId}/tableOrders/{orderId}`
- `id: string`
- `tableNumber: number`
- `floorNumber: number`
- `note: string`
- `items: [{ menuItemId, name, unitPrice, quantity, totalPrice }]`
- `itemCount: number`
- `totalAmount: number`
- `status: "open" | "closed"`
- `createdAt: Timestamp`
- `updatedAt: Timestamp`
- `resolvedAt: Timestamp | null`

## `systemOrders/{orderId}`
- `id: string`
- `customerName: string`
- `businessName: string`
- `email: string`
- `phone: string`
- `planName: "Starter" | "Growth" | "Premium"`
- `billingCycle: "monthly" | "annual"`
- `note: string`
- `source: "pricing_page" | "manual"`
- `status: "new" | "contacted" | "won" | "lost"`
- `createdAt: Timestamp`
- `updatedAt: Timestamp`

## `standOrders/{orderId}`
- `id: string`
- `customerName: string`
- `businessName: string`
- `email: string`
- `phone: string`
- `tableCount: number`
- `unitPrice: number` (50)
- `totalPrice: number`
- `standModel: "stand" | "sticker" | "button"`
- `designType: "preset" | "upload"`
- `designPreset: string | null`
- `designUploadUrl: string`
- `note: string`
- `status: "new" | "contacted" | "in_production" | "shipped" | "completed" | "cancelled"`
- `createdAt: Timestamp`
- `updatedAt: Timestamp`
