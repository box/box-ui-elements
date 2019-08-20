import React from 'react';
import noop from 'lodash/noop';
import { shallow } from 'enzyme';
import { ItemActionForTesting as ItemAction } from '../ItemAction';
import { STATUS_PENDING, STATUS_IN_PROGRESS, STATUS_COMPLETE, STATUS_STAGED, STATUS_ERROR } from '../../../constants';

describe('elements/content-uploader/ItemAction', () => {
    const getWrapper = props =>
        shallow(
            <ItemAction
                intl={{ formatMessage: data => <span {...data} /> }}
                onClick={noop}
                status={STATUS_PENDING}
                {...props}
            />,
        );

    test('should render correctly with STATUS_COMPLETE', () => {
        const wrapper = getWrapper({
            status: STATUS_COMPLETE,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly with STATUS_IN_PROGRESS', () => {
        const wrapper = getWrapper({
            status: STATUS_IN_PROGRESS,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly with STATUS_STAGED', () => {
        const wrapper = getWrapper({
            status: STATUS_STAGED,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly with STATUS_ERROR', () => {
        const wrapper = getWrapper({
            status: STATUS_ERROR,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly with STATUS_PENDING', () => {
        const wrapper = getWrapper({
            status: STATUS_PENDING,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly with STATUS_ERROR and item is folder', () => {
        const wrapper = getWrapper({
            status: STATUS_ERROR,
            isFolder: true,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
