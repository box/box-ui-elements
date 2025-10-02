import * as React from 'react';
import { ContentState } from 'draft-js';
const DraftMentionItem = ({
  contentState,
  entityKey,
  children
}) => {
  let id = '';
  if (entityKey) {
    id = contentState.getEntity(entityKey).getData().id;
  }
  return /*#__PURE__*/React.createElement("a", {
    href: `/profile/${id}`
  }, children);
};
export default DraftMentionItem;
//# sourceMappingURL=DraftMentionItem.js.map