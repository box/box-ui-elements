import hexToBase64 from '../base64';

describe('util/base64', () => {
    it('should convert hex to Base64 correctly', () => {
        const str = '12AB34';
        const expectedB64 = 'Eqs0';
        expect(hexToBase64(str)).to.equal(expectedB64);
    });
});
