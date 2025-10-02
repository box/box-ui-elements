import React, { useState } from 'react';
import PillCloud from './PillCloud';
import notes from './PillCloud.stories.md';
const pills = [{
  value: 0,
  displayText: 'Box'
}, {
  value: 1,
  displayText: 'Fox'
}, {
  value: 2,
  displayText: 'Socks'
}, {
  value: 3,
  displayText: 'Flocks'
}, {
  value: 4,
  displayText: 'Chalks'
}, {
  value: 5,
  displayText: 'Locks'
}, {
  value: 6,
  displayText: 'long pill, very very long pill, so long that it breaks css boundaries'
}, {
  value: 7,
  displayText: 'Rocks'
}, {
  value: 8,
  displayText: 'Crocs'
}, {
  value: 9,
  displayText: 'Mox'
}, {
  value: 10,
  displayText: 'Stalks'
}, {
  value: 11,
  displayText: 'Clocks'
}, {
  value: 12,
  displayText: 'Lox'
}, {
  value: 13,
  displayText: 'Blocks'
}, {
  value: 14,
  displayText: 'Ox'
}, {
  value: 15,
  displayText: 'another long pill, very very long pill, so long that it breaks css boundaries'
}];
export const regular = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedOption, setSelectedOption] = useState(pills[5]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PillCloud, {
    onSelect: option => {
      setSelectedOption(option);
    },
    options: pills,
    selectedOptions: [selectedOption],
    buttonProps: {
      'data-button-type': 'pill-btn'
    }
  }), /*#__PURE__*/React.createElement("div", {
    id: "pill-cloud-output"
  }, "Selected Pill: ", selectedOption.displayText));
};
export default {
  title: 'Components/PillCloud',
  component: PillCloud,
  parameters: {
    notes
  }
};
//# sourceMappingURL=PillCloud.stories.js.map