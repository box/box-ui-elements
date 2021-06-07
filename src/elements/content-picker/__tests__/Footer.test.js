import React from 'react';
import { mount } from 'enzyme';
import Footer from '../Footer';

describe('elements/content-picker/Footer', () => {
    const defaultProps = {
        children: <div className="footer-child" />,
        hasHitSelectionLimit: false,
        isSingleSelect: false,
        onCancel: () => {},
        onChoose: () => {},
        onSelectedClick: () => {},
        selectedCount: 0,
        selectedItems: [],
    };

    const getWrapper = props => mount(<Footer {...props} />);

    describe('render()', () => {
        test('should render Footer', () => {
            const footerProps = { ...defaultProps };

            const wrapper = getWrapper({ ...footerProps });

            expect(wrapper.find('ButtonGroup').length).toBe(1);
            expect(wrapper.find('.footer-child').length).toBe(1);
        });

        test('should render Footer with custom action button', () => {
            const footerProps = {
                ...defaultProps,
                renderCustomActionButtons: () => <div className="custom-button" />,
            };

            const wrapper = getWrapper({ ...footerProps });

            expect(wrapper.find('.custom-button').length).toBe(1);
        });
    });
});
