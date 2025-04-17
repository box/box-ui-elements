import React from 'react';
import { renderHook } from '../../../../test-utils/testing-library';
import useFeatureEnabled from '../useFeatureEnabled';
import FeatureProvider from '../FeatureProvider';

describe('useFeatureEnabled', () => {
    const mockFeatures = {
        testFeature: true,
        disabledFeature: false,
        something: {
            more: { complex: true },
        },
        'dot.dot.dot': true,
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <FeatureProvider features={mockFeatures}>{children}</FeatureProvider>
    );

    test('should return true for enabled feature', () => {
        const { result } = renderHook(() => useFeatureEnabled('testFeature'), { wrapper });
        expect(result.current).toBe(true);
    });

    test('should return true for object features', () => {
        const { result } = renderHook(() => useFeatureEnabled('something.more.complex'), { wrapper });
        expect(result.current).toBe(true);
    });

    test('should return true for string literal with periods between the words', () => {
        const { result } = renderHook(() => useFeatureEnabled('dot.dot.dot'), { wrapper });
        expect(result.current).toBe(true);
    });

    test('should return false for disabled feature', () => {
        const { result } = renderHook(() => useFeatureEnabled('disabledFeature'), { wrapper });
        expect(result.current).toBe(false);
    });

    test('should return false for non-existent feature', () => {
        const { result } = renderHook(() => useFeatureEnabled('nonExistentFeature'), { wrapper });
        expect(result.current).toBe(false);
    });

    test('should return default value when used outside FeatureProvider', () => {
        const { result } = renderHook(() => useFeatureEnabled('testFeature'));
        expect(result.current).toBe(false);
    });
});
