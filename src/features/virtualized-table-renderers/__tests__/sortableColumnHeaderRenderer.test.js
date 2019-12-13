// @flow
import { shallow } from 'enzyme';
import { SortDirection } from 'react-virtualized/dist/es/Table';
import IconSortChevron from '../../../icons/general/IconSortChevron';
import sortableColumnHeaderRenderer from '../sortableColumnHeaderRenderer';

describe('features/virtualized-table-renderers/sortableColumnHeaderRenderer', () => {
    let wrapper;
    let props;

    const getWrapper = (prop = {}) => {
        return shallow(sortableColumnHeaderRenderer(prop));
    };

    beforeEach(() => {
        props = {
            dataKey: 'name',
            label: 'Name',
            sortBy: 'description',
            sortDirection: 'asc',
        };
        wrapper = getWrapper(props);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should successfully render a Sortable Column Header', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('should render a chevron when dataKey matches sortBy', () => {
        expect(wrapper.find(IconSortChevron).length).toBe(0);
        props.dataKey = 'name';
        props.sortBy = 'name';
        wrapper = getWrapper(props);
        expect(wrapper.find(IconSortChevron).length).toBe(1);
    });

    test('should set chevron class depending on sort direction', () => {
        props.dataKey = 'name';
        props.sortBy = 'name';

        props.sortDirection = SortDirection.ASC;
        wrapper = getWrapper(props);
        expect(wrapper.find(IconSortChevron).props().className).toBe('VirtualizedTable-sortIcon is-ascending');

        props.sortDirection = SortDirection.DESC;
        wrapper = getWrapper(props);
        expect(wrapper.find(IconSortChevron).props().className).toBe('VirtualizedTable-sortIcon is-descending');
    });
});
