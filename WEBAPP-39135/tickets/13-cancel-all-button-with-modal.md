## Ticket: Cancel All Button with Confirmation Modal

**Estimated Effort:** 3 SP

### What

Implement a confirmation modal that appears when the user clicks the "Cancel All" button in the UploadHeader. The modal ensures users don't accidentally cancel all in-progress uploads.

**User Flow:**

1. User clicks "Cancel All" button in UploadHeader (from ticket 02)
2. Confirmation modal opens
3. User can either:
   - Click "Keep Uploading" to dismiss modal and continue uploads
   - Click "Cancel All" to confirm and cancel all in-progress uploads

### Component API

```typescript
interface CancelAllUploadsModalProps {
  // Modal state
  isOpen: boolean;
  onRequestClose: () => void;

  // Action handler - called when user confirms cancellation
  onCancelAll: () => void;
}
```

### Integration with UploadHeader

The UploadHeader's "Cancel All" button (from ticket 02) should:

1. Call `onCancelAll` prop which opens this modal
2. **NOT** directly cancel uploads

The actual cancellation logic (`onCancelAll` handler) is invoked from the modal's "Cancel All" button.

**State Management Example:**

```typescript
// In parent component (e.g., UploadsManagerV2)
const [isCancelAllModalOpen, setIsCancelAllModalOpen] = useState(false);

const handleCancelAll = () => {
  // Actual cancellation logic
  items.forEach(item => {
    if (item.status === STATUS_IN_PROGRESS || item.status === STATUS_PENDING) {
      cancelUpload(item);
    }
  });
  setIsCancelAllModalOpen(false);
};

// Pass to UploadHeader
<UploadHeader
  onCancelAll={() => setIsCancelAllModalOpen(true)} // Opens modal
  // ... other props
/>

// Render modal
<CancelAllUploadsModal
  isOpen={isCancelAllModalOpen}
  onRequestClose={() => setIsCancelAllModalOpen(false)}
  onCancelAll={handleCancelAll} // Actual cancellation
/>
```

### Where

**Component Files:**

- `src/elements/content-uploader/v2/CancelAllUploadsModal.tsx` - Main modal component
- `src/elements/content-uploader/v2/CancelAllUploadsModal.scss` - Modal styles (if needed)
- `src/elements/content-uploader/v2/__tests__/CancelAllUploadsModal.test.tsx` - Unit tests

**Integration:**

- Update `UploadsManagerV2.tsx` to manage modal state and wire up handlers

**Dependencies:**

- `@box/blueprint-web` - For Modal, Button components

### Accessibility Requirements

- Modal should trap focus when open
- Escape key should close modal (same as clicking X or "Keep Uploading")
- Proper ARIA labels:
  - Modal title should be announced
  - Close button: `aria-label="Close"`
  - Buttons should have clear labels
- Focus should return to "Cancel All" button in header when modal closes

### Edge Cases

- If user cancels all uploads, modal closes and UploadHeader should update to show canceled state
- If all uploads complete while modal is open, modal should close automatically (optional enhancement)

---

**Notes:**

- This modal prevents accidental cancellation of bulk uploads
- The "Cancel All" button should have danger styling (red) to indicate destructive action
- Modal uses Blueprint's Modal component for consistency

---
