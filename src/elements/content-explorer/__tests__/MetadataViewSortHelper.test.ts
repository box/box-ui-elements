import { FIELD_ITEM_NAME, FIELD_NAME, SORT_ASC, SORT_DESC } from '../../../constants';
import {
    getInitialSortDropdown,
    getMetadataQueryOrderBy,
    hasMetadataQueryOrderByChanged,
} from '../MetadataViewSortHelper';

describe('elements/content-explorer/MetadataViewSortHelper', () => {
    test('should use consumer supplied order_by for the first query', () => {
        const order = getMetadataQueryOrderBy(
            { field_key: 'metadata.enterprise_0.templateName.last_contacted_at', direction: SORT_DESC },
            FIELD_NAME,
            SORT_ASC,
            false,
        );

        expect(order).toEqual({
            field_key: 'last_contacted_at',
            direction: SORT_DESC,
        });
    });

    test('should use default order_by (Name) for the first query if consumer does not pass order_by', () => {
        const order = getMetadataQueryOrderBy(undefined, FIELD_NAME, SORT_ASC, false);

        expect(order).toEqual({
            field_key: FIELD_ITEM_NAME,
            direction: SORT_ASC,
        });
    });

    test('should use item.name for the sort dropdown if consumer passes the name field', () => {
        expect(getInitialSortDropdown({ field_key: FIELD_NAME, direction: SORT_DESC })).toEqual({
            initialSortByColumnId: FIELD_ITEM_NAME,
            initialSortDirection: 'descending',
        });
    });

    test('should use item.name for the first query if consumer passes the name field', () => {
        const order = getMetadataQueryOrderBy(
            { field_key: FIELD_NAME, direction: SORT_ASC },
            'industry',
            SORT_DESC,
            false,
        );

        expect(order).toEqual({
            field_key: FIELD_ITEM_NAME,
            direction: SORT_ASC,
        });
    });

    test('should use item.name for the query if the user selects the name column', () => {
        const order = getMetadataQueryOrderBy(
            { field_key: 'industry', direction: SORT_DESC },
            FIELD_NAME,
            SORT_ASC,
            true,
        );

        expect(order).toEqual({
            field_key: FIELD_ITEM_NAME,
            direction: SORT_ASC,
        });
    });

    test('should use the metadata column id for the sort dropdown if consumer passes a metadata column id', () => {
        const columnId = 'metadata.enterprise_0.templateName.last_contacted_at';

        expect(getInitialSortDropdown({ field_key: columnId, direction: SORT_DESC })).toEqual({
            initialSortByColumnId: columnId,
            initialSortDirection: 'descending',
        });
    });

    test('should use the metadata column id for the sort dropdown if consumer passes the template field key', () => {
        const columnId = 'metadata.enterprise_1515946.mdViewTemplate1.textField';

        expect(getInitialSortDropdown({ field_key: 'textField', direction: SORT_DESC }, [{ id: columnId }])).toEqual({
            initialSortByColumnId: columnId,
            initialSortDirection: 'descending',
        });
    });

    test('should use ascending for the sort dropdown if consumer passes ASC', () => {
        expect(getInitialSortDropdown({ field_key: 'industry', direction: SORT_ASC })).toEqual({
            initialSortByColumnId: 'industry',
            initialSortDirection: 'ascending',
        });
    });

    test('should use the column the user selects after the consumer supplies order_by', () => {
        const order = getMetadataQueryOrderBy(
            { field_key: 'metadata.enterprise_0.templateName.last_contacted_at', direction: SORT_DESC },
            'industry',
            SORT_ASC,
            true,
        );

        expect(order).toEqual({
            field_key: 'industry',
            direction: SORT_ASC,
        });
    });

    test('should treat the same order_by clause as unchanged', () => {
        expect(
            hasMetadataQueryOrderByChanged(
                { field_key: 'industry', direction: SORT_ASC },
                { field_key: 'industry', direction: SORT_ASC },
            ),
        ).toBe(false);
    });

    test('should treat a different field or direction as a new order_by', () => {
        expect(
            hasMetadataQueryOrderByChanged(
                { field_key: 'industry', direction: SORT_ASC },
                { field_key: 'metadata.enterprise_0.templateName.last_contacted_at', direction: SORT_DESC },
            ),
        ).toBe(true);
    });
});
