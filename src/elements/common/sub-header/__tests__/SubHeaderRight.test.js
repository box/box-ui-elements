import React from 'react';
import { shallow } from 'enzyme';
import Add from '../Add';
import GridViewSlider from '../../../../components/grid-view/GridViewSlider';
import SubHeaderRight from '../SubHeaderRight';
import ViewModeChangeButton from '../ViewModeChangeButton';
import { VIEW_FOLDER, VIEW_MODE_GRID } from '../../../../constants';

const getWrapper = props => shallow(<SubHeaderRight {...props} />);

describe('Elements/SubHeader/SubHeaderRight', () => {
    const currentCollection = {
        sortBy: '',
        sortDirection: '',
        items: ['123'],
    };

    test.each([
        [VIEW_FOLDER, false],
        [VIEW_MODE_GRID, true],
    ])('%s shows grid view slider %s', (viewMode, expectation) => {
        const wrapper = getWrapper({ viewMode, currentCollection });

        expect(wrapper.exists(GridViewSlider)).toBe(expectation);
    });

    test.each([
        [0, 0],
        [1, 1],
    ])('should show %i grid view buttons on toolbar', (columns, expectation) => {
        const wrapper = getWrapper({ gridColumnCount: columns, currentCollection });
        expect(wrapper.find(ViewModeChangeButton).length).toEqual(expectation);
    });

    test.each([
        [VIEW_FOLDER, true],
        [VIEW_MODE_GRID, false],
    ])('Add button with %s on toolbar should be %s', (view, expectation) => {
        const wrapper = getWrapper({
            canUpload: expectation,
            canCreateNewFolder: expectation,
            view,
            currentCollection,
        });
        expect(wrapper.exists(Add)).toBe(expectation);
    });
});
