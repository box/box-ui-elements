import Base from './Base';
import { ERROR_CODE_FETCH_ACCESS_STATS } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';

class FileAccessStats extends Base {
    /** API URL for access stats of the Box file `id`. Throws when `id` is missing. */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }

        return `${this.getBaseApiUrl()}/file_access_stats/${id}`;
    }

    /** Fetches access stats for the Box file `id`. */
    getFileAccessStats(id: string, successCallback: Function, errorCallback: ElementsErrorCallback): void {
        this.errorCode = ERROR_CODE_FETCH_ACCESS_STATS;
        this.get({
            id,
            successCallback,
            errorCallback,
        });
    }
}

export default FileAccessStats;
