## Ticket: Integrate UploadHeader into UploadsManagerV2

**Estimated Effort:** 2 SP

### What

1. Pass necessary props from `ContentUploader` to `UploadsManagerV2` and to `UploadHeader`.
2. Calculate upload counts and overall progress in `UploadsManagerV2` and pass to `UploadHeader`.
3. Add logic to detect canceled state.

**Architecture:**

```
ContentUploader (state source)
    ↓ (passes state + handlers)
UploadsManagerV2 (orchestrator)
    ↓ (calculates counts + passes props)
UploadHeader (presentation)
```

**Props API Update:**

Add to `UploadsManagerV2Props`:

- `view: View` - Current upload state
- `items: UploadItem[]` - Array for count calculation and item list rendering
- `percent: number` - Overall progress percentage
- `onCancelAll: () => void` - Cancel all handler (passed to modal)
- `onRetryAll: () => void` - Resume/Retry all handler

**Count Calculation:**

```typescript
totalUploadCount = items.filter(item => item.status !== STATUS_CANCELED).length;
completedUploadCount = items.filter(
  item => item.status === STATUS_COMPLETE,
).length;
failedUploadCount = items.filter(item => item.status === STATUS_ERROR).length;
```

**Progress Calculation:**

Update existing calculation (UploadsManager.tsx:54-63) to exclude STATUS_CANCELED:

```typescript
if (item.status !== STATUS_ERROR && item.status !== STATUS_CANCELED && !item.isFolder) {
```

This excludes canceled items from both count and progress (like failed items), while still showing them in the list.

### Introducing VIEW_CANCELED State

This ticket introduces the new `VIEW_CANCELED` view state to handle scenarios where uploads are canceled.

**Add VIEW_CANCELED constant:**

```typescript
// In src/constants.js (line 29, after VIEW_UPLOAD_SUCCESS)
export const VIEW_CANCELED: 'canceled' = 'canceled';
```

**Update updateViewAndCollection() in ContentUploader.tsx:**

Add logic to detect canceled state.
**IMPORTANT:** Wrap new logic in `enableModernizedUploads` feature flag check:

```typescript
const { enableModernizedUploads }: ContentUploaderProps = this.props;

// ... Existing status checks

// NEW: Check for canceled items (only for modernized uploads)
const someUploadIsCanceled = enableModernizedUploads
    ? items.some(uploadItem => uploadItem.status === STATUS_CANCELED)
    : false;

let view = '';
if (...) {
    // existing in-progress logic...
} else if (someUploadIsCanceled && noFileIsPendingOrInProgress) {
    // NEW: Any canceled items + nothing in progress = Canceled view (only for modernized uploads)
    view = VIEW_CANCELED;
} ... else {
    // existing logic...
}
```

### Where

**Files to Modify:**

1. **constants.js** (`src/constants.js`):
2. **ContentUploader.tsx** (`src/elements/content-uploader/ContentUploader.tsx`):
3. **UploadsManager.tsx** (`src/elements/content-uploader/v2/UploadsManager.tsx`):
4. **ContentUploader.tsx** (integration with UploadsManagerV2):

---

**Dependencies:**

- [Create UploadHeader Component](./02-create-upload-header-component.md)
- [Create UploadsManagerV2 Wrapper Component](./03-create-uploads-manager-v2-wrapper.md)

**Follow-up Tickets:**

- [Implement Cancel All and Retry All Handlers for UploadsManagerV2](./05-implement-cancel-retry-handlers.md)

---
