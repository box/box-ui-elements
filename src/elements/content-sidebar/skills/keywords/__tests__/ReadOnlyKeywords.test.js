import * as React from 'react';
import { shallow } from 'enzyme';
import ReadOnlyKeywords from '../ReadOnlyKeywords';

describe('elements/content-sidebar/Skills/Keywords/ReadOnlyKeywords', () => {
    test('should correctly render with no keyword selected', () => {
        const props = {
            keywords: [
                { text: 'foo', appears: [{ start: 1 }] },
                { text: 'bar', appears: [{ start: 5 }] },
            ],
        };

        const wrapper = shallow(<ReadOnlyKeywords {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render timeline with keyword selected', () => {
        const props = {
            keywords: [
                { text: 'foo', appears: [{ start: 1 }] },
                { text: 'bar', appears: [{ start: 5 }] },
            ],
        };

        const wrapper = shallow(<ReadOnlyKeywords {...props} />);
        wrapper.setState({ selected: { text: 'foo', value: 1 } });

        expect(wrapper).toMatchSnapshot();
    });
});
