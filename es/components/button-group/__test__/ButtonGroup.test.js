import * as React from 'react';
import { mount } from 'enzyme';
import Button from '../../button';
import ButtonGroup from '..';
describe('components/button-group/ButtonGroup', () => {
  test('should render correct ButtonGroup', () => {
    const wrapper = mount(/*#__PURE__*/React.createElement(ButtonGroup, null, /*#__PURE__*/React.createElement(Button, null, "Add"), /*#__PURE__*/React.createElement(Button, null, "Update"), /*#__PURE__*/React.createElement(Button, null, "Remove")));
    expect(wrapper.find('.btn-group')).toBeTruthy();
    expect(wrapper.find('.btn').length).toBe(3);
  });
});
//# sourceMappingURL=ButtonGroup.test.js.map