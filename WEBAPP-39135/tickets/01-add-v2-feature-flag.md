# Ticket: Add V2 Upload Experience Feature Flag to ContentUploader

**Estimated Effort:** 1 SP

## What

1. Create FF `eua_modernized_upload_manager` in Harness tool.
2. Read the experiment flag in EndUserApp.
3. In box-ui-elements:
   1. Add a boolean prop `enableModernizedUploads` to the `ContentUploader`.
   2. Pass the prop down to `UploadsManager`.
   3. In `UploadsManager`, conditionally render either the legacy upload manager or the new `UploadsManagerV2` based on the prop.
   4. Import the new `UploadsManagerV2` from the `v2/` directory.
   5. The new `UploadsManagerV2` component can be a simple placeholder that returns an empty div for now.

**box-ui-elements:**

```typescript
// In ContentUploader.tsx
const ContentUploader = ({ enableModernizedUploads = false, ...otherProps }: ContentUploaderProps) => {
  // ...

  return (
    <UploadsManager
      enableModernizedUploads={enableModernizedUploads}
      // ... other props
    />
  );
};
```

```typescript
// In UploadsManager.tsx
const UploadsManager = ({ enableModernizedUploads, ...otherProps }: UploadsManagerProps) => {
  if (enableModernizedUploads) {
    return <UploadsManagerV2 {...otherProps} />;
  }

  // Legacy implementation
  return (
    <div>
      <OverallUploadsProgressBar {...headerProps} />
      <ItemList {...listProps} />
    </div>
  );
};
```

**EndUserApp Integration:**

```typescript
// In EndUserApp/src/components/uploads/components/UploadsManager.tsx
import ContentUploader from 'box-ui-elements';

const UploadsManagerComponent = () => {
  const isModernizedUploadsEnabled = isExperimentEnabled('eua_modernized_upload_manager');

  return (
    <ContentUploader
      enableModernizedUploads={isModernizedUploadsEnabled}
      // ... other props
    />
  );
};
```

## Where

**New V2 Directory Structure:**

```
src/elements/content-uploader/
├── v2/
│   ├── UploadsManager.tsx
├── ContentUploader.tsx             # Add enableModernizedUploads prop
└── ... (existing legacy files)
```

---
