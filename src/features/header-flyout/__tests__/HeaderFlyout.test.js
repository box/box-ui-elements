import { shallow } from 'enzyme';
import React from 'react';

import HeaderFlyout from '../HeaderFlyout';

describe('components/core/header/components/HeaderFlyout', () => {
    describe('render()', () => {
        test('should render default component', () => {
            const baseComponent = shallow(
                <HeaderFlyout onClose={() => {}} onOpen={() => {}}>
                    <span>test</span>
                </HeaderFlyout>,
            );

            expect(baseComponent).toMatchSnapshot();
        });

        test('should include the header and footer', () => {
            const headerFooterComponent = shallow(
                <HeaderFlyout
                    className="foo"
                    footer={<span>test footer</span>}
                    header={<span>test header</span>}
                    onClose={() => {}}
                    onOpen={() => {}}
                >
                    <span>test</span>
                </HeaderFlyout>,
            );

            expect(headerFooterComponent).toMatchSnapshot();
        });

        test('should render the flyout button in the appropriate order', () => {
            const componentWithButton = shallow(
                <HeaderFlyout flyoutButton={<button type="button">click me</button>}>
                    <span>content here</span>
                </HeaderFlyout>,
            );

            expect(componentWithButton).toMatchSnapshot();
        });
    });
});
