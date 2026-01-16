## Ticket: Replace Empty Folder Banner with Modern Drag-Drop Overlay

**Estimated Effort:** 3 SP

### What

Replace the current drag-and-drop UI (blue banner at bottom + grey-out effect on items) with a modern, centered overlay that shows "Drop to upload files" when users drag files over the Files page.

**Current Behavior:**

1. **Empty Folder**:

   - Shows large blue bordered area (`DropZone`) with folder icon and upload button
   - Location: `EmptyStateArea` → `DropZone` → `FolderEmptyStateUploadContent`

2. **Non-Empty Folder (when dragging files)**:
   - `.files-page` gets `.is-dragging-file` class
   - `.table-body` / `.grid-view-content` get dashed border and 50% opacity (grey-out)
   - Styling from `@mixin drop-target()` in `commonStyles.scss`
   - No overlay message shown

**New Behavior:**

Centered overlay for **non-empty folders** when dragging files.

### Where

**Files to Create:**

1. **DragDropOverlay.tsx** (`EndUserApp/src/components/pages/files-page/components/DragDropOverlay.tsx`):

   ```tsx
   interface DragDropOverlayProps {
     isVisible: boolean;
     isOver: boolean;
   }

   const DragDropOverlay: React.FC<Props> = ({ isVisible, isOver }) => {
     if (!isVisible || !isOver) return null;

     return (
       <div className="drag-drop-overlay">
         <div className="drag-drop-overlay-content">
           <FileUploadIcon />
           <Text>Drop to upload files</Text>
         </div>
       </div>
     );
   };
   ```

2. **DragDropOverlay.scss** (`EndUserApp/src/components/pages/files-page/styles/DragDropOverlay.scss`):

   ```scss
   .drag-drop-overlay {
     position: absolute;
     top: 0;
     left: 0;
     right: 0;
     bottom: 0;
     z-index: 100;

     display: flex;
     align-items: center;
     justify-content: center;

     background-color: rgba(255, 255, 255, 0.95);
     border: 2px dashed $bdl-box-blue;
     border-radius: 8px;

     pointer-events: none;

     .drag-drop-overlay-content {
       text-align: center;
       pointer-events: none;
       // Icon + text styling
     }
   }
   ```

**Files to Modify:**

1. **FilesPage.tsx** (`EndUserApp/src/components/pages/files-page/components/FilesPage.tsx`):

   - Line ~798-850: In `renderItemList()` method
   - Wrap ItemList in a container with `position: relative`
   - Add feature flag check: `isModernDragDropEnabled = isExperimentEnabled('eua_modern_drag_drop_overlay')`
   - Conditionally render `<DragDropOverlay />` when feature flag is enabled

   ```tsx
   renderItemList() {
     const { isOver, canUpload } = this.props;
     const isModernDragDropEnabled = isExperimentEnabled('eua_modern_drag_drop_overlay');

     return (
       <div className="item-list-container">
         {/* Existing ItemList */}
         <ItemList {...props} />

         {/* New overlay - only when feature flag enabled */}
         {isModernDragDropEnabled && (
           <DragDropOverlay isVisible={canUpload} isOver={isOver} />
         )}
       </div>
     );
   }
   ```

2. **FilesPage.scss** (`EndUserApp/src/components/pages/files-page/styles/FilesPage.scss`):

   - Line 162-168: Update `.is-dragging-file` styles with feature flag class
   - Add `.item-list-container` with `position: relative`

   **Implementation:**

   ```scss
   .item-list-container {
     position: relative; // Required for overlay positioning
     flex: 1;
     min-height: 0;
   }

   // Legacy drag-drop styling (when feature flag is OFF)
   &.is-dragging-file:not(.is-modern-drag-drop-enabled) {
     .table-body,
     .grid-view-content {
       @include drop-target(); // border + opacity: 0.5
     }
   }

   // Modern drag-drop styling (when feature flag is ON)
   &.is-dragging-file.is-modern-drag-drop-enabled {
     .table-body,
     .grid-view-content {
       // Minimal or no styling - overlay handles visual feedback
     }
   }
   ```

3. **FilesPage.tsx** (`EndUserApp/src/components/pages/files-page/components/FilesPage.tsx`):
   - Add `.is-modern-drag-drop-enabled` class to `.files-page` when feature flag is on
   - This controls which CSS rules apply

**Optional - ContentUploader Integration:**

If the upload manager banner should also be hidden when the new overlay is shown:

- Pass `isModernDragDropEnabled` prop to `ContentUploader`
- In `OverallUploadsProgressBar.tsx`, check the prop and conditionally hide the prompt
- This keeps backward compatibility - old behavior when flag is off

**Note on Empty Folders:**

Empty folder drag-drop behavior remains unchanged. The existing `DropZone` with `FolderEmptyStateUploadContent` continues to work as-is. This ticket only affects non-empty folder drag-drop UI.

### Positioning Strategy

**Critical Implementation Detail:**

To make the overlay exactly the same size as the items table/grid:

1. **Parent must have `position: relative`**:

   - Add wrapper div (`.item-list-container`) around ItemList
   - Apply `position: relative` to this wrapper

2. **Overlay uses `position: absolute`**:

   - `position: absolute`
   - `top: 0; left: 0; right: 0; bottom: 0;`
   - This makes overlay fill its parent container exactly

3. **Architecture**:
   ```
   <div className="item-list-container">  ← position: relative
     <ItemList />                        ← .table-body / .grid-view-content
     <DragDropOverlay />                 ← position: absolute, fills parent
   </div>
   ```

**Why this works:**

- Overlay is a sibling to ItemList (not parent/child)
- Overlay fills the parent container, which wraps ItemList
- Works for both List view (`.table-body`) and Grid view (`.grid-view-content`)
- No changes needed to react-virtualized Table component

### Accessibility Requirements

- Screen reader announcement when drag starts: "Drag files to upload"
- ARIA live region for drag state changes
- Keyboard alternative: Upload button remains accessible

---

**Estimated Effort:** 2-3 days

**Dependencies:** None

---
