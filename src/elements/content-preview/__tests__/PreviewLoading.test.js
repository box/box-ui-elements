import React from 'react';
import { shallow } from 'enzyme';
import { PreviewLoadingComponent as PreviewLoading } from '../PreviewLoading';
import { ERROR_CODE_FETCH_FILE_DUE_TO_POLICY } from '../../../constants';

const getWrapper = props => shallow(<PreviewLoading {...props} />);

describe('elements/content-preview/PreviewLoading', () => {
    describe('render()', () => {
        test('should render correctly', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });

        test('should render correctly when blocked by access policy', () => {
            const wrapper = getWrapper({ errorCode: ERROR_CODE_FETCH_FILE_DUE_TO_POLICY });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
