# Ticket Template

## Ticket: [Descriptive Title]

**Estimated Effort:** X SP (Note: 6 SP capacity per developer per 2-week sprint)

### What

[Brief overview of what needs to be implemented]

**[Component/Feature] Structure:** (if applicable)

```typescript
// Code examples, interfaces, or implementation patterns
```

**Key Features:**

- Feature 1
- Feature 2
- Feature 3

**Visual States/Design:** (if UI component)

1. **State Name** (`CONSTANT_NAME`):
   - Visual description
   - Behavior details
   - User interactions

**Component API:** (if applicable)

```typescript
interface ComponentProps {
  // Props definition
}
```

### Where

**Files to Create:** (if applicable)

1. **FileName.tsx** (`full/path/to/FileName.tsx`):
   - Description of what this file contains
   - Initial implementation details
   ```typescript
   // Optional: Initial code structure
   ```

**Files to Modify:** (if applicable)

1. **FileName.tsx** (`full/path/to/FileName.tsx`):

**Dependencies:** (if applicable)

- npm package names
- Existing constants/utilities to import

**Accessibility Requirements:** (if applicable)

- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- WCAG compliance notes

**Edge Cases:** (if applicable)

- Edge case 1 and how to handle it
- Edge case 2 and how to handle it

---

**Dependencies:** List of prerequisite ticket titles
**Notes:** Additional context, design decisions, or important considerations
**Follow-up Tickets:** Future related work (optional)

---

## Template Usage Notes

### Key Template Elements:

1. **Title**: Clear, action-oriented (e.g., "Create UploadHeader Component", "Integrate ItemList into UploadsManagerV2")

2. **What Section**: Answers "what are we building?" with:

   - Overview and purpose
   - Technical specifications (APIs, interfaces, props)
   - Visual/UX details for UI components
   - Implementation strategy

3. **Where Section**: Answers "where does the code go?" with:

   - Exact file paths for new files
   - Exact file paths and line numbers for modifications
   - Dependencies and imports
   - Accessibility and edge cases

4. **Metadata Footer**: After `---` separator:
   - Estimated effort (in days)
   - Dependencies (prerequisite tickets)
   - Notes (context, decisions)
   - Follow-up tickets (optional)
