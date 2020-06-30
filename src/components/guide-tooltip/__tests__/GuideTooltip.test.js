// @flow
import * as React from 'react';
import { shallow } from 'enzyme';
import GuideTooltip from '../GuideTooltip';
import FolderShared32 from '../../../icon/content/FolderShared32';

describe('components/guide-tooltip/GuideTooltip', () => {
    const title = <div>title</div>;
    const body = <div>body</div>;
    const icon = <FolderShared32 />;
    const steps = [1, 3];
    const primaryButtonProps = { children: 'Next' };
    const secondaryButtonProps = { children: 'Previous' };

    const getWrapper = props => shallow(<GuideTooltip {...props} />);

    test('should render with title and body', () => {
        const wrapper = getWrapper({ body, title });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render with just body', () => {
        const wrapper = getWrapper({ body });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render with all options', () => {
        const wrapper = getWrapper({ body, title, icon, primaryButtonProps, secondaryButtonProps, steps });
        expect(wrapper).toMatchSnapshot();
    });
});
