import int32ArrayToBase64 from '../base64';

describe('util/base64', () => {
    it('should convert a Int32Array to Base64 correctly', () => {
        const arr = new Int32Array([13, 37]);
        const expectedB64 = 'DQAAACUAAAA=';
        expect(int32ArrayToBase64(arr)).to.equal(expectedB64);
    });
});
