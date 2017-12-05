/**
 * @flow
 * @file Multiput upload part
 * @author Box
 */
import Base from '../Base';

const PART_STATE_NOT_STARTED: 0 = 0;
const PART_STATE_COMPUTING_DIGEST: 1 = 1;
const PART_STATE_DIGEST_READY: 2 = 2;
const PART_STATE_UPLOADING: 3 = 3;
const PART_STATE_UPLOADED: 4 = 4;

class MultiputPart extends Base {
    index: number;
    numDigestRetriesPerformed: number;
    numUploadRetriesPerformed: number;
    offset: number;
    sha256: ?string;
    size: number;
    state:
        | typeof PART_STATE_NOT_STARTED
        | typeof PART_STATE_COMPUTING_DIGEST
        | typeof PART_STATE_DIGEST_READY
        | typeof PART_STATE_UPLOADING
        | typeof PART_STATE_UPLOADED;
    timing: Object;
    uploadedBytes: number;

    /**
     * [constructor]
     *
     * @param {Object} options
     * @param {number} index - 0-based index of this part in array of all parts
     * @param {number} offset - Starting byte offset of this part's range
     * @param {number} size - Size of this part in bytes
     * @return {void}
     */
    constructor(options: Object, index: number, offset: number, size: number): void {
        super(options);

        this.index = index;
        this.numDigestRetriesPerformed = 0;
        this.numUploadRetriesPerformed = 0;
        this.offset = offset;
        this.sha256 = null;
        this.size = size;
        this.state = PART_STATE_NOT_STARTED;
        this.timing = {};
        this.uploadedBytes = 0;
    }

    /**
     * Upload the part
     * TODO: implement this
     * 
     * @public
     * @return {void}
     */
    upload = (): void => {};
}

export default MultiputPart;
export {
    PART_STATE_NOT_STARTED,
    PART_STATE_COMPUTING_DIGEST,
    PART_STATE_DIGEST_READY,
    PART_STATE_UPLOADING,
    PART_STATE_UPLOADED
};
