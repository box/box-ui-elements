import * as React from 'react';
import { shallow } from 'enzyme';
import EditingTranscriptRow from '../EditingTranscriptRow';

describe('elements/content-sidebar/Skills/Transcript/TranscriptRow', () => {
    test('should correctly render with time', () => {
        const wrapper = shallow(<EditingTranscriptRow time="123" />);
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render without time', () => {
        const wrapper = shallow(<EditingTranscriptRow />);
        expect(wrapper).toMatchSnapshot();
    });
});
