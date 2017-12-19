import Xhr from '../Xhr';

describe('util/Xhr', () => {
    describe('xhrSendWithIdleTimeout()', () => {
        let xhrInstance;
        // let clock;

        beforeEach(() => {
            // clock = jest.useFakeTimers();
            xhrInstance = new Xhr({
                token: '123'
            });
        });

        afterEach(() => {
            jest.clearAllTimers();
        });

        test('should call send() on underlying XHR', () => {
            const request = new XMLHttpRequest();
            const data = {};

            request.send = jest.fn();
            xhrInstance.xhr = request;
            xhrInstance.xhrSendWithIdleTimeout(data, 1000);
            expect(request.send).toHaveBeenCalledWith(data);
        });

        // test('should call abort() and callback on underlying XHR after timeout', () => {
        //     const request = new XMLHttpRequest();
        //     const data = {};
        //     const callback = jest.fn();

        //     xhrInstance.abort = jest.fn();
        //     request.send = jest.fn();
        //     xhrInstance.xhr = request;
        //     xhrInstance.xhrSendWithIdleTimeout(data, 100, callback);

        //     clock.runTimersToTime(2000);
        //     expect(xhrInstance.abort).toHaveBeenCalled();
        //     expect(callback).toBeHaveBeenCalled();
        // });

        // test('should call abort() if loaded has not changed', () => {
        //     const request = new XMLHttpRequest();
        //     const data = {};

        //     request.open('GET', 'fake', true);
        //     xhrInstance.xhr = request;
        //     xhrInstance.xhrSendWithIdleTimeout(request, data, 100);

        //     setTimeout(() => {
        //         sandbox.mock(request).expects('abort');
        //         request.upload.eventListeners.progress[0]({ loaded: 0 });
        //     }, 100);

        //     clock.runTimersToTime(100);
        //     expect(request.abort).toHaveBeenCalled();
        //     expect(calls).toBe(1);
        // });

        // test('should not call abort() if there has been progress', () => {
        //     const request = new XMLHttpRequest();
        //     const data = {};

        //     request.open('GET', 'fake', true);
        //     xhrInstance.xhr = request;
        //     xhrInstance.xhrSendWithIdleTimeout(request, data, 100);

        //     setTimeout(() => {
        //         sandbox.mock(request).expects('abort').never();
        //         request.upload.eventListeners.progress[0]({ loaded: 1 });
        //     }, 100);

        //     clock.runTimersToTime(100);
        //     expect(request.abort).toHaveBeenCalled();
        //     expect(calls).toBe(1);
        // });
    });
});
