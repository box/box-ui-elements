import React from 'react';
import { shallow } from 'enzyme';
import Logger from '../Logger';
import { METRIC_TYPE_PREVIEW, METRIC_TYPE_ELEMENTS_LOAD_METRIC } from '../../../../constants';
import { EVENT_JS_READY } from '../constants';

jest.mock('../../../../utils/performance');

describe('elements/common/logger/Logger', () => {
    const WrappedComponent = () => <div>Test</div>;
    const getWrapper = props =>
        shallow(
            <Logger fileId="123" onMetric={jest.fn()} source="foo" {...props}>
                <WrappedComponent />
            </Logger>,
        );

    describe('createEventName()', () => {
        let instance;
        beforeEach(() => {
            const wrapper = getWrapper();
            instance = wrapper.instance();
        });
        test('should create an event name', () => {
            const name = 'bar';
            const eventName = instance.createEventName(name);
            const { source } = instance.props;
            expect(eventName).toBe(`${source}::${name}`);
        });
    });

    describe('logMetric()', () => {
        let instance;
        let onMetric;
        let source;
        const TIMESTAMP = '123456';
        const SESSION_ID = '987-654-321';
        beforeEach(() => {
            const wrapper = getWrapper();
            instance = wrapper.instance();

            jest.spyOn(instance, 'sessionId', 'get').mockReturnValue(SESSION_ID);
            instance.getTimestamp = jest.fn().mockReturnValue(TIMESTAMP);

            ({ onMetric, source } = instance.props);
        });

        test('should call onMetric with the metric object', () => {
            const data = {
                foo: 'bar',
                bar: 'baz',
            };
            const name = 'foo_event';
            const type = 'foo_type';
            instance.logMetric(type, name, data);

            const metric = {
                ...data,
                component: source,
                name,
                timestamp: TIMESTAMP,
                sessionId: SESSION_ID,
                type,
            };
            expect(onMetric).toHaveBeenCalledWith(metric);
        });
    });

    describe('logUniqueMetric()', () => {
        const BASE_EVENT_NAME = 'foo';
        const EVENT_NAME = 'foo_event';
        const TYPE = 'FOO_TYPE';
        const data = {
            foo: 'bar',
        };
        let instance;

        beforeEach(() => {
            const wrapper = getWrapper();
            instance = wrapper.instance();

            instance.createEventName = jest.fn().mockReturnValue(EVENT_NAME);
            instance.hasLoggedEvent = jest.fn().mockReturnValue(true);
            instance.logMetric = jest.fn();
            jest.spyOn(instance, 'uniqueEvents', 'get').mockReturnValue(new Set());
        });

        test('should log a metric if it hasnt been logged before', () => {
            instance.hasLoggedEvent = jest.fn().mockReturnValue(false);
            instance.logUniqueMetric(TYPE, BASE_EVENT_NAME, data);
            expect(instance.logMetric).toHaveBeenCalledWith(TYPE, BASE_EVENT_NAME, data);
        });

        test('should not log a metric if it has been logged before', () => {
            instance.logUniqueMetric(TYPE, BASE_EVENT_NAME, data);
            expect(instance.logMetric).not.toHaveBeenCalled();
        });
    });

    describe('handlePreviewMetric()', () => {
        let instance;
        let onMetric;
        const data = {
            foo: 'bar',
        };
        beforeEach(() => {
            const wrapper = getWrapper();
            instance = wrapper.instance();
            ({ onMetric } = instance.props);
        });

        test('should call onMetric with the preview metric', () => {
            instance.handlePreviewMetric(data);
            expect(onMetric).toHaveBeenCalledWith({
                ...data,
                type: METRIC_TYPE_PREVIEW,
            });
        });
    });

    describe('handleReadyMetric()', () => {
        let instance;
        const data = {
            foo: 'bar',
        };
        const START = 'foo';
        beforeEach(() => {
            const wrapper = getWrapper({
                startMarkName: START,
            });
            instance = wrapper.instance();
            instance.logUniqueMetric = jest.fn();
        });

        test('should log a unique metric', () => {
            instance.handleReadyMetric(data);
            expect(instance.logUniqueMetric).toHaveBeenCalledWith(METRIC_TYPE_ELEMENTS_LOAD_METRIC, EVENT_JS_READY, {
                ...data,
                startMarkName: START,
            });
        });
    });

    describe('render()', () => {
        let wrapper;
        beforeEach(() => {
            wrapper = getWrapper();
        });

        test('should decorate with logger prop', () => {
            expect(wrapper).toMatchSnapshot();
        });
    });
});
