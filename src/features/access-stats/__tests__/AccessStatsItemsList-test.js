import React from 'react';

import AccessStatsItemsList from '../AccessStatsItemsList';

describe('features/access-stats/AccessStatsItemsList', () => {
    const getWrapper = (props = {}) =>
        shallow(
            <AccessStatsItemsList
                {...{
                    commentCount: 0,
                    downloadCount: 0,
                    editCount: 0,
                    isBoxNote: false,
                    previewCount: 0,
                    commentStatButtonProps: {},
                    downloadStatButtonProps: {},
                    editStatButtonProps: {},
                    previewStatButtonProps: {},
                    viewStatButtonProps: {},
                }}
                {...props}
            />,
        );

    test('should render download access stats properly when item is box notes', () => {
        const wrapper = getWrapper({
            downloadCount: 100,
            isBoxNote: true,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render view access stats properly when item is box notes', () => {
        const wrapper = getWrapper({
            previewCount: 100,
            isBoxNote: true,
            viewStatButtonProps: { value: 1 },
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render preview access stats properly when item is not box notes', () => {
        const wrapper = getWrapper({
            previewCount: 100,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render access stats list with button props', () => {
        const wrapper = getWrapper({
            commentCount: 10,
            downloadCount: 10,
            editCount: 10,
            isBoxNote: false,
            previewCount: 10,
            commentStatButtonProps: { comment: 1 },
            downloadStatButtonProps: { download: 1 },
            editStatButtonProps: { edit: 1 },
            previewStatButtonProps: { preview: 1 },
        });

        expect(wrapper).toMatchSnapshot();
    });
});
