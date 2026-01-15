## Ticket: Upload Notifications (Cancel and Success)

### What

Add toast notifications to inform users when uploads are canceled or completed successfully. Notifications should display appropriate counts and differentiate between successful and failed uploads.

**Requirements:**

1. **Cancel Uploads – Notification**

   - Show toast when user cancels an upload (single or batch)
   - Use info/neutral style (not success or error)
   - Works for single item cancel and "Cancel All" action

2. **Upload Confirmation – Batch**
   - Show toast when batch upload completes successfully
   - Display count of successfully uploaded items
   - Items with errors shown separately (not included in success count)

**Notification Types and Messages:**

| Scenario                  | Message                                         | Type    | Duration |
| ------------------------- | ----------------------------------------------- | ------- | -------- |
| Single cancel             | "Upload canceled: filename.pdf"                 | INFO    | SHORT    |
| Cancel All (multiple)     | "5 uploads canceled"                            | INFO    | SHORT    |
| Single success            | "Upload complete: filename.pdf" (existing)      | SUCCESS | LONG     |
| Batch success (no errors) | "5 files uploaded successfully"                 | SUCCESS | LONG     |
| Batch partial success     | "3 of 5 files uploaded successfully. 2 failed." | WARNING | LONG     |
| Batch all failed          | Handled by error notification (existing)        | ERROR   | LONG     |

**Key Design Decisions:**

1. **Cancel notifications use INFO type** - Canceling is neither success nor error, it's an intentional user action
2. **Success count excludes errors** - "3 of 5 uploaded" clearly communicates that 2 failed
3. **Partial success uses WARNING type** - Orange/yellow to indicate mixed results
4. **Leverage existing notification infrastructure** - Use EndUserApp's notification system

### Implementation Details

**1. Add Callback Props to ContentUploaderProps (box-ui-elements):**

```typescript
interface ContentUploaderProps {
  // ... existing props

  // Notification callbacks
  onUploadCancel?: (item: UploadItem) => void;
  onUploadsCancelAll?: (count: number) => void;
  onBatchUploadComplete?: (
    successCount: number,
    failureCount: number,
    items: UploadItem[],
  ) => void;
}
```

**2. Modify ContentUploader to Call Notification Callbacks:**

**In onClick() method (single cancel):**

```typescript
case STATUS_IN_PROGRESS:
case STATUS_STAGED:
case STATUS_PENDING:
    // Cancel the upload
    api.cancel();
    item.status = STATUS_CANCELED;

    // Trigger cancel notification
    const { onUploadCancel } = this.props;
    onUploadCancel?.(item);

    this.updateViewAndCollection(updatedItems);
    break;
```

**In handleCancelAllUploads() (batch cancel):**

```typescript
handleCancelAllUploads = () => {
  const itemsToCancel = this.itemsRef.current.filter(/* ... */);

  itemsToCancel.forEach(item => this.onClick(item));

  // Trigger batch cancel notification
  const { onUploadsCancelAll } = this.props;
  onUploadsCancelAll?.(itemsToCancel.length);
};
```

**In updateViewAndCollection() (batch success detection):**

```typescript
// Detect when batch upload completes (exclude canceled items from "finished")
const allItemsFinished = items.every(
  item =>
    item.status === STATUS_COMPLETE ||
    item.status === STATUS_ERROR ||
    item.status === STATUS_CANCELED,
);

if (allItemsFinished && items.length > 1) {
  const successCount = items.filter(
    item => item.status === STATUS_COMPLETE,
  ).length;
  const failureCount = items.filter(
    item => item.status === STATUS_ERROR,
  ).length;
  const canceledCount = items.filter(
    item => item.status === STATUS_CANCELED,
  ).length;

  // Do not fire batch success notifications for canceled-only batches
  if (successCount > 0 || failureCount > 0) {
    const { onBatchUploadComplete } = this.props;
    onBatchUploadComplete?.(successCount, failureCount, items);
  }
}
```

**3. Wire Up Notifications in EndUserApp (UploadsManagerContainer.ts):**

```typescript
import {
  showInfoNotification,
  showSuccessNotification,
  showWarningNotification,
} from 'components/core/notifications/actions';

const mapDispatchToProps = dispatch => ({
  // ... existing props

  // Cancel notifications
  onUploadCancel: (item: UploadItem) => {
    dispatch(
      showInfoNotification(
        `Upload canceled: ${item.name}`,
        NotificationConstants.DURATION_SHORT,
      ),
    );
  },

  onUploadsCancelAll: (count: number) => {
    dispatch(
      showInfoNotification(
        `${count} upload${count > 1 ? 's' : ''} canceled`,
        NotificationConstants.DURATION_SHORT,
      ),
    );
  },

  // Batch success notification
  onBatchUploadComplete: (successCount: number, failureCount: number) => {
    if (failureCount === 0) {
      // All succeeded
      dispatch(
        showSuccessNotification(
          `${successCount} file${successCount > 1 ? 's' : ''} uploaded successfully`,
          NotificationConstants.DURATION_LONG,
        ),
      );
    } else if (successCount > 0) {
      // Partial success
      dispatch(
        showWarningNotification(
          `${successCount} of ${successCount + failureCount} file${successCount + failureCount > 1 ? 's' : ''} uploaded successfully. ${failureCount} failed.`,
          NotificationConstants.DURATION_LONG,
        ),
      );
    }
    // If all failed (successCount === 0), don't show success notification
    // Individual error notifications already shown
  },
});
```

**4. Add i18n Messages (EndUserApp):**

```javascript
// In src/components/uploads/messages.js
uploadCanceled: {
    id: 'eua.uploads.uploadCanceled',
    defaultMessage: 'Upload canceled: {filename}',
    description: 'Notification when single upload is canceled',
},
uploadsCanceled: {
    id: 'eua.uploads.uploadsCanceled',
    defaultMessage: '{count, plural, one {# upload} other {# uploads}} canceled',
    description: 'Notification when multiple uploads are canceled',
},
batchUploadSuccess: {
    id: 'eua.uploads.batchUploadSuccess',
    defaultMessage: '{count, plural, one {# file} other {# files}} uploaded successfully',
    description: 'Notification when batch upload completes successfully',
},
batchUploadPartialSuccess: {
    id: 'eua.uploads.batchUploadPartialSuccess',
    defaultMessage: '{successCount} of {totalCount} {totalCount, plural, one {file} other {files}} uploaded successfully. {failureCount} failed.',
    description: 'Notification when batch upload has mixed results',
},
```

### Where

**Files to Modify (box-ui-elements):**

1. **ContentUploader.tsx** (`src/elements/content-uploader/ContentUploader.tsx`):
   - Add 3 new optional callback props to `ContentUploaderProps` interface
   - Call `onUploadCancel` in `onClick()` when single item canceled
   - Call `onUploadsCancelAll` in `handleCancelAllUploads()` after batch cancel
   - Call `onBatchUploadComplete` in `updateViewAndCollection()` when batch finishes

**Files to Modify (EndUserApp):**

1. **UploadsManagerContainer.ts** (`src/components/uploads/containers/UploadsManagerContainer.ts`):

   - Import notification actions (`showInfoNotification`, `showSuccessNotification`, `showWarningNotification`)
   - Add `onUploadCancel`, `onUploadsCancelAll`, `onBatchUploadComplete` to `mapDispatchToProps`
   - Wire up callbacks to dispatch appropriate notifications

2. **messages.js** (`src/components/uploads/messages.js`):
   - Add 4 new i18n message definitions for notifications

**Edge Cases:**

- **Single file upload** - Don't show batch notification (existing single notification already works)
- **All uploads fail** - Don't show success notification (error notifications already shown per file)
- **User cancels during upload** - Show cancel notification immediately, don't wait for completion
- **Rapid cancel actions** - Debounce "Cancel All" to avoid duplicate notifications
- **Empty count** - Validate counts before showing (e.g., don't show "0 files uploaded")

**Testing Requirements:**

- Unit test: `onUploadCancel` called when single item canceled
- Unit test: `onUploadsCancelAll` called with correct count
- Unit test: `onBatchUploadComplete` called with correct success/failure counts
- Integration test: Toast appears with correct message for each scenario
- Integration test: Notification types (info/success/warning) are correct

---

**Estimated Effort:** 1-2 days

**Dependencies:**

- [Implement Cancel All and Retry All Handlers for UploadsManagerV2](./05-implement-cancel-retry-handlers.md) (for cancel functionality)

**Notes:**

- This ticket is primarily EndUserApp work with small box-ui-elements API additions
- Existing single-file success notification (`UploadSuccessNotification.tsx`) remains unchanged
- Focus on batch scenarios and cancel notifications

---
