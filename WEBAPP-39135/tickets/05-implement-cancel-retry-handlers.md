## Ticket: Implement Cancel All and Retry All Handlers for UploadsManagerV2

**Estimated Effort:** 2 SP

### What

Implement dedicated handler functions for Cancel All and Retry All actions in ContentUploader, replacing the placeholder empty handlers with proper functionality that doesn't rely on the legacy `clickAllWithStatus` method.

**IMPORTANT: Add STATUS_CANCELED Support**

Currently, when a user cancels an upload, the item is removed entirely from the queue (via `removeFileFromUploadQueue`). This ticket adds `STATUS_CANCELED` to keep canceled items visible in the UI with a "Canceled" status.

**Add STATUS_CANCELED constant:**

```typescript
export const STATUS_CANCELED: 'canceled' = 'canceled';
```

**Modify onClick() to Mark Items as Canceled (Instead of Removing):**

Currently, `onClick()` in ContentUploader.tsx (line 1089-1121) removes canceled items from the queue:

```typescript
case STATUS_IN_PROGRESS:
case STATUS_PENDING:
    this.removeFileFromUploadQueue(item);  // ← Removes item entirely
    onClickCancel(item);
    break;
```

**New behavior** - Set status to STATUS_CANCELED and keep item visible. **IMPORTANT:** Wrap new logic in `enableModernizedUploads` feature flag check:

```typescript
case STATUS_IN_PROGRESS:
case STATUS_STAGED:
case STATUS_PENDING:
    const { api } = item;
    const { enableModernizedUploads } = this.props;

    api.cancel();

    if (enableModernizedUploads) {
       // NEW: Mark as canceled and keep in queue (modernized behavior)
       // IMPORTANT: update both itemsRef.current and state items to keep UI in sync
       // Example approach:
       // - set item.status = STATUS_CANCELED on the ref
       // - update the matching item in state via updateViewAndCollection(updatedItems)
    } else {
        // LEGACY: Remove from queue entirely
        this.removeFileFromUploadQueue(item);
        onClickCancel(item);
    }
    break;
```

**New Handler Methods:**

Add to ContentUploader class:

```typescript
handleCancelAllUploads = () => {
  const cancelableStatuses = [
    STATUS_IN_PROGRESS,
    STATUS_STAGED,
    STATUS_PENDING,
  ];
  const itemsToCancel = this.itemsRef.current.filter(item =>
    cancelableStatuses.includes(item.status),
  );

  itemsToCancel.forEach(item => this.onClick(item));
};

handleRetryAllUploads = () => {
  const failedItems = this.itemsRef.current.filter(
    item => item.status === STATUS_ERROR,
  );

  failedItems.forEach(item => this.onClick(item));
};
```

**FYI - Why use `itemsRef.current` instead of `state.items`:**
ContentUploader maintains items in both ref and state. The ref provides synchronous access during async upload operations, avoiding stale closures and unnecessary re-renders. State is updated after ref for rendering purposes. This is the established pattern in this codebase.

**Handler Requirements:**

**Cancel All Handler:**

- Find all items with `STATUS_IN_PROGRESS` or `STATUS_PENDING`
- Call cancel logic for each item
- Update item status to `STATUS_CANCELED`

**Retry All Handler:**

- Find all items with `STATUS_ERROR`
- For each failed item:
  - If resumable (has sessionId): Call `resumeFile(item)` to continue from last position
  - If not resumable: Call `resetFile(item)` then `uploadFile(item)` to restart from beginning
- Update item status to `STATUS_PENDING` or `STATUS_IN_PROGRESS`
- Update view state to reflect retrying

**Note:** The handler intelligently chooses between resume and retry on a per-file basis. The existing `onClick(item)` method already implements this logic, so the handler simply delegates to it for each failed item.

### Where

**Files to Modify:**

1. **constants.js** (`src/constants.js`):
2. **ContentUploader.tsx** (`src/elements/content-uploader/ContentUploader.tsx`):

---

**Dependencies:**

- [Integrate UploadHeader into UploadsManagerV2](./04-integrate-upload-header.md)

---
