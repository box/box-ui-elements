import * as React from 'react';
import { useIntl } from 'react-intl';

import { InlineNotice } from '@box/blueprint-web';

import messages from '../messages';

export interface ContentExplorerInfoNoticeProps {
    infoNoticeText: string;
}

const ContentExplorerInfoNotice = ({ infoNoticeText }: ContentExplorerInfoNoticeProps) => {
    const { formatMessage } = useIntl();
    return (
        <InlineNotice variant="info" variantIconAriaLabel={formatMessage(messages.infoNoticeIconAriaLabel)}>
            {infoNoticeText}
        </InlineNotice>
    );
};

export default ContentExplorerInfoNotice;
