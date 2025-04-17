import React from 'react';
import { renderHook } from '../../../../test-utils/testing-library';
import useFeatureConfig from '../useFeatureConfig';
import FeatureProvider from '../FeatureProvider';

describe('useFeatureConfig', () => {
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
        const { result } = renderHook(() => useFeatureConfig('testFeature'), { wrapper });
        expect(result.current).toBe(true);
    });

    test('should return true for object features', () => {
        const { result } = renderHook(() => useFeatureConfig('something.more'), { wrapper });
        expect(result.current).toEqual({ complex: true });
    });

    test('should return true for string literal with periods between the words', () => {
        const { result } = renderHook(() => useFeatureConfig('dot.dot.dot'), { wrapper });
        expect(result.current).toBe(true);
    });

    test('should return false for disabled feature', () => {
        const { result } = renderHook(() => useFeatureConfig('disabledFeature'), { wrapper });
        expect(result.current).toBe(false);
    });

    test('should return false for non-existent feature', () => {
        const { result } = renderHook(() => useFeatureConfig('nonExistentFeature'), { wrapper });
        expect(result.current).toEqual({});
    });

    test('should return default value when used outside FeatureProvider', () => {
        const { result } = renderHook(() => useFeatureConfig('testFeature'));
        expect(result.current).toEqual({});
    });
});
