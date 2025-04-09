/* eslint-disable */
const { Worker } = require('worker_threads');
const locales = require('@box/languages');
const os = require('os');
const path = require('path');

// Configuration
const numCPUs = os.cpus().length; // Number of available CPUs
let counter = 0;
const maxWorkers = Math.min(numCPUs, 3); // Limit concurrent workers

// Create a simple function to spawn a worker
const spawnWorker = (locale, react) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, './build_locale.js'), {
            workerData: { locale, react },
        });

        worker.on('message', message => {
            resolve(message); // Successfully completed work
        });

        worker.on('error', error => {
            reject(error); // Worker failed
        });

        worker.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
};

// Main function to process locales with a controlled number of workers
const processLocales = async () => {
    const tasks = [];

    // Process each combination of locale and React flag
    for (const react of [true, false]) {
        for (const locale of locales) {
            tasks.push({ locale, react });
        }
    }

    // Function to process tasks with worker pool control
    const processWithPool = async () => {
        const promises = [];
        let taskIndex = 0;

        // Process tasks in a controlled manner (based on maxWorkers)
        const workerPool = new Set();

        const processNextTask = () => {
            if (taskIndex >= tasks.length) return; // All tasks done

            // If we have space for more workers
            if (workerPool.size < maxWorkers) {
                const { locale, react } = tasks[taskIndex++];
                const taskPromise = spawnWorker(locale, react)
                    .then(() => {
                        counter++;
                        workerPool.delete(taskPromise); // Worker finished, free up space
                        // Process next task
                        processNextTask();
                    })
                    .catch(err => {
                        console.error('Worker error:', err);
                        workerPool.delete(taskPromise); // Free up space even if there was an error
                        processNextTask();
                    });

                workerPool.add(taskPromise); // Add to pool
                promises.push(taskPromise); // Track promise
                taskPromise.finally(processNextTask);
            }
        };

        // Start processing the tasks
        processNextTask();

        // Wait for all tasks to finish
        await Promise.all(promises);
    };

    try {
        await processWithPool(); // Start processing locales with the controlled worker pool
        console.log('All locales processed successfully!');
    } catch (error) {
        console.error('Error during processing:', error);
        process.exit(1); // Gracefully exit on error
    }
};

// Start the process
processLocales().catch(err => {
    console.error('Error in main process:', err);
    process.exit(1);
});
