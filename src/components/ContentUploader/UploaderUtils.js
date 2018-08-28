class UploaderUtils {
    static isMultiputSupported() {
        return window.location.protocol === 'https:' && window.crypto && window.crypto.subtle;
    }
}

export default UploaderUtils;
