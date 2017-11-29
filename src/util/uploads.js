/**
 * @flow
 * @file Utility functions for uploads
 * @author Box
 */

/**
 * Returns true if the given object is a Date instance encoding a valid date
 * (i.e. new Date('this is not a timestamp') should return false).
 *
 * Code adapted from
 * http://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
 *
 * @param {Date} date
 * @returns {boolean}
 */
function isValidDateObject(date: Date) {
    return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
}

/**
 * Remove milliseconds from date time string
 * @param {Date} date
 * @returns {string}
 */
function toISOStringNoMS(date: Date) {
    return date.toISOString().replace(/\.[0-9]{3}/, '');
}

/**
 * Returns the file's last modified date as an ISO string with no MS component (e.g.
 * '2017-04-18T17:14:27Z'), or null if no such date can be extracted from the file object.
 * (Nothing on the Internet guarantees that the file object has this info.)
 *
 * @param {File} file
 * @returns {?string}
 */
function getFileLastModifiedAsISONoMSIfPossible(file: File) {
    if (isValidDateObject(file.lastModifiedDate)) {
        return toISOStringNoMS(file.lastModifiedDate);
    }

    if (
        file.lastModified &&
        (typeof file.lastModified === 'string' ||
            typeof file.lastModified === 'number' ||
            file.lastModified instanceof Date)
    ) {
        const lastModifiedDate = new Date(file.lastModified);
        if (isValidDateObject(lastModifiedDate)) {
            return toISOStringNoMS(lastModifiedDate);
        }
    }

    return null;
}

/**
 * If maybeJson is valid JSON string, return the result of calling JSON.parse
 * on it.  Otherwise, return null.
 * @param {string} maybeJson
 * @returns {mixed}
 */
function tryParseJson(maybeJson: string) {
    try {
        return JSON.parse(maybeJson);
    } catch (e) {
        return null;
    }
}

function clearXhrIdleInterval(interval: ?number) {
    if (!interval) {
        return;
    }

    clearInterval(interval);
}

/**
 * Returns a handler for setInterval used in xhrSendWithIdleTimeout()
 * @param {number} lastProgress 
 * @param {number} timeoutMs 
 * @param {XMLHttpRequest} xhr 
 * @param {function} clear 
 * @param {?function} onTimeout
 * @returns {function}
 */
function getXhrIdleIntervalHandler(
    lastProgress: number,
    timeoutMs: number,
    xhr: XMLHttpRequest,
    clear: Function,
    onTimeout?: Function
) {
    return () => {
        if (Date.now() - lastProgress <= timeoutMs) {
            return;
        }

        xhr.abort();
        clear();

        if (onTimeout) {
            onTimeout();
        }
    };
}

/**
 * Executes an upload via XMLHTTPRequest and aborts it if there is no progress event for at least timeoutMs.
 * @param {XMLHttpRequest} xhr
 * @param {object} data Will be passed to xhr.send()
 * @param {number} timeoutMs idle timeout, in milliseconds.
 * @param {function} onTimeout callback invoked when request has timed out
 * @returns {void}
 */
function xhrSendWithIdleTimeout(xhr: XMLHttpRequest, data: Date, timeoutMs: number, onTimeout?: Function) {
    let interval;
    let lastLoaded = 0;
    let lastProgress = Date.now();

    xhr.upload.addEventListener('progress', (event: ProgressEvent) => {
        if (event.loaded > lastLoaded) {
            lastLoaded = event.loaded;
            lastProgress = Date.now();
        }
    });

    function clear() {
        clearXhrIdleInterval(interval);
        interval = null;
    }

    xhr.addEventListener('abort', clear);
    xhr.addEventListener('load', clear);
    xhr.addEventListener('error', clear);

    interval = setInterval(getXhrIdleIntervalHandler(lastProgress, timeoutMs, xhr, clear, onTimeout), 1000);
    xhr.send(data);
}

export { toISOStringNoMS, getFileLastModifiedAsISONoMSIfPossible, tryParseJson, xhrSendWithIdleTimeout };
