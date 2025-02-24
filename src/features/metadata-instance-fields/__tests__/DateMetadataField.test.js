import * as React from 'react';

import { DateMetadataFieldBase as DateMetadataField } from '../DateMetadataField';

describe('features/metadata-instance-editor/fields/DateMetadataField', () => {
    const intl = {
        formatMessage: jest.fn(),
    };

    test('should correctly render a date field', () => {
        const wrapper = shallow(<DateMetadataField dataValue="2018-06-13T00:00:00.000Z" intl={intl} />);
        expect(wrapper.props()).toMatchObject({
            hideOptionalLabel: true,
            onChange: expect.any(Function),
        });
    });
});
