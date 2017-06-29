import size from '../size';

describe('size', () => {
    it('should return 0 bytes when undefined', () => {
        expect(size()).to.equal('0 Byte');
    });
    it('should return 0 bytes when 0', () => {
        expect(size(0)).to.equal('0 Byte');
    });
    it('should return 1 Bytes', () => {
        expect(size(1)).to.equal('1 Bytes');
    });
    it('should return 1 KB', () => {
        expect(size(1024)).to.equal('1 KB');
    });
    it('should return 1 MB', () => {
        expect(size(1024 * 1024)).to.equal('1 MB');
    });
    it('should return 1 GB', () => {
        expect(size(1024 * 1024 * 1024)).to.equal('1 GB');
    });
    it('should return 1 TB', () => {
        expect(size(1024 * 1024 * 1024 * 1024)).to.equal('1 TB');
    });
    it('should return 1 PB', () => {
        expect(size(1024 * 1024 * 1024 * 1024 * 1024)).to.equal('1 PB');
    });
});
