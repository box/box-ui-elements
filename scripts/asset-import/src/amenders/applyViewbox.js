// this amender will apply any viewbox values to the asset (if available)
// TODO: we should check for this value on import, as this likely means it wasn't a proper icon import
module.exports = function applyViewbox(file, options) {
    if (options.viewBox) {
        return file
            .replace('width="1em"', `width={${options.viewBox.width}}`)
            .replace('height="1em"', `height={${options.viewBox.height}}`);
    }
    return file;
};
