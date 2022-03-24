import * as React from 'react';

import AvatarPlusBadge16 from './AvatarPlusBadge16';
import { bdlYellow } from '../../styles/variables';

export const avatarPlusBadge16 = () => <AvatarPlusBadge16 />;

export const avatarPlusBadge16CustomColor = () => <AvatarPlusBadge16 color={bdlYellow} />;

export default {
    title: 'Icon|Line|AvatarPlusBadge16',
    component: AvatarPlusBadge16,
    parameters: {
        notes: "`import AvatarPlusBadge16 from 'box-ui-elements/es/icon/line/AvatarPlusBadge16';`",
    },
};
