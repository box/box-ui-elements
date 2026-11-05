import noop from 'lodash/noop';
import Base from './Base';
import type { ElementsErrorCallback } from '../common/types/api';

class Groups extends Base {
    /** API URL for the memberships of the Box group `id`. */
    getUrlForGroupCount(id: string): string {
        return `${this.getBaseApiUrl()}/groups/${id}/memberships`;
    }

    /**
     * Fetches the membership count of `group`, using `file` for request authorization.
     * Resolves with the payload, including `total_count`; rejects without a value on error.
     */
    getGroupCount({
        errorCallback = noop,
        successCallback = noop,
        group,
        file,
    }: {
        errorCallback?: ElementsErrorCallback;
        file: { id: string };
        group: { id: string };
        successCallback?: Function;
    }): Promise<{ total_count: number }> {
        return new Promise((resolve, reject) =>
            this.get({
                id: file.id,
                url: this.getUrlForGroupCount(group.id),
                successCallback: (...args: [{ total_count: number }]) => {
                    successCallback(...args);
                    resolve(...args);
                },
                errorCallback: (...args: Parameters<ElementsErrorCallback>) => {
                    errorCallback(...args);
                    reject();
                },
                requestData: { params: { limit: 1 } },
            }),
        );
    }
}

export default Groups;
