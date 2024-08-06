import * as React from 'react';
import { mount } from 'enzyme';
// TODO Providers can be removed when converted to RTL - providers are included in the testing utility library
import { IntlProvider } from 'react-intl';
import { TooltipProvider } from '@box/blueprint-web';

import ItemList from '../ItemList';
import { ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED, STATUS_COMPLETE, STATUS_ERROR } from '../../../constants';

jest.unmock('react-intl'); // TODO can be removed when converted to RTL
jest.mock(
    '@box/react-virtualized/dist/es/AutoSizer',
    () =>
        ({ children }) =>
            children({ height: 600, width: 600 }),
);

describe('elements/content-uploader/ItemList', () => {
    const renderComponent = props =>
        mount(
            <IntlProvider locale="en">
                <TooltipProvider>
                    <ItemList items={[]} onClick={() => {}} {...props} />
                </TooltipProvider>
            </IntlProvider>,
        );

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = renderComponent();

            expect(wrapper.find('Table').length).toBe(1);
            expect(wrapper.find('Table.bcu-item-list').length).toBe(1);
        });

        test('should render component with correct number of items', () => {
            const items = [
                { id: '1', name: 'item1', status: STATUS_COMPLETE },
                { id: '2', name: 'item2', status: STATUS_COMPLETE },
                { id: '3', name: 'item3', status: STATUS_COMPLETE },
            ];
            const wrapper = renderComponent({ items });
            expect(wrapper.find('div.bcu-item-row').length).toBe(3);
            const actionColumnStyle = wrapper.find('.bcu-item-list-action-column').first().prop('style');
            expect(actionColumnStyle.flex).toEqual('0 0 32px');
        });

        test('should render action column with correct width for upgrade cta', () => {
            const items = [
                { id: '1', name: 'item1', status: STATUS_ERROR, code: ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED },
            ];
            const wrapper = renderComponent({ items, onUpgradeCTAClick: () => {} });
            expect(wrapper.find('div.bcu-item-row').length).toBe(1);
            const actionColumnStyle = wrapper.find('.bcu-item-list-action-column').prop('style');
            expect(actionColumnStyle.flex).toEqual('0 0 100px');
        });
    });
});
