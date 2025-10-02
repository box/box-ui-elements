import ContentPicker from '../../ContentPicker';
export const basic = {
  args: {
    maxSelectable: 99
  }
};
export const withPagination = {
  args: {
    initialPageSize: 3
  }
};
export default {
  title: 'Elements/ContentPicker/tests/e2e',
  component: ContentPicker,
  args: {
    features: global.FEATURE_FLAGS,
    rootFolderId: global.FOLDER_ID,
    token: global.TOKEN
  }
};
//# sourceMappingURL=ContentPicker-e2e.test.stories.js.map