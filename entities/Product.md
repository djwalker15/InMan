# Product

> Part of [[Feature 3 - Item Catalog]]

Universal product definition. Lives outside any [[Crew]] (or optionally scoped to a [[Crew]] for custom products). This is the "what is this thing?" layer — brand, barcode, image, size.

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `product_id` | PK | |
| `name` | text | |
| `brand` | text | |
| `barcode` | text | UPC/EAN |
| `image_url` | text | |
| `default_category_id` | FK → [[Category]] | |
| `size_value` | numeric | |
| `size_unit` | text | |
| `crew_id` | FK → [[Crew]] | Nullable — null = master catalog, populated = crew-private |
| `created_by` | text FK → [[User]] | Clerk user ID |
| `created_at` | timestamp | |
| `updated_at` | timestamp | Auto-maintained by trigger |
| `deleted_at` | timestamp | Nullable — soft delete |

## Key Decisions

- **Shared master catalog:** Products like "Cholula Hot Sauce, 5 oz" exist once globally. Multiple [[Crew]]s reference the same Product via their own [[InventoryItem]]s.
- **Custom products:** [[Crew]]s can create products not in the master catalog (e.g., a homemade spice blend, a local vendor's specialty). These have `crew_id` set and are only visible to that [[Crew]].
- **Barcode scanning:** A UPC resolves to a Product regardless of which [[Crew]] is scanning it.
- **Soft delete:** Uses `deleted_at`. Historical [[InventoryItem]]s, [[Flow]]s, and [[RecipeIngredient]]s can still reference deleted products.

## Relationships

- Has a default [[Category]]
- Referenced by [[InventoryItem]] via `product_id`
- Referenced by [[RecipeIngredient]] via `product_id`
- Referenced by [[ShoppingListItem]] via `product_id`
- Referenced by [[Recipe]] as `output_product_id`

## See Also

- [[Nullable crew_id Pattern]]
