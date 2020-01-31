import * as React from 'react';
import { shallow } from 'enzyme';
import ReadOnlyTranscriptRow from '../ReadOnlyTranscriptRow';

describe('elements/content-sidebar/Skills/Transcript/TranscriptRow', () => {
    test('should correctly render with time', () => {
        const wrapper = shallow(<ReadOnlyTranscriptRow time="123" />);
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render without time', () => {
        const wrapper = shallow(<ReadOnlyTranscriptRow />);
        expect(wrapper).toMatchSnapshot();
    });
});
