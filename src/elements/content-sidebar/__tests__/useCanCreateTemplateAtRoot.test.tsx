import { renderHook, waitFor } from '@testing-library/react';
import useCanCreateTemplateAtRoot from '../hooks/useCanCreateTemplateAtRoot';

describe('useCanCreateTemplateAtRoot', () => {
    const file = { id: 'file-123' };
    const enterpriseFqn = 'enterprise_1';

    const renderCreateHook = (getNamespace: jest.Mock, fqn: string | undefined = enterpriseFqn) => {
        const api = { getMetadataAPI: jest.fn().mockReturnValue({ getNamespace }) };
        return renderHook(() => useCanCreateTemplateAtRoot(api as never, file as never, fqn));
    };

    test('should not request a namespace when the enterprise root is unknown', () => {
        const getNamespace = jest.fn();
        const api = { getMetadataAPI: jest.fn().mockReturnValue({ getNamespace }) };
        const { result } = renderHook(() => useCanCreateTemplateAtRoot(api as never, file as never, undefined));

        expect(result.current).toBe(false);
        expect(getNamespace).not.toHaveBeenCalled();
    });

    test('should allow creation when the root namespace grants it', async () => {
        const getNamespace = jest.fn().mockResolvedValue({
            fqn: enterpriseFqn,
            permissions: {
                can_read: true,
                can_update: false,
                can_delete: false,
                can_view_permissions: false,
                can_manage_permissions: false,
                can_create_namespaces: false,
                can_create_templates: true,
            },
        });
        const { result } = renderCreateHook(getNamespace);

        await waitFor(() => expect(result.current).toBe(true));
        expect(getNamespace).toHaveBeenCalledWith(file, enterpriseFqn);
    });

    test('should deny creation when the root namespace does not grant it', async () => {
        const getNamespace = jest.fn().mockResolvedValue({
            fqn: enterpriseFqn,
            permissions: {
                can_read: true,
                can_update: false,
                can_delete: false,
                can_view_permissions: false,
                can_manage_permissions: false,
                can_create_namespaces: false,
                can_create_templates: false,
            },
        });
        const { result } = renderCreateHook(getNamespace);

        await waitFor(() => expect(getNamespace).toHaveBeenCalled());
        expect(result.current).toBe(false);
    });

    test('should deny creation when the namespace request fails', async () => {
        const getNamespace = jest.fn().mockRejectedValue(new Error('unavailable'));
        const { result } = renderCreateHook(getNamespace);

        await waitFor(() => expect(getNamespace).toHaveBeenCalled());
        expect(result.current).toBe(false);
    });
});
