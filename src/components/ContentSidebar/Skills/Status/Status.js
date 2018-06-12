/**
 * @flow
 * @file Status Skill Card component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../../../messages';
import {
    SKILLS_INTERNAL_SERVER_ERROR,
    SKILLS_UNKNOWN_ERROR,
    SKILLS_INVALID_FILE_SIZE,
    SKILLS_INVALID_FILE_FORMAT,
    SKILLS_PENDING
} from '../../../../constants';

type Props = {
    card: SkillCard
};

const Status = ({ card }: Props) => {
    const { status = {} }: SkillCard = card;
    const { code, message }: SkillCardLocalizableType = status;
    let localizedMessage = messages.skillUnknownError;

    switch (code) {
        case SKILLS_INVALID_FILE_SIZE:
            localizedMessage = messages.skillInvalidFileSizeError;
            break;
        case SKILLS_INVALID_FILE_FORMAT:
            localizedMessage = messages.skillInvalidFileExtensionError;
            break;
        case SKILLS_INTERNAL_SERVER_ERROR:
        case SKILLS_UNKNOWN_ERROR:
            localizedMessage = messages.skillUnknownError;
            break;
        case SKILLS_PENDING:
            localizedMessage = messages.skillPendingStatus;
            break;
        default:
            if (message) {
                return message;
            }
    }

    return <FormattedMessage {...localizedMessage} />;
};

export default Status;
