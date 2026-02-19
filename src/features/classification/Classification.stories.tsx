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
    color: '#ffeb7f',
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

const aiClassificationReason = {
    answer: 'This document contains internal policies, onboarding procedures, and employee training materials that are restricted to Box employees and contractors only.',
    modifiedAt: '2025-01-15T10:30:00Z',
    citations: [
        { content: 'New hire onboarding policy v3', fileId: '123', location: 'Page 1', title: 'Onboarding Policy.pdf' },
        { content: 'Internal training schedule 2025', fileId: '456', location: 'Page 2', title: 'Training Guide.docx' },
    ],
};

export const RedesignedWithAiClassification = () => (
    <Classification
        {...baseProps}
        aiClassificationReason={aiClassificationReason}
        isRedesignEnabled
        shouldUseAppliedByLabels
    />
);

export const RedesignedFull = () => (
    <Classification
        {...baseProps}
        aiClassificationReason={aiClassificationReason}
        controls={controls}
        controlsFormat={SECURITY_CONTROLS_FORMAT.SHORT_WITH_BTN}
        isRedesignEnabled
        itemName="welcome.pdf"
        shouldUseAppliedByLabels
    />
);

export const LegacyWithAiClassification = () => (
    <Classification {...baseProps} aiClassificationReason={aiClassificationReason} shouldUseAppliedByLabels />
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
