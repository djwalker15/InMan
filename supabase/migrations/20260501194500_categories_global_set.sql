-- Reconcile the system-default categories with the documented Tier 1 set
-- (20 globals listed in docs/InMan Implementation Plan.md §Seed Data Strategy).
--
-- Phase 3's inventory slice (20260429141509_phase3_inventory_slice.sql) seeded
-- 6 globals — three of which (Pantry, Refrigerated, Other) aren't in the
-- documented set, and one (Spices) needs renaming to "Spices & Seasonings".
-- Frozen and Beverages already match.

-- Rename Spices → Spices & Seasonings (preserves category_id; nothing
-- references it yet, but the rename keeps history clean if anything starts to).
update public.categories
set name = 'Spices & Seasonings',
    description = 'Salt, pepper, dried herbs, blends, rubs.'
where crew_id is null
  and name = 'Spices'
  and deleted_at is null;

-- Soft-delete the three globals that aren't part of the documented Tier 1 set.
-- RLS already filters deleted_at IS NULL so they vanish from app queries; the
-- rows stay around for audit per the project's never-hard-delete pattern.
update public.categories
set deleted_at = now()
where crew_id is null
  and name in ('Pantry', 'Refrigerated', 'Other')
  and deleted_at is null;

-- Insert the 17 missing Tier 1 categories (20 documented minus Frozen,
-- Beverages, and the renamed Spices & Seasonings).
insert into public.categories (crew_id, name, description) values
  (null, 'Produce',              'Fresh fruits, vegetables, and herbs.'),
  (null, 'Dairy & Eggs',         'Milk, cream, butter, cheese, yogurt, eggs.'),
  (null, 'Meat & Poultry',       'Fresh and packaged beef, pork, poultry, and game.'),
  (null, 'Seafood',              'Fresh, frozen, and canned fish and shellfish.'),
  (null, 'Bakery & Bread',       'Loaves, rolls, tortillas, and other baked goods.'),
  (null, 'Grains & Pasta',       'Rice, pasta, noodles, oats, and grain bowls.'),
  (null, 'Canned & Jarred',      'Shelf-stable beans, vegetables, broths, and packaged goods.'),
  (null, 'Condiments & Sauces',  'Ketchups, mustards, mayos, hot sauces, marinades, dressings.'),
  (null, 'Oils & Vinegars',      'Cooking oils, dressings, finishing oils, vinegars.'),
  (null, 'Baking',               'Sugars, sweeteners, flours, leaveners, baking aids.'),
  (null, 'Snacks',               'Chips, crackers, pretzels, candy, jerky, granola, trail mix.'),
  (null, 'Deli & Prepared',      'Sliced meats, cheeses, and ready-to-eat refrigerated items.'),
  (null, 'Liquor',                'Distilled spirits — vodka, gin, rum, tequila, whiskey, liqueurs.'),
  (null, 'Beer',                 'Beer, ale, lager, cider.'),
  (null, 'Wine',                 'Red, white, rosé, sparkling.'),
  (null, 'Mixers & Bar Supplies','Bitters, syrups, juices, vermouth, shrubs, garnishes.'),
  (null, 'Cleaning & Supplies',  'Dish soap, sanitizer, towels, sponges, trash bags, paper goods.');
