/* eslint-disable no-underscore-dangle */
import RushaLib from 'rusha';

const workerCodeBlob = new Blob(
    [
        `
        var util = {
            getDataType: function() {
                return 'blob';
            }
        };

        ${RushaLib.toString()}

        Rusha._core = ${RushaLib._core.toString()};

        var reader = new FileReaderSync();
        self.onmessage = function onMessage(event) {
            var data = event.data.data, id = event.data.id;
            if (typeof id === 'undefined')
                return;
            if (!data)
                return;
            var blockSize = event.data.blockSize || 4 * 1024 * 1024;
            var hasher = new Rusha(blockSize);
            hasher.resetState();
            var done = function done$2(err, hash) {
                if (!err) {
                    self.postMessage({
                        id: id,
                        hash: hash
                    });
                } else {
                    self.postMessage({
                        id: id,
                        error: err.name
                    });
                }
            };
            try {
                return done(null, hasher.digest(data));
            } catch (e) {
                return done(e);
            }
        };
        `
    ],
    { type: 'text/javascript' }
);

/**
 * @returns {Worker} Web worker
 */
function createWorker() {
    const workerUrl = (window.URL || window.webkitURL).createObjectURL(workerCodeBlob);
    const worker = new Worker(workerUrl);
    worker.oldTerminate = worker.terminate;
    worker.terminate = () => {
        (window.URL || window.webkitURL).revokeObjectURL(workerUrl);
        worker.oldTerminate();
    };
    return worker;
}

export default createWorker;
