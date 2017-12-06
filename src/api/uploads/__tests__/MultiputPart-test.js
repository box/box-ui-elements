/* eslint-disable no-unused-expressions, no-underscore-dangle */
import MultiputPart, { PART_STATE_UPLOADED } from '../MultiputPart';

const sandbox = sinon.sandbox.create();

describe('api/MultiputPart', () => {
    const options = {};
    const index = 0;
    const offset = 0;
    const size = 1;
    const sessionId = 1;
    const sessionEndpoints = {};
    const config = {};
    const getPartsState = sandbox.stub();
    const getNumPartsUploading = sandbox.stub();
    let MultiputPartTest;
    beforeEach(() => {
        MultiputPartTest = new MultiputPart(
            options,
            index,
            offset,
            size,
            sessionId,
            sessionEndpoints,
            config,
            getPartsState,
            getNumPartsUploading
        );
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('upload()', () => {
        it('should noop if sha256 is not available', () => {
            MultiputPartTest.destroyed = false;
            MultiputPartTest.blob = {};

            MultiputPartTest.xhr.uploadFile = sandbox.mock().never();

            MultiputPartTest.upload();
        });

        it('should noop if blob is not available', () => {
            MultiputPartTest.destroyed = false;
            MultiputPartTest.sha256 = '123';

            MultiputPartTest.xhr.uploadFile = sandbox.mock().never();

            MultiputPartTest.upload();
        });

        it('should upload file properly', () => {
            MultiputPartTest.destroyed = false;
            MultiputPartTest.sha256 = '123';
            MultiputPartTest.blob = {};
            MultiputPartTest.xhr.uploadFile = sandbox.mock();

            MultiputPartTest.upload();
        });
    });

    describe('uploadSuccessHandler()', () => {
        it('should noop if destroyed', () => {
            MultiputPartTest.destroyed = true;

            MultiputPartTest.onSuccess = sandbox.mock().never();

            MultiputPartTest.uploadSuccessHandler();
        });

        it('should call onSuccess and update attributes properly', () => {
            const data = { hi: 1 };
            MultiputPartTest.destroyed = false;
            MultiputPartTest.onSuccess = sandbox.mock();
            MultiputPartTest.uploadSuccessHandler(data);

            assert.equal(MultiputPartTest.data, data);
            assert.isNull(MultiputPartTest.blob);
            assert.equal(MultiputPartTest.state, PART_STATE_UPLOADED);
        });
    });
});
