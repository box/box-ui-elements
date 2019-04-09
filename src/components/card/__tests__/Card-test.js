// @flow
import * as React from 'react';

import Card from '../Card';

const getWrapper = (props = {}) =>
    shallow(
        <Card className="my-class" title={<div>Hello World!</div>} {...props}>
            Hello, world!
        </Card>,
    );

describe('components/card/Card', () => {
    test('should render correctly', () => {
        expect(getWrapper()).toMatchSnapshot();
    });

    test('should render correctly without a title', () => {
        expect(
            getWrapper({
                title: undefined,
            }),
        ).toMatchSnapshot();
    });
});
