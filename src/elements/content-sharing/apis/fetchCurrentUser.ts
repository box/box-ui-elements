import type { User } from '@box/unified-share-modal';

import { FIELD_ENTERPRISE, FIELD_HOSTNAME } from '../../../constants';

import type { BaseFetchProps } from '../types';

export const fetchCurrentUser = async ({ api, itemID }: BaseFetchProps): Promise<User | null> => {
    return new Promise((resolve, reject) => {
        api.getUsersAPI(false).getUser(itemID, resolve, reject, {
            params: {
                fields: [FIELD_ENTERPRISE, FIELD_HOSTNAME].toString(),
            },
        });
    });
};
