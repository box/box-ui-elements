import React from 'react';
import { shallow } from 'enzyme';
import { normalizeItemResponse, normalizeUserResponse } from './utils';
import UnifiedShareModalElement from '../UnifiedShareModalElement';

describe('elements/unified-share-modal-element/UnifiedShareModalElement', () => {
    const getWrapper = (props = {}) => shallow(<UnifiedShareModalElement {...props} />);

    beforeEach(() => {
        React.useEffect = jest.spyOn('useEffect').mockImplementation(f => f());
    });

    describe('resetState()', () => {
        test('should call setItem');
    });
});
