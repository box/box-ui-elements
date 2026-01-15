## Ticket: Create UploadHeader Component

**Estimated Effort:** 3 SP

### What

Create a new reusable `UploadHeader` component that displays upload status, progress, and actions in a consolidated header UI.

**UI Layout:**

```
[Icon] [Status Title]                           [Action Button] [Chevron]
       [Count/Error Text]
[===================Progress Bar==================================]
```

**Key Features:**

- Status icon on the left (varies by state)
- Primary status title (e.g., "Uploads In Progress", "Uploads Complete", "Uploads Canceled")
- Secondary count text (e.g., "2 of 7 complete", "3 Errors")
- Full-width progress bar below the text
- Contextual action button (e.g., "Cancel All", "Retry All")
- Expand/collapse chevron button on the right

**Component API:**

```typescript
interface UploadHeaderProps {
  // View state (derived in UploadsManagerV2)
  // Use existing view constants: VIEW_UPLOAD_IN_PROGRESS | VIEW_UPLOAD_SUCCESS | VIEW_ERROR | VIEW_CANCELED
  view: View;

  // Counts
  totalUploadCount: number;
  completedUploadCount: number;
  failedUploadCount: number;

  // Progress (0-100)
  progressPercent: number;

  // Display states
  isExpanded: boolean;

  // Actions
  onToggle: () => void;
  onCancelAll?: () => void;
  onRetryAll?: () => void;
}
```

**Visual States :**

1. **In Progress State** (`VIEW_UPLOAD_IN_PROGRESS`):

   - Icon: Medium/CloudUp on white
   - Title: "Uploads In Progress"
   - Count: "X of Y complete"
   - Action: "Cancel All" button

2. **Success State** (`VIEW_UPLOAD_SUCCESS`):

   - Icon: Icon on Green (Vicky will add to BP)
   - Title: "Uploads Complete"
   - Count: "Y of Y complete"

3. **Error State** (`VIEW_ERROR`):

   - Icon: Icon on Red (Vicky will add to BP)
   - Title: "Uploads Complete"
   - Count: "X Errors"
   - Action: "Retry All" button

4. **Canceled State** (`VIEW_CANCELED`):
   - Icon: Icon on Grey (Vicky will add to BP)
   - Title: "Uploads Canceled"
   - Count: "Y of Y Complete" (shows how many completed before cancel) or empty if none completed

**Why no distinction between partial (some complete + some canceled) and full cancellation (all canceled) states?**

- Both cases show "Uploads Canceled" status
- If `completedUploadCount === 0`, UploadHeader won't show "X of Y complete" label
- If `completedUploadCount > 0`, UploadHeader shows "X of Y complete" label
- Progress bar reflects actual completion percentage (0% if all canceled, >0% if some completed)

### Where

**Component Files:**

- `src/elements/content-uploader/v2/UploadHeader.tsx` - Main component implementation
- `src/elements/content-uploader/v2/UploadHeader.scss` - Component styles
- `src/elements/content-uploader/v2/__tests__/UploadHeader.test.tsx` - Unit tests

**Dependencies:**

- `@box/blueprint-web` - For Button, Icon, and Text components

**Accessibility Requirements:**

- Proper ARIA labels for all interactive elements
- Role attributes for progress bar and status indicators
- Keyboard navigation support (Enter/Space for buttons)
- Screen reader announcements for dynamic status changes

---

**Notes:** This component is a standalone presentational component that will be integrated into UploadsManagerV2 in a subsequent ticket.

---
