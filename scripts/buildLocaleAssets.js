#!/usr/bin/env node

/* eslint-disable no-console */
const locales = require('@box/languages');
const { execSync } = require('child_process');
const { Worker, isMainThread, parentPort, threadId, workerData } = require('worker_threads');

if (isMainThread) {
    const totalBundleCount = locales.length * 2; // with and without React
    const maxActiveWorkers = 5;
    const activeWorkers = new Set();

    let bundleCount = 0;

    const workerQueue = [
        ...locales.map(locale => ({ locale, react: true })),
        ...locales.map(locale => ({ locale, react: false })),
    ];

    const handleNextWorker = () => {
        if (activeWorkers.size >= maxActiveWorkers) {
            return;
        }

        if (workerQueue.length === 0) {
            if (bundleCount === totalBundleCount) {
                console.log(`Finished building ${totalBundleCount} locale bundles`);
            }
            return;
        }

        const nextWorker = workerQueue.shift();
        const worker = new Worker(__filename, { workerData: nextWorker });
        activeWorkers.add(worker);

        worker.on('message', message => console.log(message));
        worker.on('error', error => {
            console.error('ERROR:', error.message);
            execSync(`ps ax | grep "build:prod:dist" | grep -v grep | awk '{print $1}' | xargs kill`); // terminate all processes
            process.exit(1);
        });
        worker.on('exit', () => {
            activeWorkers.delete(worker);
            bundleCount += 1;
            handleNextWorker();
        });
    };

    console.log(`Starting to build ${totalBundleCount} locale bundles. This will take several minutes.`);

    for (let i = 0; i < maxActiveWorkers; i += 1) {
        handleNextWorker();
    }
} else {
    const { locale, react } = workerData;
    parentPort.postMessage(`[${threadId}] Building ${locale} assets with react=${react}...`);

    if (locale !== 'en-US') {
        return;
    }
    try {
        execSync(`time LANGUAGE=${locale} REACT=${react} yarn build:prod:dist`);
    } catch (error) {
        throw new Error(`Failed to build ${locale} assets: ${error.message}`);
    }
}
