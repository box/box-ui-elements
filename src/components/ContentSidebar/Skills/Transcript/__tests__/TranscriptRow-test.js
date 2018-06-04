import * as React from 'react';
import { shallow } from 'enzyme';
import TranscriptRow from '../TranscriptRow';

describe('components/ContentSidebar/Skills/Transcript/TranscriptRow', () => {
    test('should correctly render read when editing', () => {
        const wrapper = shallow(<TranscriptRow isEditing />);
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render read when not editing', () => {
        const wrapper = shallow(<TranscriptRow />);
        expect(wrapper).toMatchSnapshot();
    });
});
