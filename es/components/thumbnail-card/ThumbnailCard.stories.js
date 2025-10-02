import * as React from 'react';
import ThumbnailCard from './ThumbnailCard';
import notes from './ThumbnailCard.stories.md';
const thumbnail = /*#__PURE__*/React.createElement("div", null, "Thumbnail");
const title = 'Title';
export const basic = () => /*#__PURE__*/React.createElement(ThumbnailCard, {
  thumbnail: thumbnail,
  title: title
});
export const highlightOnHover = () => /*#__PURE__*/React.createElement(ThumbnailCard, {
  highlightOnHover: true,
  thumbnail: thumbnail,
  title: title
});
export default {
  title: 'Components/ThumbnailCard',
  component: ThumbnailCard,
  parameters: {
    notes
  }
};
//# sourceMappingURL=ThumbnailCard.stories.js.map