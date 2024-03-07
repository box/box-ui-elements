import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MessageDescriptor, FormattedMessage } from 'react-intl';
import { DocGenSidebarComponent as DocGenSidebar } from '../DocGenSidebar/DocGenSidebar';
import LoadingIndicator from '../../../components/loading-indicator';
import Error from '../DocGenSidebar/Error';

const intl = {
    formatMessage: (message: MessageDescriptor) => message.defaultMessage,
};

const mockData = [
    {
        tag_content: '{{ isActive }}',
        tag_type: 'text',
        json_paths: ['isActive'],
    },
    {
        tag_content: '{{ about }}',
        tag_type: 'text',
        json_paths: ['about', 'about.name'],
    },
    {
        tag_content: '{{ phone }}',
        tag_type: 'text',
        json_paths: ['phone'],
    },
    {
        tag_content: '{{ company }}',
        tag_type: 'text',
        json_paths: ['company', 'company.name'],
    },
    {
        tag_content: '{{contract.customerName}}',
        tag_type: 'text',
        json_paths: ['contract', 'contract.customerName'],
    },

    {
        tag_content: '{{contract.customerAddress.street}}',
        tag_type: 'text',
        json_paths: ['contract', 'contract.customerAddress', 'contract.customerAddress.street'],
    },

    {
        tag_content: '{{contract.customerAddress.city}}',
        tag_type: 'text',
        json_paths: ['contract', 'contract.customerAddress', 'contract.customerAddress.city'],
    },
    {
        tag_content: '{{if contract.country == “UK”}}',
        tag_type: 'conditional',
        json_paths: ['contract', 'contract.country'],
    },
    {
        tag_content: '{{if contract.country == “1111” and contract.city == “London” }}',
        tag_type: 'conditional',
        json_paths: ['contract', 'contract.country', 'contract.city'],
    },
    {
        tag_content: '{{elseif contract.country == “JAPAN” and contract.city == “Tokyo“}}',
        tag_type: 'conditional',
        json_paths: ['contract', 'contract.country', 'contract.city'],
    },
    {
        tag_content: '{{invoice.image}}',
        tag_type: 'image',
        json_paths: ['invoice', 'invoice.image'],
    },
    {
        tag_content: '{{item.quantity * item.price}}',
        tag_type: 'arithmetic',
        json_paths: ['products', 'products.quantity', 'products.price'],
    },
    {
        tag_content: '{{tablerow item in products }}',
        tag_type: 'table-loop',
        json_paths: ['products'],
    },
    {
        tag_content: '{{item.name}}',
        tag_type: 'text',
        json_paths: ['products', 'products.name', 'products.quantity', 'products.price'],
    },
    {
        tag_content: '{{item.quantity * item.price}}',
        tag_type: 'arithmetic',
        json_paths: ['products', 'products.quantity', 'products.price'],
    },
    {
        tag_content: '{{$sum(products.amount)}}',
        tag_type: 'arithmetic',
        json_paths: ['products', 'products.amount'],
    },
    {
        tag_content: '{{invoice.id}}',
        tag_type: 'text',
        json_paths: ['invoice', 'invoice.id'],
    },
    {
        tag_content: '{{invoice.date}}',
        tag_type: 'text',
        json_paths: ['invoice', 'invoice.date'],
    },
    {
        tag_content: '{{invoice.billingAddress.street::uppercase}}',
        tag_type: 'text',
        json_paths: ['invoice', 'invoice.billingAddress', 'invoice.billingAddress.street'],
    },
    {
        tag_content: '{{tablerow item in products }}',
        tag_type: 'table-loop',
        json_paths: ['products', 'products.name', 'products.description', 'products.quantity', 'products.price'],
    },
    {
        tag_content: '{{item.name}}',
        tag_type: 'text',
        json_paths: ['products', 'products.name', 'products.quantity', 'products.price'],
    },
    {
        tag_content: '{{item.quantity * item.price}}',
        tag_type: 'arithmetic',
        json_paths: ['products', 'products.quantity', 'products.price'],
    },
];

const docGenSidebarProps = {
    getDocGenTags: jest.fn().mockReturnValue(
        Promise.resolve({
            pagination: {},
            data: mockData,
        }),
    ),
    intl,
};

const noTagsMock = jest.fn().mockReturnValue(Promise.resolve({ data: [] }));
const errorTagsMock = jest.fn().mockRejectedValue([]);
const noDataMock = jest.fn().mockReturnValue(Promise.resolve({}));

const defaultProps = {
    ...docGenSidebarProps,
};

describe('elements/content-sidebar/DocGenSidebar', () => {
    const getWrapper = (props = defaultProps, options = {}) =>
        mount(<DocGenSidebar logger={{ onReadyMetric: jest.fn() }} {...props} />, options);

    test('componentDidMount() should call fetch tags', async () => {
        await act(async () => {
            await getWrapper(defaultProps);
        });
        expect(docGenSidebarProps.getDocGenTags).toHaveBeenCalled();
    });

    test('should render DocGen sidebar component correctly with tags list', async () => {
        let wrapper;
        await act(async () => {
            wrapper = getWrapper(defaultProps);
        });
        wrapper!.update();
        const tagList = wrapper!.find('span.docgen-tag-path');
        expect(tagList).toHaveLength(26);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render empty state when there are no tags', async () => {
        let wrapper;
        await act(async () => {
            wrapper = await getWrapper({
                ...defaultProps,
                getDocGenTags: noTagsMock,
            });
        });

        wrapper!.update();
        const emptyState = wrapper!.find(FormattedMessage).at(0);
        expect(emptyState.prop('defaultMessage')).toEqual('This document has no tags');
        expect(emptyState).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render loading state', async () => {
        const wrapper = await getWrapper({
            ...defaultProps,
            getDocGenTags: noTagsMock,
        });
        const loadingState = wrapper!.find(LoadingIndicator);
        expect(loadingState).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should re-trigger getDocGenTags on click on refresh button', async () => {
        let wrapper;
        await act(async () => {
            wrapper = await getWrapper({
                ...defaultProps,
                getDocGenTags: errorTagsMock,
            });
        });
        wrapper!.update();

        const refreshBtn = wrapper!.find('button');
        refreshBtn.simulate('click');
        wrapper!.update();
        expect(errorTagsMock).toBeCalledTimes(2);
    });

    test('should render error state', async () => {
        let wrapper;
        await act(async () => {
            wrapper = await getWrapper({
                ...defaultProps,
                getDocGenTags: errorTagsMock,
            });
        });
        wrapper!.update();

        const loadingState = wrapper!.find(Error);
        expect(loadingState).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
        const refreshBtn = wrapper!.find('button');
        expect(refreshBtn).toHaveLength(1);
    });
    test('should handle undefined data ', async () => {
        let wrapper;
        await act(async () => {
            wrapper = await getWrapper({
                ...defaultProps,
                getDocGenTags: noDataMock,
            });
        });
        wrapper!.update();
        const emptyState = wrapper!.find(FormattedMessage).at(0);
        expect(emptyState.prop('defaultMessage')).toEqual('This document has no tags');
        expect(emptyState).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });
});
