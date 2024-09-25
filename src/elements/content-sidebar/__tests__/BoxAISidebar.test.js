import * as React from 'react';
import { shallow } from 'enzyme';
import { BoxAISidebarComponent } from '../BoxAISidebar';

describe('elements/content-sidebar/BoxAISidebar', () => {
    const getWrapper = (props = {}) =>
        shallow(<BoxAISidebarComponent logger={{ onReadyMetric: jest.fn() }} {...props} />);

    describe('constructor()', () => {
        let onReadyMetric;
        beforeEach(() => {
            const wrapper = getWrapper();
            ({ onReadyMetric } = wrapper.instance().props.logger);
        });

        test('should emit when js loaded', () => {
            expect(onReadyMetric).toHaveBeenCalledWith({
                endMarkName: expect.any(String),
            });
        });
    });

    describe('render()', () => {
        test('should render the boxai sidebar', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });
    });
});
