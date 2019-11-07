import React from 'react';
import { shallow } from 'enzyme';
import selectionCellRenderer from '../selectionCellRenderer';

const rowData = {
    id: '51965506671',
    name: 'test',
    type: 'file',
};

const selected = [
    {
        id: '51965506671',
        type: 'file',
    },
];

describe('selectionCellRenderer', () => {
    test.each([['Checkbox', false], ['RadioButton', true]])('should render %s if isRadio is %s', (type, isRadio) => {
        const Element = selectionCellRenderer(() => {}, 'file, web_link', [], false, isRadio, selected);

        const wrapper = shallow(<Element rowData={rowData} />);
        expect(wrapper.exists(type)).toBe(true);
    });

    test.each([['isSelected', true], ['isChecked', false]])('should render %s if isRadio is %s', (type, isRadio) => {
        const Element = selectionCellRenderer(() => {}, 'file, web_link', [], false, isRadio, selected);

        const wrapper = shallow(<Element rowData={rowData} />);
        expect(wrapper.prop(type)).toBe(true);
    });
});
