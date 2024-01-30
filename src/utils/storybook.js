// @flow

// eslint-disable-next-line import/prefer-default-export
export const addRootElement = () => {
    let appElement = document.getElementById('rootElement');
    let rootElement = document.getElementById('rootElement');

    if (document.body && rootElement === null) {
        rootElement = document.createElement('div');
        rootElement.setAttribute('id', 'rootElement');
        document.body.appendChild(rootElement);
    }
    if (appElement === null) {
        appElement = document.createElement('div');
        appElement.setAttribute('id', 'appElement');
        rootElement.appendChild(appElement);
    }
    return { appElement, rootElement };
};

export const SLEEP_TIMEOUT = 500;

export const enableSnapshotsParams = {
    chromatic: { disableSnapshot: false },
};

export const disableControlsParams = {
    controls: { exclude: /.*/ },
};

export const defaultVisualConfig = {
    parameters: {
        ...enableSnapshotsParams,
    },
};
