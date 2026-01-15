## Ticket: Create UploadsManagerV2 Wrapper Component

**Estimated Effort:** 2 SP

### What

Create the `UploadsManagerV2` wrapper component that provides the container structure and positioning for the modernized upload experience. This component renders as a floating panel in the bottom-right corner of the screen and supports collapse/expand functionality.

**Component Structure:**

```typescript
interface UploadsManagerV2Props {
  isExpanded: boolean;
  onToggle: () => void;
}

const UploadsManagerV2: React.FC<UploadsManagerV2Props> = ({ isExpanded, onToggle }) => {
  return (
    <div className="bcu-uploads-manager-v2">
      {/* Header placeholder - will be added in follow-up ticket */}
      {/* Item list placeholder - will be added in follow-up ticket */}
    </div>
  );
};
```

**States:**

1. **Expanded**: Full height showing header and item list (content area visible)
2. **Collapsed**: Minimal height showing only header (content area hidden)

**Initial Implementation:**

- Render wrapper div with proper positioning and styling
- Add placeholder comments for where header and item list will go
- Receive `isExpanded` and `onToggle` props from ContentUploader
- Style as floating panel in bottom-right corner
- Implement collapse/expand animation using CSS transitions

### State Management and Toggle Handler

**Use Existing ContentUploader Implementation:**

ContentUploader already has the necessary state and methods:

- **State**: `isUploadsManagerExpanded: boolean` (line 111, initialized to `false` at line 188)
- **Toggle Method**: `toggleUploadsManager()` (line 1191-1199)
- **Expand Method**: `expandUploadsManager()` (line 1143-1153)
- **Minimize Method**: `minimizeUploadsManager()` (line 1159-1187)

**Wire up to UploadsManagerV2:**

When `enableModernizedUploads` is true, pass existing state and handler to UploadsManagerV2:

```typescript
// In ContentUploader.tsx render() method
<UploadsManagerV2
  isExpanded={this.state.isUploadsManagerExpanded}
  onToggle={this.toggleUploadsManager}
  // ... other props
/>
```

### Where

**Component Files:**

1. **UploadsManager.tsx** (`src/elements/content-uploader/v2/UploadsManager.tsx`):

   ```typescript
   import React from 'react';
   import './UploadsManager.scss';

   export interface UploadsManagerV2Props {
     isExpanded: boolean;
     onToggle: () => void;
   }

   const UploadsManagerV2: React.FC<UploadsManagerV2Props> = ({
     isExpanded,
     onToggle
   }) => {
     return (
       <div
         className="bcu-uploads-manager-v2"
         data-testid="uploads-manager-v2"
         role="region"
         aria-label="Upload manager"
       >
         {/* TODO: Add UploadHeader component (ticket: "Integrate UploadHeader into UploadsManagerV2") */}
         {/* TODO: Add ItemList component (ticket: "Create ItemList component") */}
       </div>
     );
   };

   export default UploadsManagerV2;
   ```

2. **UploadsManager.scss** (`src/elements/content-uploader/v2/UploadsManager.scss`):

   ```scss
   .bcu-uploads-manager-v2 {
     // Positioning and layout styles
     // Collapse/expand animation (smooth transitions)
   }
   ```

3. **ContentUploader.tsx** (when passing props to UploadsManagerV2):
   - Pass `isExpanded={this.state.isUploadsManagerExpanded}`
   - Pass `onToggle={this.toggleUploadsManager}`

**Accessibility Requirements:**

- Container has `role="region"` for landmark navigation
- Container has `aria-label="Upload manager"` for screen readers
- Semantic HTML structure ready for keyboard navigation

---

**Dependencies:**

- [Add V2 Upload Experience Feature Flag to ContentUploader](./01-add-v2-feature-flag.md)

**Follow-up Tickets:**

- [Integrate UploadHeader into UploadsManagerV2](./04-integrate-upload-header.md)
- [Create ItemList Component for UploadsManagerV2](./06-create-item-list-component.md)

---
