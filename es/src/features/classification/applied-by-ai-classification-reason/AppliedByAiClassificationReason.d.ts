import React from 'react';
import type { AiClassificationReason } from '../types';
import './AppliedByAiClassificationReason.scss';
export type AppliedByAiClassificationReasonProps = AiClassificationReason & {
    className?: string;
};
declare const AppliedByAiClassificationReason: ({ answer, citations, className, modifiedAt, }: AppliedByAiClassificationReasonProps) => React.JSX.Element;
export default AppliedByAiClassificationReason;
