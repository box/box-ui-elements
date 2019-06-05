import React from 'react';

import EditClassificationButton from '../EditClassificationButton';

describe('features/classification/EditClassificationButton', () => {
    const getWrapper = (props = {}) => shallow(<EditClassificationButton {...props} />);

    test.each([[true], [false]])('should render correctly when isEditing is %s', isEditing => {
        const wrapper = getWrapper({
            className: 'foo',
            foo: 'bar',
            isEditing,
            onEdit: () => {},
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should call onEdit when edit button is clicked', () => {
        const onEdit = jest.fn();
        const wrapper = getWrapper({
            onEdit,
        });
        wrapper.simulate('click');
        expect(onEdit).toHaveBeenCalled();
    });
});
