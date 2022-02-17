export function getClientDimensions() {
    return { viewWidth: document.documentElement.clientWidth, viewHeight: document.documentElement.clientHeight };
}

export default { getClientDimensions };
