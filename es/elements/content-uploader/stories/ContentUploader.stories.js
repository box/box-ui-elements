import ContentUploader from '../ContentUploader';
import mockTheme from '../../common/__mocks__/mockTheme';
export const basic = {};
export const withTheming = {
  args: {
    theme: mockTheme
  }
};
export default {
  title: 'Elements/ContentUploader',
  component: ContentUploader,
  args: {
    features: global.FEATURE_FLAGS,
    rootFolderId: global.FOLDER_ID,
    token: global.TOKEN
  }
};
//# sourceMappingURL=ContentUploader.stories.js.map