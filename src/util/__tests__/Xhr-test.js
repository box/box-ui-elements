import { xhrSendWithIdleTimeout } from '../Xhr';

const sandbox = sinon.sandbox.create();

describe('util/Xhr', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('xhrSendWithIdleTimeout()', () => {
        let xhr;

        beforeEach(() => {
            xhr = sandbox.useFakeXMLHttpRequest();
        });

        afterEach(() => {
            xhr.restore();
        });

        it('should call send() on underlying XHR', () => {
            const request = new XMLHttpRequest();
            const data = {};
            sandbox.mock(request).expects('send').withArgs(data);
            xhrSendWithIdleTimeout(request, data, 1000);
        });

        it('should call abort() and callback on underlying XHR after timeout', () => {
            const request = new XMLHttpRequest();
            const data = {};
            let calls = 0;

            function callback() {
                calls += 1;
            }

            request.open('GET', 'fake', true);
            xhrSendWithIdleTimeout(request, data, 100, callback);

            setTimeout(() => {
                sandbox.mock(request).expects('abort');
                assert.equal(calls, 1, 'callback not called exactly once');
            }, 2000);
        });

        it('should call abort() if loaded has not changed', () => {
            const request = new XMLHttpRequest();
            const data = {};

            request.open('GET', 'fake', true);
            xhrSendWithIdleTimeout(request, data, 100);

            setTimeout(() => {
                sandbox.mock(request).expects('abort');
                request.upload.eventListeners.progress[0]({ loaded: 0 });
            }, 100);
        });

        it('should not call abort() if there has been progress', () => {
            const request = new XMLHttpRequest();
            const data = {};

            request.open('GET', 'fake', true);
            xhrSendWithIdleTimeout(request, data, 100);
            setTimeout(() => {
                sandbox.mock(request).expects('abort').never();
                request.upload.eventListeners.progress[0]({ loaded: 1 });
            }, 100);
        });
    });
});
