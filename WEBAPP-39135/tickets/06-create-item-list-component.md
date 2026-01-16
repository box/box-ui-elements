## Ticket: Create ItemList Component for UploadsManagerV2

**Estimated Effort:** 3 SP

### What

Create the `ItemList` component that displays individual upload items with their status, progress, and file information. This component renders below the UploadHeader when the manager is expanded.
TODO: add virtualizations of the list

**Component Structure:**

```typescript
interface ItemListProps {
  items: UploadItem[];
  isResumableUploadsEnabled: boolean;
  onItemCancel?: (item: UploadItem) => void;
  onItemRetry?: (item: UploadItem) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, isResumableUploadsEnabled, onItemCancel, onItemRetry }) => {
  return (
    <div className="bcu-item-list-v2">
      {items.map(item => (
        <UploadItem
          key={item.id}
          item={item}
          isResumableUploadsEnabled={isResumableUploadsEnabled}
          onCancel={onItemCancel}
          onRetry={onItemRetry}
        />
      ))}
    </div>
  );
};
```

**Note:** The container (UploadsManagerV2) controls when to render ItemList based on `isExpanded` state. Each item shows hover actions depending on state.

**UploadItem Visual States:**

1. **Uploading** (`STATUS_IN_PROGRESS`):

   - Progress indicator/spinner on left (TBD icon/gif)
   - Progress text: "Uploading · 12%"
   - Action button on hover: Cancel (Icon TBD)

2. **Completed** (`STATUS_COMPLETE`):

   - File type icon on left
   - Green checkmark icon (TBD icon)
   - Status text: "Completed · Version" (show "Version" badge only if version is provided)
   - Action button on hover:
     - Open in new tab (Icon TBD) // TODO: create new ticket for this
     - Open shared link Modal (Icon TBD) // TODO: create new ticket for this

3. **Error** (`STATUS_ERROR`):

   - File type icon on left
   - Red error icon (Icon TBD)
   - Error text: "Error: File is too large" (or other error message)
   - **Hover action button label**:
     - "Resume/retry" (if resumable/retryable)
     - "Cancel"

4. **Canceled** (`STATUS_CANCELED`):
   - File type icon on left (grayed out)
   - Gray cancel icon (Icon TBD)
   - Status text: "Canceled"
   - **Hover action button label**:
     - "Resume/retry" (if resumable/retryable)

**Key Features:**

- Scrollable list when items exceed viewport
- File type icon matching file extension
- Status-specific icons and colors
- Progress percentage for uploading items
- Error messages for failed uploads
- Hover actions

### Where

**Component Files:**

1. **ItemList.tsx** (`src/elements/content-uploader/v2/ItemList.tsx`):
2. **UploadItem.tsx** (`src/elements/content-uploader/v2/UploadItem.tsx`):
3. **ItemList.scss** (`src/elements/content-uploader/v2/ItemList.scss`):
4. **UploadItem.scss** (`src/elements/content-uploader/v2/UploadItem.scss`):

**UploadItem Component API:**

```typescript
interface UploadItemProps {
  item: UploadItem;
  isResumableUploadsEnabled: boolean;
  onCancel?: (item: UploadItem) => void;
  onRetry?: (item: UploadItem) => void;
}

interface UploadItem {
  id: string;
  file: File;
  name: string;
  status: UploadStatus;
  progress?: number;
  error?: { message: string; code: string };
  version_number?: number;
}
```

**Accessibility Requirements:**

- List has `role="list"` and items have `role="listitem"`
- Each item has descriptive aria-label: "File name - Status"
- Screen reader announces status changes
- Hover action buttons have proper ARIA labels ("Retry upload", "Cancel upload")
- Keyboard navigation support for per-item action buttons
- Focus management for interactive elements

---

**Dependencies:**

- [Create UploadsManagerV2 Wrapper Component](./03-create-uploads-manager-v2-wrapper.md)

---
