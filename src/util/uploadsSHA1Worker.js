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

function Rusha(chunkSize) {
    var util = {
        getDataType: function(data) {
            if (typeof data === 'string') {
                return 'string';
            }
            if (data instanceof Array) {
                return 'array';
            }
            if (typeof global !== 'undefined' && global.Buffer && global.Buffer.isBuffer(data)) {
                return 'buffer';
            }
            if (data instanceof ArrayBuffer) {
                return 'arraybuffer';
            }
            if (data.buffer instanceof ArrayBuffer) {
                return 'view';
            }
            if (data instanceof Blob) {
                return 'blob';
            }
            throw new Error('Unsupported data type.');
        }
    };
    ('use strict');
    var // Private object structure.
    self$2 = { fill: 0 };
    var // Calculate the length of buffer that the sha1 routine uses
    // including the padding.
    padlen = function(len) {
        for (len += 9; len % 64 > 0; len += 1);
        return len;
    };
    var padZeroes = function(bin, len) {
        var h8 = new Uint8Array(bin.buffer);
        var om = len % 4,
            align = len - om;
        switch (om) {
            case 0:
                h8[align + 3] = 0;
            case 1:
                h8[align + 2] = 0;
            case 2:
                h8[align + 1] = 0;
            case 3:
                h8[align + 0] = 0;
        }
        for (var i$2 = (len >> 2) + 1; i$2 < bin.length; i$2++) bin[i$2] = 0;
    };
    var padData = function(bin, chunkLen, msgLen) {
        bin[chunkLen >> 2] |= 128 << (24 - ((chunkLen % 4) << 3));
        // To support msgLen >= 2 GiB, use a float division when computing the
        // high 32-bits of the big-endian message length in bits.
        bin[(((chunkLen >> 2) + 2) & ~15) + 14] = (msgLen / (1 << 29)) | 0;
        bin[(((chunkLen >> 2) + 2) & ~15) + 15] = msgLen << 3;
    };
    var // Convert a binary string and write it to the heap.
    // A binary string is expected to only contain char codes < 256.
    convStr = function(H8, H32, start, len, off) {
        var str = this,
            i$2,
            om = off % 4,
            lm = (len + om) % 4,
            j = len - lm;
        switch (om) {
            case 0:
                H8[off] = str.charCodeAt(start + 3);
            case 1:
                H8[(off + 1 - (om << 1)) | 0] = str.charCodeAt(start + 2);
            case 2:
                H8[(off + 2 - (om << 1)) | 0] = str.charCodeAt(start + 1);
            case 3:
                H8[(off + 3 - (om << 1)) | 0] = str.charCodeAt(start);
        }
        if (len < lm + om) {
            return;
        }
        for (i$2 = 4 - om; i$2 < j; i$2 = (i$2 + 4) | 0) {
            H32[(off + i$2) >> 2] =
                (str.charCodeAt(start + i$2) << 24) |
                (str.charCodeAt(start + i$2 + 1) << 16) |
                (str.charCodeAt(start + i$2 + 2) << 8) |
                str.charCodeAt(start + i$2 + 3);
        }
        switch (lm) {
            case 3:
                H8[(off + j + 1) | 0] = str.charCodeAt(start + j + 2);
            case 2:
                H8[(off + j + 2) | 0] = str.charCodeAt(start + j + 1);
            case 1:
                H8[(off + j + 3) | 0] = str.charCodeAt(start + j);
        }
    };
    var // Convert a buffer or array and write it to the heap.
    // The buffer or array is expected to only contain elements < 256.
    convBuf = function(H8, H32, start, len, off) {
        var buf = this,
            i$2,
            om = off % 4,
            lm = (len + om) % 4,
            j = len - lm;
        switch (om) {
            case 0:
                H8[off] = buf[start + 3];
            case 1:
                H8[(off + 1 - (om << 1)) | 0] = buf[start + 2];
            case 2:
                H8[(off + 2 - (om << 1)) | 0] = buf[start + 1];
            case 3:
                H8[(off + 3 - (om << 1)) | 0] = buf[start];
        }
        if (len < lm + om) {
            return;
        }
        for (i$2 = 4 - om; i$2 < j; i$2 = (i$2 + 4) | 0) {
            H32[((off + i$2) >> 2) | 0] =
                (buf[start + i$2] << 24) |
                (buf[start + i$2 + 1] << 16) |
                (buf[start + i$2 + 2] << 8) |
                buf[start + i$2 + 3];
        }
        switch (lm) {
            case 3:
                H8[(off + j + 1) | 0] = buf[start + j + 2];
            case 2:
                H8[(off + j + 2) | 0] = buf[start + j + 1];
            case 1:
                H8[(off + j + 3) | 0] = buf[start + j];
        }
    };
    var convBlob = function(H8, H32, start, len, off) {
        var blob = this,
            i$2,
            om = off % 4,
            lm = (len + om) % 4,
            j = len - lm;
        var buf = new Uint8Array(reader.readAsArrayBuffer(blob.slice(start, start + len)));
        switch (om) {
            case 0:
                H8[off] = buf[3];
            case 1:
                H8[(off + 1 - (om << 1)) | 0] = buf[2];
            case 2:
                H8[(off + 2 - (om << 1)) | 0] = buf[1];
            case 3:
                H8[(off + 3 - (om << 1)) | 0] = buf[0];
        }
        if (len < lm + om) {
            return;
        }
        for (i$2 = 4 - om; i$2 < j; i$2 = (i$2 + 4) | 0) {
            H32[((off + i$2) >> 2) | 0] = (buf[i$2] << 24) | (buf[i$2 + 1] << 16) | (buf[i$2 + 2] << 8) | buf[i$2 + 3];
        }
        switch (lm) {
            case 3:
                H8[(off + j + 1) | 0] = buf[j + 2];
            case 2:
                H8[(off + j + 2) | 0] = buf[j + 1];
            case 1:
                H8[(off + j + 3) | 0] = buf[j];
        }
    };
    var convFn = function(data) {
        switch (util.getDataType(data)) {
            case 'string':
                return convStr.bind(data);
            case 'array':
                return convBuf.bind(data);
            case 'buffer':
                return convBuf.bind(data);
            case 'arraybuffer':
                return convBuf.bind(new Uint8Array(data));
            case 'view':
                return convBuf.bind(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
            case 'blob':
                return convBlob.bind(data);
        }
    };
    var slice = function(data, offset) {
        switch (util.getDataType(data)) {
            case 'string':
                return data.slice(offset);
            case 'array':
                return data.slice(offset);
            case 'buffer':
                return data.slice(offset);
            case 'arraybuffer':
                return data.slice(offset);
            case 'view':
                return data.buffer.slice(offset);
        }
    };
    var // Precompute 00 - ff strings
    precomputedHex = new Array(256);
    for (var i = 0; i < 256; i++) {
        precomputedHex[i] = (i < 16 ? '0' : '') + i.toString(16);
    }
    var // Convert an ArrayBuffer into its hexadecimal string representation.
    hex = function(arrayBuffer) {
        var binarray = new Uint8Array(arrayBuffer);
        var res = new Array(arrayBuffer.byteLength);
        for (var i$2 = 0; i$2 < res.length; i$2++) {
            res[i$2] = precomputedHex[binarray[i$2]];
        }
        return res.join('');
    };
    var ceilHeapSize = function(v) {
        // The asm.js spec says:
        // The heap object's byteLength must be either
        // 2^n for n in [12, 24) or 2^24 * n for n ≥ 1.
        // Also, byteLengths smaller than 2^16 are deprecated.
        var p;
        if (
            // If v is smaller than 2^16, the smallest possible solution
            // is 2^16.
            v <= 65536
        )
            return 65536;
        if (
            // If v < 2^24, we round up to 2^n,
            // otherwise we round up to 2^24 * n.
            v < 16777216
        ) {
            for (p = 1; p < v; p = p << 1);
        } else {
            for (p = 16777216; p < v; p += 16777216);
        }
        return p;
    };
    var // Initialize the internal data structures to a new capacity.
    init = function(size) {
        if (size % 64 > 0) {
            throw new Error('Chunk size must be a multiple of 128 bit');
        }
        self$2.offset = 0;
        self$2.maxChunkLen = size;
        self$2.padMaxChunkLen = padlen(size);
        // The size of the heap is the sum of:
        // 1. The padded input message size
        // 2. The extended space the algorithm needs (320 byte)
        // 3. The 160 bit state the algoritm uses
        self$2.heap = new ArrayBuffer(ceilHeapSize(self$2.padMaxChunkLen + 320 + 20));
        self$2.h32 = new Int32Array(self$2.heap);
        self$2.h8 = new Int8Array(self$2.heap);
        self$2.core = new RushaCore(
            {
                Int32Array: Int32Array,
                DataView: DataView
            },
            {},
            self$2.heap
        );
        self$2.buffer = null;
    };
    // Iinitializethe datastructures according
    // to a chunk siyze.
    init(chunkSize || 64 * 1024);
    var initState = function(heap, padMsgLen) {
        self$2.offset = 0;
        var io = new Int32Array(heap, padMsgLen + 320, 5);
        io[0] = 1732584193;
        io[1] = -271733879;
        io[2] = -1732584194;
        io[3] = 271733878;
        io[4] = -1009589776;
    };
    var padChunk = function(chunkLen, msgLen) {
        var padChunkLen = padlen(chunkLen);
        var view = new Int32Array(self$2.heap, 0, padChunkLen >> 2);
        padZeroes(view, chunkLen);
        padData(view, chunkLen, msgLen);
        return padChunkLen;
    };
    var // Write data to the heap.
    write = function(data, chunkOffset, chunkLen, off) {
        convFn(data)(self$2.h8, self$2.h32, chunkOffset, chunkLen, off || 0);
    };
    var // Initialize and call the RushaCore,
    // assuming an input buffer of length len * 4.
    coreCall = function(data, chunkOffset, chunkLen, msgLen, finalize) {
        var padChunkLen = chunkLen;
        write(data, chunkOffset, chunkLen);
        if (finalize) {
            padChunkLen = padChunk(chunkLen, msgLen);
        }
        self$2.core.hash(padChunkLen, self$2.padMaxChunkLen);
    };
    var getRawDigest = function(heap, padMaxChunkLen) {
        var io = new Int32Array(heap, padMaxChunkLen + 320, 5);
        var out = new Int32Array(5);
        var arr = new DataView(out.buffer);
        arr.setInt32(0, io[0], false);
        arr.setInt32(4, io[1], false);
        arr.setInt32(8, io[2], false);
        arr.setInt32(12, io[3], false);
        arr.setInt32(16, io[4], false);
        return out;
    };
    var // Calculate the hash digest as an array of 5 32bit integers.
    rawDigest = (this.rawDigest = function(str) {
        var msgLen = str.byteLength || str.length || str.size || 0;
        initState(self$2.heap, self$2.padMaxChunkLen);
        var chunkOffset = 0,
            chunkLen = self$2.maxChunkLen;
        for (chunkOffset = 0; msgLen > chunkOffset + chunkLen; chunkOffset += chunkLen) {
            coreCall(str, chunkOffset, chunkLen, msgLen, false);
        }
        coreCall(str, chunkOffset, msgLen - chunkOffset, msgLen, true);
        return getRawDigest(self$2.heap, self$2.padMaxChunkLen);
    });
    // The digest and digestFrom* interface returns the hash digest
    // as a hex string.
    this.digest = this.digestFromString = this.digestFromBuffer = this.digestFromArrayBuffer = function(str) {
        return hex(rawDigest(str).buffer);
    };
    this.resetState = function() {
        initState(self$2.heap, self$2.padMaxChunkLen);
        return this;
    };
    this.append = function(chunk) {
        var chunkOffset = 0;
        var chunkLen = chunk.byteLength || chunk.length || chunk.size || 0;
        var turnOffset = self$2.offset % self$2.maxChunkLen;
        var inputLen;
        self$2.offset += chunkLen;
        while (chunkOffset < chunkLen) {
            inputLen = Math.min(chunkLen - chunkOffset, self$2.maxChunkLen - turnOffset);
            write(chunk, chunkOffset, inputLen, turnOffset);
            turnOffset += inputLen;
            chunkOffset += inputLen;
            if (turnOffset === self$2.maxChunkLen) {
                self$2.core.hash(self$2.maxChunkLen, self$2.padMaxChunkLen);
                turnOffset = 0;
            }
        }
        return this;
    };
    this.getState = function() {
        var turnOffset = self$2.offset % self$2.maxChunkLen;
        var heap;
        if (!turnOffset) {
            var io = new Int32Array(self$2.heap, self$2.padMaxChunkLen + 320, 5);
            heap = io.buffer.slice(io.byteOffset, io.byteOffset + io.byteLength);
        } else {
            heap = self$2.heap.slice(0);
        }
        return {
            offset: self$2.offset,
            heap: heap
        };
    };
    this.setState = function(state) {
        self$2.offset = state.offset;
        if (state.heap.byteLength === 20) {
            var io = new Int32Array(self$2.heap, self$2.padMaxChunkLen + 320, 5);
            io.set(new Int32Array(state.heap));
        } else {
            self$2.h32.set(new Int32Array(state.heap));
        }
        return this;
    };
    var rawEnd = (this.rawEnd = function() {
        var msgLen = self$2.offset;
        var chunkLen = msgLen % self$2.maxChunkLen;
        var padChunkLen = padChunk(chunkLen, msgLen);
        self$2.core.hash(padChunkLen, self$2.padMaxChunkLen);
        var result = getRawDigest(self$2.heap, self$2.padMaxChunkLen);
        initState(self$2.heap, self$2.padMaxChunkLen);
        return result;
    });
    this.end = function() {
        return hex(rawEnd().buffer);
    };
}
/* eslint-enable */

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
            const data = event.data;
            const part = data.part;
            const fileSize = data.fileSize;
            const partContents = data.partContents;

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

    const workerCodeBlob = new Blob(
        [
            RushaCore.toString(),
            ';\n',
            Rusha.toString(),
            ';\n',
            'var setupWorker = ',
            workerBase.toString(),
            ';\n',
            'setupWorker();' // This explicit reassigned name is necessary because workerBase
            // gets renamed during JS minification.
        ],
        { type: 'text/javascript' }
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
