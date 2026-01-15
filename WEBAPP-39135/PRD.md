# PRD: Uploads Manager - UI Modernization

## Overview

- This PRD focused on the behavior of uploads via the New+ button and Drag and Drop
- The goals and success metrics of this initiative:
  - Migrate the Web App Uploads Manager to use BP components
  - Create clear error states across all customer tariffs
  - Confirmed with @Tyler Barrett there are no current active upsells for uploads - out of scope to create upsells
  - Improve retry and resumable upload behavior
  - Add item count in uploads manager (new)
  - Add "cancel" in uploads manager (new) + Pulse request
    - Users cannot currently cancel uploads once they are in progress, they have to delete the item post-upload
  - Ensure WCAG support (keyboard nav + screen reader compatibility)

### What is the "Complete" experience?

- All error categories represented with clear patterns
- Retry, Resume, and Cancel fully implemented
- Responsive, accessible, keyboard-navigable
- BP components used end-to-end

### Out of scope

- Modifying file size limits for uploads
- Changing tariff uploads limits

---

## Uploads Metrics

> Note: I am working with Rashmi to get the current error metrics for uploads

The current uploads metrics via Uploads Manager:

1. **Folder Upload** from the New+ → Folder Upload in Action Bar: ~50K daily clicks
2. **File Upload** from the New+ → File Upload in Action Bar: ~400k daily clicks
3. Around **1 billion files uploaded per week** → this is across all Upload methods:
   - New+
   - Drag and drop
   - Upload via email
   - Upload via File Transfer Protocol Secure

---

## Current Experience

1. Uploads Manager is **default collapsed** (uploads happen in the background, so user can do other tasks while longer uploads are in progress)
2. Does not show count of files in the uploads manager
   - Single status update for "Completed"
   - See the entire upload job status, instead of individual item status
3. Upload Manager is **NOT in BP** currently
4. **Cannot cancel uploads** once they are in progress (Pulse)
   - The current workaround is for users to delete the item once the upload is complete, but this is limiting if the user is uploading several items at once
5. Confirmation notification after item is successfully uploaded → can trigger USM via "Share" button
6. If a new version of the item is uploaded, there is a separate notification banner
   - Version Badge is added to item

---

## Current Error States

### Error Messages

- **"Something went wrong with the upload. Please try again"**
  - This is the generic error message - it could be network problems, browser issues, server, proxy or firewall interference
  - Users should make sure their browsers are up to date
- **"An error occurred with the upload. Please refresh the page and try again"**
- **"Some uploads failed"**
  - This is used when multiple files are uploaded, but it is hard to pinpoint the exact upload error

> Note: Unsupported file names are blocked prior to opening the Uploads Manager (e.g., "untitled folder" blocked)

---

## User Stories

### Core Function

| Category                            | User Story                                                                                                                                                            | Expected Outcome / Notes                                                         | Edge Cases / Notes                                                                              |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Upload Method - New+ Button         | As a user, I want to upload items via the New+ button so that I can quickly add content to my Box Account.                                                            | Clicking New+ triggers file/folder selection; items added to Uploads Manager.    | Multiple items can be selected; system should prevent unsupported files from starting.          |
| Upload Method - Drag & Drop         | As a user, I want to upload files via drag and drop so that I can quickly add content to my Box Account.                                                              | Dragged items appear in Uploads Manager and begin uploading.                     | Dragging invalid items shows error; dragging multiple files supported.                          |
| Drag & Drop - Placement             | As a user, when I drag and drop a file or folder into Box, I want a clear visual confirmation that the item has been placed correctly.                                | Show placement animation / highlight drop zone to confirm upload will start.     | Visual feedback should appear for all supported file types; blocked for unsupported files.      |
| Upload Progress                     | As a user, I want to see the real-time progress of each file upload so I know when it's complete.                                                                     | Each file shows a progress bar; updates in real time.                            | Updates continuously for slow uploads; large files ≥100MB support resumable progress.           |
| Total Upload Progress               | As a user, if I have multiple items uploading simultaneously, I can see the total uploads % completion across all items.                                              | Show aggregate progress bar for batch; updates in real time.                     | Reflects all in-progress files; completed or failed files excluded from progress bar.           |
| Item Count                          | As a user, I want to see the total count of items I have in my upload batch so that I can understand how many files/folders are being uploaded.                       | Total count displayed in collapsed and expanded states; updates dynamically.     | Canceled or failed items reduce the count; multiple batches sum total items.                    |
| Default Interaction Pattern         | As a user, I want to see a default collapsed Uploads Manager, so that it does not take up the entire screen real estate.                                              | Uploads Manager collapses by default; can expand if needed.                      | Collapsed manager shows progress summary.                                                       |
| Collapsed - Overall Progress        | As a user, if the Uploads Manager is collapsed, I can still see the overall progress of my uploads job.                                                               | Aggregate progress bar or indicator visible in collapsed state.                  | Updates dynamically; shows total progress including multiple files.                             |
| Collapsed - Completion Notification | As a user, if the Uploads Manager is collapsed and the upload job is complete, I can see a notification that my upload batch is complete.                             | Show toast or inline notification without expanding the manager.                 | Works for single or multi-file uploads; USM trigger optional.                                   |
| Expand / Collapse Manager           | As a user, I want to be able to expand and collapse the Uploads Manager, so I can view the progress of individual items in my uploads.                                | Toggle expands/collapses manager; individual item details visible when expanded. | Smooth transition animation; keyboard accessible.                                               |
| Expanded - Individual File Rows     | As a user, if the Uploads Manager is expanded, display individual file rows with file name, status progress bar, error actions (Retry, Resume, Cancel).               | Each file shows real-time progress, current status, and available actions.       | Retry / Resume only enabled for failed or resumable files; Cancel only for in-progress uploads. |
| Drag & Drop Interaction             | As a user, when I drag and drop an item into a valid "drop zone", I want to see a visual placement animation to confirm the items are correctly placed for uploading. | Show animation / highlight drop zone; upload starts automatically.               | Invalid files blocked with error message; multiple items supported.                             |

### Cancel Uploads

| Category                  | User Story                                                                                                       | Expected Outcome / Notes                                     | Edge Cases / Notes                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Cancel Uploads – Single   | As a user, I want to be able to cancel an upload of an item so that I can stop it without affecting other files. | Item status changes to "Canceled"; upload stops immediately. | Canceled items removed from resumable queue; partially uploaded content cleaned up.                               |
| Cancel Uploads – Multiple | As a user, if I cancel multiple uploads at once, each item should be canceled independently.                     | Each selected item is canceled; status updates for each.     | If network is poor, cancel may fail — show retry/cancel indicator; closing tab mid-cancel should retry on return. |

---

## Error States

### Bulk Upload Failure Visibility

During bulk or folder uploads, Box does not provide item-level failure detail for each file within the batch. When one or more items fail, the Uploads Manager can only surface a generic batch-level error such as: "Some uploads failed. Please try again"

**Recommendation:**

- Display a single error message when individual failures cannot be identified
- Provide a "Retry All" action that attempts the entire upload block again since individual item retry is not possible

**Example messages:**

- "There was an error with your upload. Please try again"
- "Some items could not be uploaded. Try "Retry All" or upload again manually"

### Error Categories

| Error Category                    | User Story                                                                                                                                 | Expected Outcome / Notes                                                                                                | Edge Cases / Notes                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Bulk Upload Failure Visibility    | As a user, during bulk or folder uploads, I want to see a clear message if one or more items fail so I know the upload did not succeed.    | Display a single batch-level error message; provide Retry All action. Example: "Some uploads failed. Please try again." | Individual failed items cannot be identified; Retry All re-attempts entire batch.              |
| Name Format Errors                | As a user, I want clear feedback when file/folder names are invalid so I can fix them before uploading.                                    | Block invalid names before upload; indicate invalid chars, length, or reserved names.                                   | Invalid chars: `< > : " / \                                                                    | ? \*`. See: [Troubleshooting Uploads to Box](https://support.box.com/hc/en-us/articles/360044196773-Troubleshooting-Uploads-to-Box) |
| Duplicate Names                   | As a user, I want to know if uploading a file with the same name will overwrite or create a new version so I can avoid accidental changes. | Notify user of duplicate; indicate whether new version is created or upload blocked.                                    | Applies to single and multi-file uploads; folder duplicates blocked if names conflict.         |
| File Size Limits                  | As a user, I want an error when a file exceeds my plan's limit so I understand why it failed.                                              | Notify user of exceeding plan size restrictions                                                                         | Free: 250MB → Enterprise Advanced: 500GB; shared folder respects owner's limit.                |
| Upload Errors (Size / Network)    | As a user, if a file >100MB fails, I want to retry individual or all uploads so my content is uploaded successfully.                       | Retry single or all files; for interrupted sessions, show Resume / Resume All options for large files.                  | Resumable uploads apply to ≥100MB files; interrupted network/browser triggers resumable state. |
| Storage Quota Exceeded            | As a user, if my account or folder lacks space, I want an error explaining the quota issue so I know why upload failed.                    | Display quota exceeded message; provide guidance to delete items or contact admin.                                      | Applies per-user and per-folder; shared folder owner's quota applies.                          |
| Unsupported File Types            | As a user, I want a clear error if a file type is not supported so I understand system limitations.                                        | Block unsupported types before upload; show message specifying unsupported file type.                                   | Applies to single and multi-file uploads.                                                      |
| Permission Errors                 | As a user, if I do not have upload permissions, I want to be notified so I understand access restrictions.                                 | Display clear permission error; indicate folder/file affected.                                                          | Covers folder moved or permissions revoked mid-upload.                                         |
| Browser / Session Interruptions   | As a user, if my browser restarts or I refresh the page, I want to know which uploads were interrupted so I can resume.                    | Show resumable state for interrupted uploads; provide **Resume / Resume All** options.                                  | Applies to large files ≥100MB; smaller files may need full retry.                              |
| Duplicate Files / Version Uploads | As a user, when uploading a new version, I want confirmation that it replaced the older version so I know my content is updated.           | Show "New Version Uploaded" confirmation banner or inline status; update USM if applicable.                             | Applies only if file already exists; versioning respects Box file version rules.               |

---

## WCAG Requirements

> Note: Sync with Rob on the proper expectations

### 1. Keyboard Navigation

- Expand/collapse
- Retry
- Cancel
- Focus trapping in expanded state

### 2. Screen Reader Support

- Upload start
- Progress changes
- Completion
- Errors

---

## Size Limitations

Need to throw an error message when the customer attempts to upload an item larger than their tariff.

**How these upload limits are enforced:**

> Be aware shared folders enforce the file size limit that applies to the Folder Owner's plan, regardless of whether any of the collaborators within the folder have a higher limit.

| Tariff                          | Limit  |
| ------------------------------- | ------ |
| Free Personal                   | 250 MB |
| Starter                         | 2 GB   |
| Business                        | 5 GB   |
| Business Plus                   | 15 GB  |
| Enterprise (and Digital Suites) | 50 GB  |
| Enterprise Plus                 | 150 GB |
| Enterprise Advanced             | 500 GB |

---

## Appendix: File/Folder Name Restrictions

### Invalid Names

- Box only supports file/folder names that are **255 characters or less**
- File names containing non-printable ASCII, "/" or "\", names with leading or trailing spaces, and the special names "." and ".." are also unsupported
- Box supports only Unicode Basic Multilingual Plane 0 (BMP) characters in file and folder names

### Reserved Characters (Not Allowed)

- `<` (less than)
- `>` (greater than)
- `:` (colon)
- `"` (double quote)
- `/` (forward slash)
- `\` (backslash)
- `|` (vertical bar or pipe)
- `?` (question mark)
- `*` (asterisk)

### Case and Accent Sensitivity

- File/folder names are **case-insensitive** (no distinction between "a" and "A")
- File/folder names are **accent-insensitive** (no distinction between "a" and "ā")
- You can't have a file/folder titled with "Test" and "tèst" in the same directory as the file/folder name must be unique in each directory
- Unnamed files cannot be uploaded, but this should be blocked prior to the uploads manager workflow starting

### Common Error Messages

- **"Something went wrong with the upload. Please try again"**
  - This is the generic error message - it could be network problems, browser issues, server, proxy or firewall interference
  - Users should make sure their browsers are up to date
- **"An error occurred with the upload. Please refresh the page and try again"**
- **"Some uploads failed"**
  - This is used when multiple files are uploaded, but it is hard to pinpoint the exact upload error
