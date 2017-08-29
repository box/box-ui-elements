/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */

import { withData } from 'leche';
import browser, { isMobile, isIE, canPlayDash, getUserAgent } from '../browser';

const sandbox = sinon.sandbox.create();

describe('util/browser', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
        browser.__ResetDependency__('getUserAgent');
    });
    describe('isMobile()', () => {
        it('should return false if not mobile', () => {
            browser.__Rewire__('getUserAgent', sandbox.mock().returns('foobar'));
            expect(isMobile()).to.be.false;
        });
        withData(
            {
                ipad: 'ipad',
                iphone: 'iphone',
                ipod: 'ipod',
                android: 'android',
                blackberry: 'blackberry',
                bb10: 'bb10',
                mini: 'mini',
                'window ce': 'windows ce',
                palm: 'palm'
            },
            (device) => {
                it(`should return true for ${device}`, () => {
                    browser.__Rewire__('getUserAgent', sandbox.mock().returns(device));
                    expect(isMobile()).to.be.true;
                });
            }
        );
    });
    describe('isIE()', () => {
        it('should return true if IE', () => {
            browser.__Rewire__('getUserAgent', sandbox.mock().returns('Trident'));
            expect(isIE()).to.be.true;
        });
        it('should return false if not IE', () => {
            browser.__Rewire__('getUserAgent', sandbox.mock().returns('foobar'));
            expect(isIE()).to.be.false;
        });
    });
    describe('getUserAgent()', () => {
        it('should return the user agent', () => {
            expect(getUserAgent().includes('Mozilla')).to.be.true;
        });
    });
    describe('canPlayDash()', () => {
        it('should return false when there is no media source', () => {
            expect(canPlayDash()).to.be.false;
        });
        it('should return false when isTypeSupported is not a function', () => {
            global.MediaSource = { isTypeSupported: 'string' };
            expect(canPlayDash(true)).to.be.false;
        });
        it('should return true when h264 is supported', () => {
            global.MediaSource = {
                isTypeSupported: sandbox.mock().withArgs('video/mp4; codecs="avc1.64001E"').returns(true)
            };
            expect(canPlayDash(true)).to.be.true;
        });
    });
});
