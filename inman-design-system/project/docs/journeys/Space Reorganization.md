# User Journey: Space Reorganization

> Covers restructuring the Space hierarchy itself — renaming, moving, merging, splitting, deleting, and reclassifying Space nodes
> Referenced by [[InMan User Journeys]] #25

---

## Overview

Space Reorganization is about changing the **hierarchy structure**, not moving items within it (that's [[Journey - Moving Items]]). This happens after a kitchen renovation, adding new storage, combining cabinets, or realizing the initial setup doesn't match reality.

Six operations are supported: rename, move, merge, delete, split, and reclassify. Simple operations (rename, reclassify) happen **inline in the tree editor**. Complex operations (move, merge, delete with items, split) use a **dedicated reorganization mode** with preview and confirmation.

---

## Entry Points

| Entry Point | UI |
|-------------|-----|
| **Spaces page** — tree editor (same as [[Journey - Space Setup]] Phase 4) | Inline actions on any node |
| **Spaces page** — "Reorganize" button | Dedicated reorganization mode |
| **Admin area** | Link to Spaces page with reorganize mode |

---

## Inline Operations (Simple)

Available directly in the tree editor by tapping a node's action menu.

### Operation 1 — Rename

Change a [[Space]] node's name without affecting anything else.

**Flow:** Tap node → "Rename" → edit name inline → save.

**Data touched:** [[Space]] update (name). No Flows, no item changes.

### Operation 2 — Change Unit Type (Reclassify)

Change a Space's `unit_type` (e.g., reclassify a `section` as a `sub_section`).

**Flow:** Tap node → "Change type" → dropdown showing valid types for this position in the hierarchy → save.

**Validation:** The new type must be valid given the node's parent and children. For example, you can't reclassify a node as `shelf` if it has children (shelves are leaf nodes). The dropdown only shows valid options.

**Data touched:** [[Space]] update (`unit_type`). No Flows, no item changes.

---

## Dedicated Reorganization Mode (Complex)

Entered via the "Reorganize" button. The tree editor gains additional capabilities and a **preview panel** that shows the impact of changes before committing.

### Operation 3 — Move a Space

Move a Space node (and all its children) to a new parent.

**Example:** Move "Spice Rack" from "Cabinet 1" to "Cabinet 3" (the physical rack was relocated).

**Flow:**
1. Select the Space to move (drag in the tree, or select → "Move to...")
2. Select the new parent from the tree (invalid targets grayed out — can't move a node into its own subtree)
3. **Preview:** Shows:
   - The node and all its children that will move
   - Items affected (all [[InventoryItem]]s at the moving node and its descendants)
   - "X items will update their location path"
   - Whether `home_space_id` references need updating
4. **Home location option:** "Also update home locations for items whose home is in the moving subtree?" (toggle, default on)
5. Confirm

**On confirm (atomic via edge function):**
- [[Space]] `parent_id` updated to the new parent
- All [[InventoryItem]]s at the moved Space (and descendants):
  - `current_space_id` unchanged (still points to the same Space, which just moved)
  - `home_space_id` unchanged (still points to the same Space)
  - No transfer Flows — the items didn't move relative to their Space, the Space moved
- Location paths update automatically (they're derived from the hierarchy, not stored)

**Data touched:** [[Space]] update (`parent_id`). No Flows — the hierarchy changed, not item locations.

### Operation 4 — Merge Two Spaces

Combine two Spaces into one. All items from the source Space move to the target Space, then the source is soft-deleted.

**Example:** "Cabinet 1" and "Cabinet 2" are being replaced with one large cabinet. Merge Cabinet 2 into Cabinet 1.

**Flow:**
1. Select source Space ("merge this...")
2. Select target Space ("...into this")
3. **Preview:**
   - Items from source: 8 items will move to target
   - Items already at target: 5 items (unchanged)
   - Children of source: "Source has 2 child Spaces (Shelf 1, Shelf 2). They will become children of [target]."
   - Home location updates: "3 items have their home set to [source]. Homes will update to [target]."
4. Confirm

**On confirm (atomic via edge function):**
- All [[InventoryItem]]s where `current_space_id` = source → updated to target. Transfer [[Flow]]s created for each.
- All [[InventoryItem]]s where `home_space_id` = source → updated to target
- All child [[Space]]s of source → `parent_id` updated to target
- Source [[Space]] soft-deleted (`deleted_at` set)

**Data touched:** [[InventoryItem]] updates, transfer [[Flow]]s (one per moved item), [[Space]] updates + soft delete.

### Operation 5 — Delete a Space

Remove a Space from the hierarchy. Must handle items and children.

**Flow:**
1. Select Space → "Delete"
2. System checks for items and children

**If the Space has no items and no children:**
- Simple confirmation: "Delete [Space name]?"
- On confirm: [[Space]] soft-deleted. Done.

**If the Space has items (and/or children):**

**Step 2a — Handle children first:**
If the Space has child Spaces, the user must deal with them first:
- "Move children to [parent of deleted Space]" — children become siblings of the deleted node
- "Delete children too" — recursive delete (each child goes through the same item-handling flow)

**Step 2b — Handle items:**
Prompt with three options for items at this Space:

| Option | Behavior |
|--------|----------|
| **Move to parent** | All items move to the deleted Space's parent. Transfer Flows created. |
| **Move to specific Space** | User picks a destination from the tree. Transfer Flows created. |
| **Bulk reassign** | Opens [[Journey - Moving Items]] Scenario 4 (bulk reassign) with this Space as the source. |

**Step 2c — Handle home locations:**
For items whose `home_space_id` = the deleted Space:
- "Update homes to [chosen destination]" (same as item destination)
- "Clear home (mark as unsorted)" — sets `home_space_id` = null

3. **Preview** showing all changes
4. Confirm

**On confirm (atomic via edge function):**
- Items handled per chosen option (transfer Flows if moved)
- Home locations updated or cleared
- Children reparented or recursively deleted
- [[Space]] soft-deleted

### Operation 6 — Split a Space

Turn one Space into two. Some items stay, some move to the new Space.

**Example:** One large cabinet is being divided into "Cabinet 1 (Left)" and "Cabinet 1 (Right)".

**Flow:**
1. Select the Space to split
2. **Name the new Space:** "What's the new Space called?" (the original keeps its name, or can be renamed)
3. **Rename original (optional):** "Rename [original] to...?"
4. **Same parent:** The new Space is created as a sibling (same parent, same unit_type)
5. **Assign items:** A list of all items at the original Space, each with a radio: "Stay in [original]" or "Move to [new]"
6. **Assign children (if any):** Same radio per child Space
7. **Preview** showing the split result — two trees side by side
8. Confirm

**On confirm (atomic via edge function):**
- New [[Space]] created (same parent, same unit_type)
- Selected items: `current_space_id` updated to new Space, transfer Flows created
- Selected children: `parent_id` updated to new Space
- Home locations: items whose `home_space_id` = original and are moving → updated to new Space
- Original Space may be renamed if the user chose to

---

## Preview Panel

All complex operations share a preview panel that shows:

- **Tree before and after** — visual diff of the hierarchy structure
- **Item count impact** — how many items are affected and how
- **Flow count** — how many transfer Flows will be generated
- **Home location changes** — which items will have their home updated
- **Warnings** — any potential issues (e.g., "3 items will become unsorted")

The user can review and cancel before committing. No changes are made until "Confirm" is tapped.

---

## Data Model Touchpoints

| Entity | Operation | When |
|--------|-----------|------|
| [[Space]] | Update (name) | Rename |
| [[Space]] | Update (unit_type) | Reclassify |
| [[Space]] | Update (parent_id) | Move, merge (children), split (children) |
| [[Space]] | Insert | Split (new Space) |
| [[Space]] | Soft delete | Delete, merge (source) |
| [[InventoryItem]] | Update (current_space_id) | Merge, delete (move items), split (move items) |
| [[InventoryItem]] | Update (home_space_id) | Merge, delete, split, move (when home update enabled) |
| [[Flow]] | Insert (transfer) | Merge (items), delete (move items), split (move items) |
| [[FlowTransferDetail]] | Insert | One per transfer Flow |

> **Move (Operation 3) creates NO Flows.** The Space moved in the hierarchy — items are still at the same Space node. Their location path changes because the path is derived, but no physical movement occurred.

---

## See Also

- [[Journey - Space Setup]] — initial hierarchy creation (same tree editor, different context)
- [[Journey - Moving Items]] — moving items within the hierarchy (this journey changes the hierarchy itself)
- [[Space]] — entity definition with parent_id, unit_type, soft delete
- [[Feature 2 - Space Hierarchy Setup]] — feature-level overview
