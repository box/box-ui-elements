// Load Rusha with raw loader because importing as module removes worker-specific code
import Rusha from '../third-party/uploader/rusha.min';

/**
 * Creates Rusha SHA1 hashing worker for uploads.
 *
 * @returns {Worker} Web worker
 */
export default function createWorker() {
    const workerCodeBlob = new Blob([Rusha], {
        type: 'text/javascript'
    });
    const workerUrl = URL.createObjectURL(workerCodeBlob);
    const worker = new Worker(workerUrl);

    worker.oldTerminate = worker.terminate;
    worker.terminate = () => {
        URL.revokeObjectURL(workerUrl);
        worker.oldTerminate();
    };
    return worker;
}
