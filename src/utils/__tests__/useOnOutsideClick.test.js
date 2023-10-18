// @flow
import React from 'react';
import { render } from '@testing-library/react';
import useOnOutsideClick from '../useOnOutsideClick';

function TestComponent({ callback }: { callback: Function }) {
    const ref = useOnOutsideClick(callback);

    return (
        <div>
            <div ref={ref}>
                <div data-testid="inside-element">Inside Element</div>
            </div>
            <div data-testid="outside-element">Outside Element</div>
        </div>
    );
}

const clickEvent = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
});

describe('useOnOutsideClick', () => {
    it('should not call the callback when an element within the ref is clicked', () => {
        const callback = jest.fn();
        const { getByTestId } = render(<TestComponent callback={callback} />);
        const insideElement = getByTestId('inside-element');
        insideElement.dispatchEvent(clickEvent);

        expect(callback).not.toHaveBeenCalled();
    });

    it('should call the callback when an element outside the ref is not clicked', () => {
        const callback = jest.fn();
        const { getByTestId } = render(<TestComponent callback={callback} />);
        const outsideElement = getByTestId('outside-element');
        outsideElement.dispatchEvent(clickEvent);

        expect(callback).toHaveBeenCalled();
    });
});
