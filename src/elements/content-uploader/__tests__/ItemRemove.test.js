import React from 'react';
import { shallow } from 'enzyme';

import PlainButton from '../../../components/plain-button';
import { ItemRemoveBase as ItemRemove } from '../ItemRemove';

import { STATUS_IN_PROGRESS } from '../../../constants';

describe('elements/content-uploader/ItemRemove', () => {
    test('should have aria-label "Remove" and no aria-describedby', () => {
        const wrapper = shallow(
            <ItemRemove
                intl={{ formatMessage: data => data.defaultMessage }}
                status={STATUS_IN_PROGRESS} // Use any status. The label does not change based on status.
            />,
        );

        const plainButton = wrapper.find(PlainButton);
        expect(plainButton.prop('aria-label')).toBe('Remove');
        expect(plainButton.prop('aria-describedby')).toBeFalsy();
    });
});
