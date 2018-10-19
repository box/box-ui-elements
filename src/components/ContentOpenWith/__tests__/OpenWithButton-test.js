import React from 'react';
import { shallow } from 'enzyme';
import OpenWithButton, { getTooltip } from '../OpenWithButton';
import messages from '../../messages';

describe('components/ContentOpenWith/OpenWithButton', () => {
    const getWrapper = props => shallow(<OpenWithButton {...props} />);

    describe('getTooltip()', () => {
        it('should return nothing if the button is loading', () => {
            const result = getTooltip(null, null, true);
            expect(result).toBe(null);
        });

        it('should use a message if there is an error', () => {
            const result = getTooltip(null, 'error', false);
            expect(result.props.defaultMessage).toEqual(
                messages.errorOpenWithDescription.defaultMessage,
            );
        });

        it('should return the display description if provided', () => {
            const description = 'tooltip description';
            const result = getTooltip(description, null, false);
            expect(result).toBe(description);
        });

        it('should use a message if there is nothing else to display', () => {
            const result = getTooltip(null, null, false);
            expect(result.props.defaultMessage).toEqual(
                messages.emptyOpenWithDescription.defaultMessage,
            );
        });
    });

    it('should render as disabled if the integration is disabled', () => {
        const wrapper = getWrapper({
            displayIntegration: { isDisabled: true, displayName: 'Adobe Sign' },
        });
        expect(wrapper).toMatchSnapshot();
    });

    it('should render as disabled if there is no display integration', () => {
        const wrapper = getWrapper({
            displayIntegration: { isDisabled: false, displayName: null },
        });

        expect(wrapper).toMatchSnapshot();
    });

    it('should render with the correct icon', () => {
        const wrapper = getWrapper({
            displayIntegration: {
                isDisabled: false,
                displayName: 'Google Docs',
            },
        });

        expect(wrapper).toMatchSnapshot();
    });
});
