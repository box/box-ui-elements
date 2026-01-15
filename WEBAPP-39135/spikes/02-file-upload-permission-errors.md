# File upload permission errors Spike

## Background

Currently, we don't show per-item error notification. Instead, we show a generic error message in the Uploads Manager header when there are upload errors.

One of the goals of Uploads Manager initiative is to create clear error states across all customer tariffs.
To improve user experience, we want to show specific error messages for all errors including permission-related upload failures directly on the affected upload items.

## Findings

We already have mappings for some errors in `src/elements/content-uploader/progressCellRenderer.tsx`, but we need to expand this to cover permission errors.

Existing mappings include:

- storage_limit_exceeded
- file_size_limit_exceeded
- item_name_in_use
- item_name_invalid
- pending_app_folder_size_limit
- child_folder_failed_upload

The full list of Box API error codes is available here: [Error Codes - Box Dev Docs](https://developer.box.com/guides/api-calls/permissions-and-errors/common-errors#403-forbidden).

We would need to add mappings for permission-related errors such as:

- access_denied_insufficient_permissions
- not_found

`access_denied_insufficient_permissions` will cover the case when:

1. User was granted permission to upload files to a folder.
2. Later, user's permissions were downgraded, removing upload rights.
3. User attempts to upload files to the folder, resulting in this error.

`not_found` will cover the case when:

1. User had access to a folder and initiated an upload.
2. Later, user's access was revoked or the folder was deleted.
3. User attempts to upload files to the folder, resulting in this error.
