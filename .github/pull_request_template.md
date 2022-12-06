Please add the `ready-to-merge` label when the pull request has received the appropriate approvals.
Using the `ready-to-merge` label adds your approved pull request to the merge queue where it waits to be merged.
Mergify will merge your pull request based on the queue assuming your pull request is still in a green state after the previous merge.

What to do when the `ready-to-merge` label not working:

- Do you have two approvals?
  - At least two approvals are required in order to merge to the master branch.
- Are there any reviewers that are still requetsed for review?
  - If the pull request has received the necessary approvals, remove any additional reviewer requests that are pending.
    - e.g.
      - Three reviewers were added comments but you already have two necessary approvals and the third reviewer's comments are no longer applicable. You can remove the third person as a reviewer or have them approve the pull request.
      - A team was added as a reviewer because of a change to a file but the file change has been undone. At this point, it should be safe to remove the team as a reviewer.
- Are there any other pull requests in the merge queue before?
  - Mergify handles the queueing, your pull request will eventually get merged.

When to contact someone for assistance when trying to merge via `ready-to-merge` label?

- There are no other pull requests in the merge queue and your pull request has been sitting there with the `ready-to-merge` label for longer than a couple of hours.
- If you are unable to remove unnecessary reviewers from the pull request.
- If you are unable to add the `ready-to-merge` label.
  -->
