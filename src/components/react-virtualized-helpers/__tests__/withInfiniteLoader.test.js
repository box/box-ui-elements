import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import withInfiniteLoader from '../withInfiniteLoader';

const sandbox = sinon.sandbox.create();

describe('components/react-virtualized-helpers/withInfiniteLoader', () => {
    const isRowLoadedStub = sandbox.stub();
    const loadMoreRowsStub = sandbox.stub();
    const MIN_BATCH_SIZE = 20;
    const ROW_COUNT = 50;
    const THRESHOLD = 20;

    // eslint-disable-next-line react/prefer-stateless-function
    class ComponentMock extends React.Component {
        render() {
            return <div />;
        }
    }
    const InfiniteLoaderComponent = withInfiniteLoader(ComponentMock);

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should correctly render infinite loader', () => {
        const wrapper = shallow(
            <InfiniteLoaderComponent
                infiniteLoaderProps={{
                    isRowLoaded: isRowLoadedStub,
                    loadMoreRows: loadMoreRowsStub,
                    minimumBatchSize: MIN_BATCH_SIZE,
                    rowCount: ROW_COUNT,
                    threshold: THRESHOLD,
                }}
            />,
        );

        expect(wrapper.is('InfiniteLoader')).toBe(true);
        expect(wrapper.prop('isRowLoaded')).toEqual(isRowLoadedStub);
        expect(wrapper.prop('loadMoreRows')).toEqual(loadMoreRowsStub);
        expect(wrapper.prop('minimumBatchSize')).toEqual(MIN_BATCH_SIZE);
        expect(wrapper.prop('rowCount')).toEqual(ROW_COUNT);
        expect(wrapper.prop('threshold')).toEqual(THRESHOLD);
    });

    test('should correctly render children', () => {
        const wrapper = mount(
            <InfiniteLoaderComponent
                data-foo="bar"
                infiniteLoaderProps={{
                    isRowLoaded: isRowLoadedStub,
                    loadMoreRows: loadMoreRowsStub,
                    minimumBatchSize: MIN_BATCH_SIZE,
                    rowCount: ROW_COUNT,
                    threshold: THRESHOLD,
                }}
            />,
        );
        const component = wrapper.find(ComponentMock);

        expect(component.length).toBe(1);
        expect(component.prop('data-foo')).toEqual('bar');
    });
});
