import * as React from 'react';
import { shallow } from 'enzyme';

import PreviewGhost from '../PreviewGhost';

const getWrapper = () => shallow(<PreviewGhost />);

describe('components/preview-ghost/PreviewGhost.js', () => {
    test('should render correctly', () => {
        expect(getWrapper()).toMatchSnapshot();
    });
});
