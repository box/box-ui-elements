import * as React from 'react';
import { shallow } from 'enzyme';
import SkillsBusyIndicator from '../SkillsBusyIndicator';

describe('components/ContentSidebar/Skills/SkillsBusyIndicator', () => {
    test('should correctly render', () => {
        const wrapper = shallow(<SkillsBusyIndicator />);
        expect(wrapper).toMatchSnapshot();
    });
});
