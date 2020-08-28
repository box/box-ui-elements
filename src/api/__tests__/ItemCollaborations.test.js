import ItemCollaborations from '../ItemCollaborations';
import { DEFAULT_MAX_COLLABORATORS } from '../../constants';

const MOCK_ITEM_ID = '14237093';
let itemCollaborations;
let markerGetSpy;

describe('api/ItemCollaborations', () => {
    beforeEach(() => {
        itemCollaborations = new ItemCollaborations({});
        markerGetSpy = jest.spyOn(itemCollaborations, 'markerGet');
    });

    describe('getUrl()', () => {
        test('should return the default API URL', () => {
            expect(itemCollaborations.getUrl(MOCK_ITEM_ID)).toBe(`getUrl(${MOCK_ITEM_ID}) should be overridden`);
        });
    });

    describe('getCollaborations()', () => {
        let successCallback;
        let errorCallback;

        beforeEach(() => {
            successCallback = jest.fn();
            errorCallback = jest.fn();
        });

        test.each`
            providedLimit | providedRequestData                   | limit                        | requestData                           | description
            ${undefined}  | ${undefined}                          | ${DEFAULT_MAX_COLLABORATORS} | ${{}}                                 | ${'default arguments'}
            ${100}        | ${{ fields: ['id', 'type', 'name'] }} | ${100}                       | ${{ fields: ['id', 'type', 'name'] }} | ${'provided arguments'}
        `(
            'should call markerGet() with the $description',
            ({ providedLimit, providedRequestData, limit, requestData }) => {
                itemCollaborations.getCollaborations(
                    MOCK_ITEM_ID,
                    successCallback,
                    errorCallback,
                    providedRequestData,
                    providedLimit,
                );
                expect(markerGetSpy).toHaveBeenCalledWith({
                    id: MOCK_ITEM_ID,
                    limit,
                    successCallback,
                    errorCallback,
                    requestData,
                });
            },
        );
    });

    describe('successHandler()', () => {
        const MOCK_DATA = { entries: [] };

        test('should do nothing if isDestroyed() returns true', () => {
            jest.spyOn(itemCollaborations, 'isDestroyed').mockReturnValue(true);
            itemCollaborations.successCallback = jest.fn();
            itemCollaborations.successHandler(MOCK_DATA);
            expect(itemCollaborations.successCallback).not.toHaveBeenCalled();
        });

        test('should call successCallback with data', () => {
            jest.spyOn(itemCollaborations, 'isDestroyed').mockReturnValue(false);
            itemCollaborations.successCallback = jest.fn();
            itemCollaborations.successHandler(MOCK_DATA);
            expect(itemCollaborations.successCallback).toHaveBeenCalledWith(MOCK_DATA);
        });
    });
});
