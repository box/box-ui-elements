const locales = require('@box/languages');
const { execSync } = require('child_process');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    const MAX_CONCURRENT_WORKERS = 5;
    const activeWorkers = new Set();

    let hasError = false;

    const workerQueue = [
        ...locales.map(locale => ({ locale, react: true })),
        ...locales.map(locale => ({ locale, react: false })),
    ];

    const handleNextWorker = () => {
        if (activeWorkers.size >= MAX_CONCURRENT_WORKERS || workerQueue.length === 0 || hasError) {
            return;
        }

        const nextWorker = workerQueue.shift();
        const worker = new Worker(__filename, { workerData: nextWorker });
        activeWorkers.add(worker);

        worker.on('message', message => console.log(message));
        worker.on('error', error => {
            console.log('ERROR:', error.message);
            hasError = true;
            activeWorkers.forEach(activeWorker => {
                activeWorker.terminate();
            });
        });
        worker.on('exit', () => {
            activeWorkers.delete(worker);
            handleNextWorker();
        });
    };

    for (let i = 0; i < MAX_CONCURRENT_WORKERS; i += 1) {
        handleNextWorker();
    }
} else {
    const { locale, react } = workerData;
    parentPort.postMessage(`Building ${locale} assets with react=${react}...`);

    try {
        execSync(`time LANGUAGE=${locale} REACT=${react} yarn build:prod:dist`);
    } catch (error) {
        throw new Error(`Failed to build ${locale} assets: ${error.message}`);
    }
}
