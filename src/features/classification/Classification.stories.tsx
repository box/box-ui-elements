import * as React from 'react';

import Classification, { STYLE_INLINE } from './Classification';
import { SECURITY_CONTROLS_FORMAT } from './constants';

const definition =
    '[Prohibits external access] Internal data is not accessible by external users and can only be accessed by Box employees and contractors. Examples: New hire documents, policies, procedures, announcements, and Boxer training.';

const controls = {
    boxSignRequest: { enabled: true },
    download: { desktop: { restrictManagedUsers: 'ownersCoOwners' } },
    sharedLink: { accessLevel: 'collabOnly' },
};

const baseProps = {
    definition,
    messageStyle: STYLE_INLINE,
    name: 'BOX-ONLY',
    modifiedAt: '2025-01-15T10:30:00Z',
    modifiedBy: 'Robert Robertson',
};

export const Legacy = () => <Classification {...baseProps} />;

export const Redesigned = () => <Classification {...baseProps} isRedesignEnabled />;

export const RedesignedWithControls = () => (
    <Classification
        {...baseProps}
        controls={controls}
        controlsFormat={SECURITY_CONTROLS_FORMAT.SHORT_WITH_BTN}
        isRedesignEnabled
        itemName="welcome.pdf"
    />
);

export const LegacyWithControls = () => (
    <Classification
        {...baseProps}
        controls={controls}
        controlsFormat={SECURITY_CONTROLS_FORMAT.SHORT_WITH_BTN}
        itemName="welcome.pdf"
    />
);

export default {
    title: 'Features/Classification',
    component: Classification,
    decorators: [(story: () => React.ReactNode) => <div style={{ width: 260 }}>{story()}</div>],
};
