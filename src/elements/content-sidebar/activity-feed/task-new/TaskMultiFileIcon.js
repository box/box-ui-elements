// @flow
import * as React from 'react';
// $FlowFixMe LabelPill is in typescript
import LabelPill from '../../../../components/label-pill';
import MoveCopy16 from '../../../../icon/line/MoveCopy16';

type Props = {|
    isMultiFile: boolean,
|};

const TaskMultiFileIcon = ({ isMultiFile }: Props): React.Node => {
    return (
        isMultiFile && (
            <LabelPill.Pill data-testid="multifile-badge">
                <LabelPill.Icon Component={MoveCopy16} />
            </LabelPill.Pill>
        )
    );
};

export default TaskMultiFileIcon;
