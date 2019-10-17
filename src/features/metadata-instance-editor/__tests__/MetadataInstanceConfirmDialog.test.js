import React from 'react';

import MetadataInstanceConfirmDialog from '../MetadataInstanceConfirmDialog';

describe('features/metadata-instance-editor/MetadataInstanceConfirmDialog', () => {
    test('should correctly render', () => {
        const wrapper = shallow(<MetadataInstanceConfirmDialog onCancel={() => {}} onConfirm={() => {}} />);
        expect(wrapper).toMatchSnapshot();
    });
});
