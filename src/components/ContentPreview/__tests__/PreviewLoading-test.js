import React from 'react';
import { shallow } from 'enzyme';
import { PreviewLoadingComponent as PreviewLoading } from '../PreviewLoading';

const getWrapper = () => shallow(<PreviewLoading />);

describe('components/ContentPreview/PreviewLoading', () => {
    describe('render()', () => {
        test('should render correctly', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });
    });
});
