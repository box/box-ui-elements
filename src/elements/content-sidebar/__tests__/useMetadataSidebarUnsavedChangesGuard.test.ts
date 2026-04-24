import type { History, Location } from 'history';
import type { MetadataTemplateInstance } from '@box/metadata-editor';
import { act, renderHook } from '../../../test-utils/testing-library';
import useMetadataSidebarUnsavedChangesGuard from '../hooks/useMetadataSidebarUnsavedChangesGuard';
import { SIDEBAR_VIEW_METADATA } from '../../../constants';

const mockUnblock = jest.fn();
const mockBlock = jest.fn().mockReturnValue(mockUnblock);
const mockReplace = jest.fn();
const mockHistory = { block: mockBlock, replace: mockReplace } as unknown as History;

const mockSetEditingTemplate = jest.fn();
const mockSetIsUnsavedChangesModalOpen = jest.fn();
const mockSetPendingTemplateToEdit = jest.fn();
const mockOnEditingStateChange = jest.fn();
const mockRegisterOpenWarningModalCallback = jest.fn();

const mockTemplate = {
    canEdit: true,
    id: 'tmpl-1',
    scope: 'enterprise_123',
    templateKey: 'my_template',
    hidden: false,
    fields: [],
    type: 'metadata_template',
} satisfies MetadataTemplateInstance;

const fakeLocation = { pathname: '/boxai', search: '', hash: '', state: undefined } as Location;

type Params = Parameters<typeof useMetadataSidebarUnsavedChangesGuard>[0];

const defaultProps: Params = {
    editingTemplate: null,
    fileId: 'file-1',
    history: mockHistory,
    isConfidenceScoreReviewEnabled: true,
    onEditingStateChange: mockOnEditingStateChange,
    setEditingTemplate: mockSetEditingTemplate,
    setIsUnsavedChangesModalOpen: mockSetIsUnsavedChangesModalOpen,
    setPendingTemplateToEdit: mockSetPendingTemplateToEdit,
    registerOpenWarningModalCallback: mockRegisterOpenWarningModalCallback,
};

function setup(overrides: Partial<Params> = {}) {
    // Use a mutable ref so partial rerender calls merge with defaults.
    const propsRef = { current: { ...defaultProps, ...overrides } };

    const {
        result,
        rerender: rawRerender,
        unmount,
    } = renderHook(() => useMetadataSidebarUnsavedChangesGuard(propsRef.current));

    const rerender = (nextOverrides: Partial<Params>) => {
        propsRef.current = { ...propsRef.current, ...nextOverrides };
        rawRerender();
    };

    return { result, rerender, unmount };
}

describe('useMetadataSidebarUnsavedChangesGuard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockBlock.mockReturnValue(mockUnblock);
    });

    describe('fileId-change reset effect', () => {
        test('should clear editing state on initial render', () => {
            setup();
            expect(mockSetEditingTemplate).toHaveBeenCalledWith(null);
            expect(mockSetPendingTemplateToEdit).toHaveBeenCalledWith(null);
            expect(mockSetIsUnsavedChangesModalOpen).toHaveBeenCalledWith(false);
        });

        test('should clear editing state again when fileId changes', () => {
            const { rerender } = setup();
            jest.clearAllMocks();

            rerender({ fileId: 'file-2' });

            expect(mockSetEditingTemplate).toHaveBeenCalledWith(null);
            expect(mockSetPendingTemplateToEdit).toHaveBeenCalledWith(null);
            expect(mockSetIsUnsavedChangesModalOpen).toHaveBeenCalledWith(false);
        });

        test('should NOT clear editing state when an unrelated prop changes', () => {
            const { rerender } = setup();
            jest.clearAllMocks();

            rerender({ isConfidenceScoreReviewEnabled: false });

            expect(mockSetEditingTemplate).not.toHaveBeenCalled();
        });
    });

    describe('onEditingStateChange effect', () => {
        test('should call onEditingStateChange with false when editingTemplate is null', () => {
            setup();
            expect(mockOnEditingStateChange).toHaveBeenCalledWith(false);
        });

        test('should call onEditingStateChange with true when editingTemplate is set', () => {
            setup({ editingTemplate: mockTemplate });
            expect(mockOnEditingStateChange).toHaveBeenCalledWith(true);
        });

        test('should notify parent when editingTemplate transitions from null to truthy', () => {
            const { rerender } = setup();
            jest.clearAllMocks();

            rerender({ editingTemplate: mockTemplate });

            expect(mockOnEditingStateChange).toHaveBeenCalledWith(true);
        });
    });

    describe('registerOpenWarningModalCallback effect', () => {
        test('should register handleUnsavedChangesModalOpen on mount', () => {
            const { result } = setup();
            expect(mockRegisterOpenWarningModalCallback).toHaveBeenCalledWith(
                result.current.handleUnsavedChangesModalOpen,
            );
        });
    });

    describe('router blocking', () => {
        test('should NOT call history.block when editingTemplate is null', () => {
            setup();
            expect(mockBlock).not.toHaveBeenCalled();
        });

        test('should NOT call history.block when isConfidenceScoreReviewEnabled is false', () => {
            setup({ editingTemplate: mockTemplate, isConfidenceScoreReviewEnabled: false });
            expect(mockBlock).not.toHaveBeenCalled();
        });

        test('should call history.block when editingTemplate becomes truthy and feature is on', () => {
            const { rerender } = setup();

            rerender({ editingTemplate: mockTemplate });

            expect(mockBlock).toHaveBeenCalledTimes(1);
            expect(mockBlock).toHaveBeenCalledWith(expect.any(Function));
        });

        test('should unblock when editingTemplate goes back to null', () => {
            const { rerender } = setup({ editingTemplate: mockTemplate });

            expect(mockBlock).toHaveBeenCalledTimes(1);

            rerender({ editingTemplate: null });

            expect(mockUnblock).toHaveBeenCalled();
        });

        test('should unblock on unmount while editing', () => {
            const { unmount } = setup({ editingTemplate: mockTemplate });

            unmount();

            expect(mockUnblock).toHaveBeenCalled();
        });
    });

    describe('block callback behaviour', () => {
        function getBlockCallback() {
            return mockBlock.mock.calls[0][0] as (loc: Location) => boolean | undefined;
        }

        test('should return undefined and not open modal for metadata pathname', () => {
            setup({ editingTemplate: mockTemplate });

            const returnValue = getBlockCallback()({ pathname: `/${SIDEBAR_VIEW_METADATA}` } as Location);

            expect(returnValue).toBeUndefined();
            expect(mockSetIsUnsavedChangesModalOpen).not.toHaveBeenCalledWith(true);
        });

        test('should return false, open modal, and stash location for other paths', () => {
            const { result } = setup({ editingTemplate: mockTemplate });

            const blockCb = getBlockCallback();
            let returnValue: boolean | undefined;

            act(() => {
                returnValue = blockCb(fakeLocation);
            });

            expect(returnValue).toBe(false);
            expect(mockSetIsUnsavedChangesModalOpen).toHaveBeenCalledWith(true);
            expect(result.current.pendingNavLocation).toEqual(fakeLocation);
        });
    });

    describe('handleUnsavedChangesModalOpen', () => {
        test('should only call setIsUnsavedChangesModalOpen(true) when opening', () => {
            const { result } = setup();

            jest.clearAllMocks();
            act(() => {
                result.current.handleUnsavedChangesModalOpen(true);
            });

            expect(mockSetIsUnsavedChangesModalOpen).toHaveBeenCalledWith(true);
            expect(mockReplace).not.toHaveBeenCalled();
        });

        test('should call history.replace and clear pendingNavLocation when closing with stashed location and feature on', () => {
            const { result } = setup({ editingTemplate: mockTemplate });

            // Trigger block callback to stash a location
            const blockCb = mockBlock.mock.calls[0][0] as (loc: Location) => boolean | undefined;
            act(() => {
                blockCb(fakeLocation);
            });
            expect(result.current.pendingNavLocation).toEqual(fakeLocation);

            jest.clearAllMocks();
            act(() => {
                result.current.handleUnsavedChangesModalOpen(false);
            });

            expect(mockReplace).toHaveBeenCalledWith(`/${SIDEBAR_VIEW_METADATA}`);
            expect(result.current.pendingNavLocation).toBeNull();
        });

        test('should NOT call history.replace when feature flag is off', () => {
            const { result } = setup({
                editingTemplate: mockTemplate,
                isConfidenceScoreReviewEnabled: false,
            });

            act(() => {
                result.current.setPendingNavLocation(fakeLocation);
            });

            jest.clearAllMocks();
            act(() => {
                result.current.handleUnsavedChangesModalOpen(false);
            });

            expect(mockReplace).not.toHaveBeenCalled();
        });

        test('should NOT call history.replace when there is no stashed location', () => {
            const { result } = setup({ editingTemplate: mockTemplate });

            jest.clearAllMocks();
            act(() => {
                result.current.handleUnsavedChangesModalOpen(false);
            });

            expect(mockReplace).not.toHaveBeenCalled();
        });
    });

    describe('unblockRouterHistory', () => {
        test('should invoke the registered unblock function', () => {
            const { result } = setup({ editingTemplate: mockTemplate });

            act(() => {
                result.current.unblockRouterHistory();
            });

            expect(mockUnblock).toHaveBeenCalled();
        });
    });
});
