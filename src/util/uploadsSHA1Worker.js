import RushaLib from './rusha';

/**
 * @returns {Worker} Web worker
 */
function createWorker() {
    const workerCodeBlob = new Blob([RushaLib], { type: 'application/javascript' });
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
