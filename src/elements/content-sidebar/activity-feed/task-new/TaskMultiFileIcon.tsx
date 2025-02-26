import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import LabelPill from '../../../../components/label-pill';
import Tooltip, { TooltipPosition } from '../../../../components/tooltip';
import MoveCopy16 from '../../../../icon/line/MoveCopy16';

interface TaskMultiFileIconProps {
    isMultiFile: boolean;
}

const TaskMultiFileIcon = ({ isMultiFile }: TaskMultiFileIconProps): JSX.Element | null => {
    return (
        isMultiFile && (
            <Tooltip
                position={TooltipPosition.TOP_RIGHT}
                text={<FormattedMessage {...messages.taskMultipleFilesAffordanceTooltip} />}
            >
                <LabelPill.Pill data-testid="multifile-badge">
                    <LabelPill.Icon Component={MoveCopy16} />
                </LabelPill.Pill>
            </Tooltip>
        )
    );
};

export default TaskMultiFileIcon;
