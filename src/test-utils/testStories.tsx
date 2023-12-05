export const enableSnapshotsParams = {
    chromatic: { disableSnapshot: false },
};

export const disableControlsParams = {
    controls: { exclude: /.*/ },
};

export const defaultInteractionTestsConfig = {
    parameters: {
        ...disableControlsParams,
    },
};

export const defaultVrtConfig = {
    parameters: {
        ...disableControlsParams,
        ...enableSnapshotsParams,
    },
};
