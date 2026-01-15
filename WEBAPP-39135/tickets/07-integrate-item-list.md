## Ticket: Integrate ItemList into UploadsManagerV2

**Estimated Effort:** 1 SP

### What

Integrate the `ItemList` component into `UploadsManagerV2` wrapper, rendering it below the UploadHeader when expanded.

**Integration Pattern:**

```typescript
const UploadsManagerV2: React.FC<UploadsManagerV2Props> = ({
  isExpanded,
  items,
  isResumableUploadsEnabled,
  onItemCancel,
  onItemRetry,
  // ... other props
}) => {
  return (
    <div className="bcu-uploads-manager-v2">
      <UploadHeader {...headerProps} />

      {isExpanded && items.length > 0 && (
        <ItemList
          items={items}
          isResumableUploadsEnabled={isResumableUploadsEnabled}
          onItemCancel={onItemCancel}
          onItemRetry={onItemRetry}
        />
      )}
    </div>
  );
};
```

**Props API Changes:**

- `items` already exists in UploadsManagerV2Props (added in UploadHeader integration)
- Add new props to UploadsManagerV2Props:
  - `isResumableUploadsEnabled: boolean` - Feature flag for button label logic (show "Resume" vs "Retry")
  - `onItemRetry?: (item: UploadItem) => void` - Resume/Retry individual upload (handler determines which based on file state)
  - `onItemCancel?: (item: UploadItem) => void` - Cancel individual upload

### Where

**Files to Modify:**

1. **UploadsManager.tsx** (`src/elements/content-uploader/v2/UploadsManager.tsx`):

2. **ContentUploader.tsx** (`src/elements/content-uploader/ContentUploader.tsx`):

---

**Dependencies:**

- [Create ItemList Component for UploadsManagerV2](./06-create-item-list-component.md)
- [Integrate UploadHeader into UploadsManagerV2](./04-integrate-upload-header.md)

---
