import React from 'react';
import { shallow } from 'enzyme';
import PreviewError from '../PreviewError';
import { ERROR_CODE_FETCH_FILE_DUE_TO_POLICY } from '../../../constants';

const getWrapper = props => shallow(<PreviewError {...props} />);

describe('elements/content-preview/PreviewError', () => {
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
