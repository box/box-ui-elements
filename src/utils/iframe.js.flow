/**
 * @flow
 * @file Function to create iframe and downloading
 * @author Box
 */

/**
 * Creates an empty iframe or uses an existing one
 * for the purposes of downloading or printing
 *
 * @private
 * @return {HTMLIFrameElement} Iframe
 */
function createDownloadIframe(): HTMLIFrameElement {
    let iframe: HTMLIFrameElement = ((document.querySelector('#boxdownloadiframe'): any): HTMLIFrameElement);
    if (!iframe) {
        // if no existing iframe create a new one
        iframe = document.createElement('iframe');
        iframe.setAttribute('id', 'boxdownloadiframe');
        iframe.style.display = 'none';
        if (document.body) {
            document.body.appendChild(iframe);
        }
    }

    // If the iframe previously failed to load contentDocument will be null
    if (iframe.contentDocument) {
        // Clean the iframe up
        iframe.contentDocument.write('<head></head><body></body>');
    }
    return iframe;
}

/**
 * Opens url in an iframe
 * Used for downloads
 *
 * @param {string} url - URL to open
 * @return {HTMLIFrameElement}
 */
export default function openUrlInsideIframe(url: string): HTMLIFrameElement {
    const iframe: HTMLIFrameElement = createDownloadIframe();
    iframe.src = url;
    return iframe;
}
