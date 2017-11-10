/* eslint-disable no-underscore-dangle */
import RushaLib from 'rusha';

const workerCodeBlob = new Blob(
    [
        // Generate web worker code for Rusha - this is essentially the same web worker implementation that exists
        // in rusha.js, but isnt exported when we import Rusha as a npm module. We then minify through Google's
        // Closure Compiler
        /* eslint-disable */
        `
        var Rusha = ${RushaLib.toString()};
        Rusha._core = ${RushaLib._core.toString()};
        var reader=new FileReaderSync,hashData=function(a,b,c){try{return c(null,a.digest(b))}catch(d){return c(d)}},hashFile=function(a,b,c,d,e){var f=new self.FileReader;f.onloadend=function(){var g=f.result;b+=f.result.byteLength;try{a.append(g)}catch(h){e(h);return}b<d.size?hashFile(a,b,c,d,e):e(null,a.end())};f.readAsArrayBuffer(d.slice(b,b+c))};
        self.onmessage=function(a){var b=a.data.data,c=a.data.file,d=a.data.id;if("undefined"!==typeof d&&(c||b)){a=a.data.blockSize||4194304;var e=new Rusha(a);e.resetState();var f=function(a,b){a?self.postMessage({id:d,error:a.name}):self.postMessage({id:d,hash:b})};b&&hashData(e,b,f);c&&hashFile(e,0,a,c,f)}};
        `
        /* eslint-enable */
    ],
    { type: 'text/javascript' }
);

/**
 * @returns {Worker} Web worker
 */
function createWorker() {
    const workerUrl = URL.createObjectURL(workerCodeBlob);
    const worker = new Worker(workerUrl);
    worker.oldTerminate = worker.terminate;
    worker.terminate = () => {
        URL.revokeObjectURL(workerUrl);
        worker.oldTerminate();
    };
    return worker;
}

export default createWorker;
