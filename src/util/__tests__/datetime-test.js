/* eslint-disable no-unused-expressions */
import { isToday, isYesterday, formatTime } from '../datetime';

describe('util/datetime', () => {
    describe('isToday()', () => {
        it('should return true for today', () => {
            expect(isToday(new Date())).to.be.true;
            expect(isYesterday(new Date())).to.be.false;
        });
    });

    describe('isYesterday()', () => {
        it('should return true for yesterday', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            expect(isToday(yesterday)).to.be.false;
            expect(isYesterday(yesterday)).to.be.true;
        });
    });

    describe('formatTime()', () => {
        it('should correctly format 3 hours', () => {
            const result = formatTime(10800);
            expect(result).to.equal('3:00:00');
        });

        it('should correctly format the time', () => {
            const result = formatTime(11211);
            expect(result).to.equal('3:06:51');
        });

        it('should correctly format when double-digit minutes', () => {
            const result = formatTime(705);
            expect(result).to.equal('11:45');
        });

        it('should correctly format when single-digit minutes', () => {
            const result = formatTime(105);
            expect(result).to.equal('1:45');
        });

        it('should correctly format when 0 minutes', () => {
            const result = formatTime(9);
            expect(result).to.equal('0:09');
        });

        it('should correctly format 0 seconds', () => {
            const result = formatTime(0);
            expect(result).to.equal('0:00');
        });
    });
});
