import * as React from 'react';
import { shallow } from 'enzyme';
import noop from 'lodash/noop';
import { IntlShape } from 'react-intl';
import { CloseButtonBase as CloseButton } from '../CloseButton';
import PlainButton from '../../plain-button';

const intlMock = ({ formatMessage: jest.fn().mockReturnValue('Close') } as unknown) as IntlShape;

describe('components/tooltip/CloseButton', () => {
    const defaultProps = {
        onClick: noop,
    };
    const getWrapper = (props = {}) => shallow(<CloseButton intl={intlMock} {...defaultProps} {...props} />);

    test('should call onClick when PlainButton is clicked', () => {
        const onClickMock = jest.fn();
        const wrapper = getWrapper({ onClick: onClickMock });
        const plainButton = wrapper.find(PlainButton);

        expect(onClickMock).not.toBeCalled();
        plainButton.simulate('click');
        expect(onClickMock).toBeCalledTimes(1);
    });

    test('should have aria label `Close` on PlainButton', () => {
        const wrapper = getWrapper();
        const plainButton = wrapper.find(PlainButton);

        expect(plainButton.prop('aria-label')).toBe('Close');
    });
});
