/* eslint-disable */
/*
 * Rusha, a JavaScript implementation of the Secure Hash Algorithm, SHA-1,
 * as defined in FIPS PUB 180-1, tuned for high performance with large inputs.
 * (http://github.com/srijs/rusha)
 *
 * Inspired by Paul Johnstons implementation (http://pajhome.org.uk/crypt/md5).
 *
 * Copyright (c) 2013 Sam Rijs (http://awesam.de).
 * Released under the terms of the MIT license as follows:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

// The low-level RushCore module provides the heart of Rusha,
// a high-speed sha1 implementation working on an Int32Array heap.
// At first glance, the implementation seems complicated, however
// with the SHA1 spec at hand, it is obvious this almost a textbook
// implementation that has a few functions hand-inlined and a few loops
// hand-unrolled.
function RushaCore(stdlib, foreign, heap) {
    'use asm';
    var H = new stdlib.Int32Array(heap);
    function hash(k, x) {
        // k in bytes
        k = k | 0;
        x = x | 0;
        var i = 0,
            j = 0,
            y0 = 0,
            z0 = 0,
            y1 = 0,
            z1 = 0,
            y2 = 0,
            z2 = 0,
            y3 = 0,
            z3 = 0,
            y4 = 0,
            z4 = 0,
            t0 = 0,
            t1 = 0;
        y0 = H[(x + 320) >> 2] | 0;
        y1 = H[(x + 324) >> 2] | 0;
        y2 = H[(x + 328) >> 2] | 0;
        y3 = H[(x + 332) >> 2] | 0;
        y4 = H[(x + 336) >> 2] | 0;
        for (i = 0; (i | 0) < (k | 0); i = (i + 64) | 0) {
            z0 = y0;
            z1 = y1;
            z2 = y2;
            z3 = y3;
            z4 = y4;
            for (j = 0; (j | 0) < 64; j = (j + 4) | 0) {
                t1 = H[(i + j) >> 2] | 0;
                t0 =
                    (((((y0 << 5) | (y0 >>> 27)) + ((y1 & y2) | (~y1 & y3))) | 0) +
                        ((((t1 + y4) | 0) + 1518500249) | 0)) |
                    0;
                y4 = y3;
                y3 = y2;
                y2 = (y1 << 30) | (y1 >>> 2);
                y1 = y0;
                y0 = t0;
                H[(k + j) >> 2] = t1;
            }
            for (j = (k + 64) | 0; (j | 0) < ((k + 80) | 0); j = (j + 4) | 0) {
                t1 =
                    ((H[(j - 12) >> 2] ^ H[(j - 32) >> 2] ^ H[(j - 56) >> 2] ^ H[(j - 64) >> 2]) << 1) |
                    ((H[(j - 12) >> 2] ^ H[(j - 32) >> 2] ^ H[(j - 56) >> 2] ^ H[(j - 64) >> 2]) >>> 31);
                t0 =
                    (((((y0 << 5) | (y0 >>> 27)) + ((y1 & y2) | (~y1 & y3))) | 0) +
                        ((((t1 + y4) | 0) + 1518500249) | 0)) |
                    0;
                y4 = y3;
                y3 = y2;
                y2 = (y1 << 30) | (y1 >>> 2);
                y1 = y0;
                y0 = t0;
                H[j >> 2] = t1;
            }
            for (j = (k + 80) | 0; (j | 0) < ((k + 160) | 0); j = (j + 4) | 0) {
                t1 =
                    ((H[(j - 12) >> 2] ^ H[(j - 32) >> 2] ^ H[(j - 56) >> 2] ^ H[(j - 64) >> 2]) << 1) |
                    ((H[(j - 12) >> 2] ^ H[(j - 32) >> 2] ^ H[(j - 56) >> 2] ^ H[(j - 64) >> 2]) >>> 31);
                t0 = (((((y0 << 5) | (y0 >>> 27)) + (y1 ^ y2 ^ y3)) | 0) + ((((t1 + y4) | 0) + 1859775393) | 0)) | 0;
                y4 = y3;
                y3 = y2;
                y2 = (y1 << 30) | (y1 >>> 2);
                y1 = y0;
                y0 = t0;
                H[j >> 2] = t1;
            }
            for (j = (k + 160) | 0; (j | 0) < ((k + 240) | 0); j = (j + 4) | 0) {
                t1 =
                    ((H[(j - 12) >> 2] ^ H[(j - 32) >> 2] ^ H[(j - 56) >> 2] ^ H[(j - 64) >> 2]) << 1) |
                    ((H[(j - 12) >> 2] ^ H[(j - 32) >> 2] ^ H[(j - 56) >> 2] ^ H[(j - 64) >> 2]) >>> 31);
                t0 =
                    (((((y0 << 5) | (y0 >>> 27)) + ((y1 & y2) | (y1 & y3) | (y2 & y3))) | 0) +
                        ((((t1 + y4) | 0) - 1894007588) | 0)) |
                    0;
                y4 = y3;
                y3 = y2;
                y2 = (y1 << 30) | (y1 >>> 2);
                y1 = y0;
                y0 = t0;
                H[j >> 2] = t1;
            }
            for (j = (k + 240) | 0; (j | 0) < ((k + 320) | 0); j = (j + 4) | 0) {
                t1 =
                    ((H[(j - 12) >> 2] ^ H[(j - 32) >> 2] ^ H[(j - 56) >> 2] ^ H[(j - 64) >> 2]) << 1) |
                    ((H[(j - 12) >> 2] ^ H[(j - 32) >> 2] ^ H[(j - 56) >> 2] ^ H[(j - 64) >> 2]) >>> 31);
                t0 = (((((y0 << 5) | (y0 >>> 27)) + (y1 ^ y2 ^ y3)) | 0) + ((((t1 + y4) | 0) - 899497514) | 0)) | 0;
                y4 = y3;
                y3 = y2;
                y2 = (y1 << 30) | (y1 >>> 2);
                y1 = y0;
                y0 = t0;
                H[j >> 2] = t1;
            }
            y0 = (y0 + z0) | 0;
            y1 = (y1 + z1) | 0;
            y2 = (y2 + z2) | 0;
            y3 = (y3 + z3) | 0;
            y4 = (y4 + z4) | 0;
        }
        H[(x + 320) >> 2] = y0;
        H[(x + 324) >> 2] = y1;
        H[(x + 328) >> 2] = y2;
        H[(x + 332) >> 2] = y3;
        H[(x + 336) >> 2] = y4;
    }
    return { hash: hash };
}
// @NOTE: This function shouldn't be processed by UglifyJsPlugin, related to https://github.com/mishoo/UglifyJS2/issues/2011
const RushaString = `function Rusha(e){for(var r=function(e){if("string"==typeof e)return"string";if(e instanceof Array)return"array";if("undefined"!=typeof global&&global.Buffer&&global.Buffer.isBuffer(e))return"buffer";if(e instanceof ArrayBuffer)return"arraybuffer";if(e.buffer instanceof ArrayBuffer)return"view";if(e instanceof Blob)return"blob";throw new Error("Unsupported data type.")},n={fill:0},t=function(e){for(e+=9;e%64>0;e+=1);return e},a=function(e,r,n,t,a){var f,s=this,i=a%4,h=(t+i)%4,u=t-h;switch(i){case 0:e[a]=s[n+3];case 1:e[a+1-(i<<1)|0]=s[n+2];case 2:e[a+2-(i<<1)|0]=s[n+1];case 3:e[a+3-(i<<1)|0]=s[n]}if(!(t<h+i)){for(f=4-i;f<u;f=f+4|0)r[a+f>>2|0]=s[n+f]<<24|s[n+f+1]<<16|s[n+f+2]<<8|s[n+f+3];switch(h){case 3:e[a+u+1|0]=s[n+u+2];case 2:e[a+u+2|0]=s[n+u+1];case 1:e[a+u+3|0]=s[n+u]}}},f=function(e){switch(r(e)){case"string":return function(e,r,n,t,a){var f,s=this,i=a%4,h=(t+i)%4,u=t-h;switch(i){case 0:e[a]=s.charCodeAt(n+3);case 1:e[a+1-(i<<1)|0]=s.charCodeAt(n+2);case 2:e[a+2-(i<<1)|0]=s.charCodeAt(n+1);case 3:e[a+3-(i<<1)|0]=s.charCodeAt(n)}if(!(t<h+i)){for(f=4-i;f<u;f=f+4|0)r[a+f>>2]=s.charCodeAt(n+f)<<24|s.charCodeAt(n+f+1)<<16|s.charCodeAt(n+f+2)<<8|s.charCodeAt(n+f+3);switch(h){case 3:e[a+u+1|0]=s.charCodeAt(n+u+2);case 2:e[a+u+2|0]=s.charCodeAt(n+u+1);case 1:e[a+u+3|0]=s.charCodeAt(n+u)}}}.bind(e);case"array":case"buffer":return a.bind(e);case"arraybuffer":return a.bind(new Uint8Array(e));case"view":return a.bind(new Uint8Array(e.buffer,e.byteOffset,e.byteLength));case"blob":return function(e,r,n,t,a){var f,s=a%4,i=(t+s)%4,h=t-i,u=new Uint8Array(reader.readAsArrayBuffer(this.slice(n,n+t)));switch(s){case 0:e[a]=u[3];case 1:e[a+1-(s<<1)|0]=u[2];case 2:e[a+2-(s<<1)|0]=u[1];case 3:e[a+3-(s<<1)|0]=u[0]}if(!(t<i+s)){for(f=4-s;f<h;f=f+4|0)r[a+f>>2|0]=u[f]<<24|u[f+1]<<16|u[f+2]<<8|u[f+3];switch(i){case 3:e[a+h+1|0]=u[h+2];case 2:e[a+h+2|0]=u[h+1];case 1:e[a+h+3|0]=u[h]}}}.bind(e)}},s=new Array(256),i=0;i<256;i++)s[i]=(i<16?"0":"")+i.toString(16);var h=function(e){for(var r=new Uint8Array(e),n=new Array(e.byteLength),t=0;t<n.length;t++)n[t]=s[r[t]];return n.join("")};!function(e){if(e%64>0)throw new Error("Chunk size must be a multiple of 128 bit");n.offset=0,n.maxChunkLen=e,n.padMaxChunkLen=t(e),n.heap=new ArrayBuffer(function(e){var r;if(e<=65536)return 65536;if(e<16777216)for(r=1;r<e;r<<=1);else for(r=16777216;r<e;r+=16777216);return r}(n.padMaxChunkLen+320+20)),n.h32=new Int32Array(n.heap),n.h8=new Int8Array(n.heap),n.core=new RushaCore({Int32Array:Int32Array,DataView:DataView},{},n.heap),n.buffer=null}(e||65536);var u=function(e,r){n.offset=0;var t=new Int32Array(e,r+320,5);t[0]=1732584193,t[1]=-271733879,t[2]=-1732584194,t[3]=271733878,t[4]=-1009589776},c=function(e,r){var a,f,s,i=t(e),h=new Int32Array(n.heap,0,i>>2);return function(e,r){var n=new Uint8Array(e.buffer),t=r%4,a=r-t;switch(t){case 0:n[a+3]=0;case 1:n[a+2]=0;case 2:n[a+1]=0;case 3:n[a+0]=0}for(var f=1+(r>>2);f<e.length;f++)e[f]=0}(h,e),s=r,(a=h)[(f=e)>>2]|=128<<24-(f%4<<3),a[14+(2+(f>>2)&-16)]=s/(1<<29)|0,a[15+(2+(f>>2)&-16)]=s<<3,i},o=function(e,r,t,a){f(e)(n.h8,n.h32,r,t,a||0)},d=function(e,r,t,a,f){var s=t;o(e,r,t),f&&(s=c(t,a)),n.core.hash(s,n.padMaxChunkLen)},y=function(e,r){var n=new Int32Array(e,r+320,5),t=new Int32Array(5),a=new DataView(t.buffer);return a.setInt32(0,n[0],!1),a.setInt32(4,n[1],!1),a.setInt32(8,n[2],!1),a.setInt32(12,n[3],!1),a.setInt32(16,n[4],!1),t},w=this.rawDigest=function(e){var r=e.byteLength||e.length||e.size||0;u(n.heap,n.padMaxChunkLen);var t=0,a=n.maxChunkLen;for(t=0;r>t+a;t+=a)d(e,t,a,r,!1);return d(e,t,r-t,r,!0),y(n.heap,n.padMaxChunkLen)};this.digest=this.digestFromString=this.digestFromBuffer=this.digestFromArrayBuffer=function(e){return h(w(e).buffer)},this.resetState=function(){return u(n.heap,n.padMaxChunkLen),this},this.append=function(e){var r,t=0,a=e.byteLength||e.length||e.size||0,f=n.offset%n.maxChunkLen;for(n.offset+=a;t<a;)r=Math.min(a-t,n.maxChunkLen-f),o(e,t,r,f),t+=r,(f+=r)===n.maxChunkLen&&(n.core.hash(n.maxChunkLen,n.padMaxChunkLen),f=0);return this},this.getState=function(){var e;if(n.offset%n.maxChunkLen)e=n.heap.slice(0);else{var r=new Int32Array(n.heap,n.padMaxChunkLen+320,5);e=r.buffer.slice(r.byteOffset,r.byteOffset+r.byteLength)}return{offset:n.offset,heap:e}},this.setState=function(e){(n.offset=e.offset,20===e.heap.byteLength)?new Int32Array(n.heap,n.padMaxChunkLen+320,5).set(new Int32Array(e.heap)):n.h32.set(new Int32Array(e.heap));return this};var p=this.rawEnd=function(){var e=n.offset,r=e%n.maxChunkLen,t=c(r,e);n.core.hash(t,n.padMaxChunkLen);var a=y(n.heap,n.padMaxChunkLen);return u(n.heap,n.padMaxChunkLen),a};this.end=function(){return h(p().buffer)}}`;

/**
 * @returns {Worker} Web worker
 */
const createWorker = () => {
    /**
     * The contents of this function are what execute when the worker is loaded.  It
     * defines SHA-1 logic, and registers a handler for receiving messages from the window
     * that created the worker.
     * @returns {void}
     */
    function workerBase() {
        const fileSha1 = new Rusha();
        fileSha1.resetState();
        let expectedOffset = 0;

        // self inside a worker refers to a DedicatedWorkerGlobalScope
        // https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorkerGlobalScope
        self.onmessage = (event) => {
            const { data } = event;
            const { part, fileSize, partContents } = data;

            const startTimestamp = Date.now();

            try {
                // Validate that we are receiving parts in order
                if (part.offset !== expectedOffset) {
                    throw new Error('Out of order parts given to worker');
                }
                fileSha1.append(partContents);

                // We send the partContents back to the main thread because, at least in Chrome v62, we see
                // that this ArrayBuffer is not garbage collected as promptly when left in the web worker
                // context
                self.postMessage(
                    {
                        type: 'partDone',
                        part: data.part,
                        duration: Date.now() - startTimestamp,
                        partContents
                    },
                    [partContents]
                );
                expectedOffset += part.size;
                if (part.offset + part.size === fileSize) {
                    const hash = fileSha1.end();
                    self.postMessage({ type: 'done', sha1: hash });
                }
            } catch (err) {
                const message = {
                    type: 'error',
                    name: err.name,
                    message: err.message,
                    part
                };
                self.postMessage(message);
            }
        };
    }
    /* eslint-enable */

    const workerCodeBlob = new Blob(
        [
            // RushaCore loses its function name when uglified
            `const RushaCore = ${RushaCore.toString()}`,
            ';\n',
            RushaString,
            ';\n',
            'var setupWorker = ',
            workerBase.toString(),
            ';\n',
            'setupWorker();', // This explicit reassigned name is necessary because workerBase
            // gets renamed during JS minification.
        ],
        { type: 'text/javascript' },
    );
    const workerUrl = (window.URL || window.webkitURL).createObjectURL(workerCodeBlob);
    const worker = new Worker(workerUrl);
    worker.oldTerminate = worker.terminate;
    worker.terminate = () => {
        (window.URL || window.webkitURL).revokeObjectURL(workerUrl);
        worker.oldTerminate();
    };

    return worker;
};

export default createWorker;
