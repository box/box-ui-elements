import React from 'react';
import { shallow } from 'enzyme';
import selectionCellRenderer from '../selectionCellRenderer';

const rowData = {
    name: 'test',
    selected: true,
    type: 'file',
};

describe('selectionCellRenderer', () => {
    test.each([[false, 'Checkbox'], [true, 'RadioButton']])('isRadio is %s should render %s', (expected, type) => {
        const Element = selectionCellRenderer(() => {}, 'file, web_link', [], false, expected);

        const wrapper = shallow(<Element rowData={rowData} />);
        expect(wrapper.exists(type)).toBe(true);
    });
});
