// @flow
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '../../../../test-utils/testing-library';
import withRouterIfEnabled from '../withRouterIfEnabled';

const TestComponent = (props: any) => {
    const { history, location, match, routerDisabled } = props;
    return (
        <div
            data-testid="test-component"
            data-router-disabled={routerDisabled ? 'true' : undefined}
            data-has-history={history ? 'true' : undefined}
            data-has-location={location ? 'true' : undefined}
            data-has-match={match ? 'true' : undefined}
        />
    );
};
TestComponent.displayName = 'TestComponent';

const WithRouterIfEnabled = withRouterIfEnabled(TestComponent);

test('injects router props when wrapped in a Router', () => {
    const { getByTestId } = render(
        <MemoryRouter initialEntries={[{ pathname: '/foo' }]}> 
            <WithRouterIfEnabled />
        </MemoryRouter>,
    );

    const el = getByTestId('test-component');
    expect(el).toHaveAttribute('data-has-history', 'true');
    expect(el).toHaveAttribute('data-has-location', 'true');
    expect(el).toHaveAttribute('data-has-match', 'true');
    expect(el).not.toHaveAttribute('data-router-disabled');
});

test('renders without Router and without router props (routerDisabled prop)', () => {
    const { getByTestId } = render(<WithRouterIfEnabled routerDisabled />);
    const el = getByTestId('test-component');
    expect(el).not.toHaveAttribute('data-has-history');
    expect(el).not.toHaveAttribute('data-has-location');
    expect(el).not.toHaveAttribute('data-has-match');
    expect(el).toHaveAttribute('data-router-disabled', 'true');
});

test('renders without Router and without router props (feature flag)', () => {
    const features = { routerDisabled: { value: true } };
    const { getByTestId } = render(<WithRouterIfEnabled features={features} />);

    const el = getByTestId('test-component');
    expect(el).not.toHaveAttribute('data-has-history');
    expect(el).not.toHaveAttribute('data-has-location');
    expect(el).not.toHaveAttribute('data-has-match');
});

