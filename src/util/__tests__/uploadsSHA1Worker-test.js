/* eslint-disable no-unused-expressions */
import createWorker from '../uploadsSHA1Worker';

let worker;
const sandbox = sinon.sandbox.create();

describe('util/uploadsSHA1Worker', () => {
    beforeEach(() => {
        worker = createWorker();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();

        if (worker) {
            worker.terminate();
        }
    });

    it('should return an instance of the Rusha worker', () => {
        expect(worker.postMessage).to.be.a.function;
        expect(worker.onmessage).to.be.a.function;
        expect(worker.terminate).to.be.a.function;
    });

    it('should revoke worker blob URL when terminate is called', () => {
        sandbox.mock(URL).expects('revokeObjectURL').withArgs(sinon.match.string);
        worker.terminate();
        worker = undefined;
    });

    it('should return SHA1 hash of passed in blob', (done) => {
        worker.postMessage({
            id: '123',
            data: new Blob(['testblob'])
        });

        worker.onmessage = ({ data }) => {
            if (data.id === '123') {
                expect(data.hash).to.equal('a30f6cbd53b737e9ca9d53ec430e20a5befb037b');
                done();
            }
        };
    });
});
