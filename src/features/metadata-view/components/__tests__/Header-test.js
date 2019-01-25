import * as React from 'react';

import Header from '../Header';
import { headerData } from '../fixtures';

describe('features/metadata-view/components/Header', () => {
    test('should not include draggable if shouldRenderResizeColumnIcon is false', () => {
        const wrapper = shallow(
            <Header
                headerData={headerData}
                label="brohamasaurus"
                resizeRow={jest.fn()}
                shouldRenderResizeColumnIcon={false}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should include draggable if shouldRenderResizeColumnIcon is true', () => {
        const wrapper = shallow(
            <Header headerData={headerData} label="brohamasaurus" resizeRow={jest.fn()} shouldRenderResizeColumnIcon />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
