import React from 'react';
import { FormattedMessage } from 'react-intl';

import BoxAi from '../../icon/line/BoxAi';
import Media from '../../components/media';
import TriangleAlert16 from '../../icon/line/TriangleAlert16';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { ElementsXhrError } from '../../common/types/api';

import messages from './messages';

import './InlineError.scss';

type Props = {
    error: ElementsXhrError;
};

const InlineError = ({ error }: Props) => {
    return (
        <Media className="bdl-InlineError" data-testid="InlineError">
            <Media.Figure>
                <div className="bdl-InlineError-icon">
                    <BoxAi height={16} width={16} />
                </div>
            </Media.Figure>
            <Media.Body>
                <div className="bdl-InlineError-AlertIcon">
                    <TriangleAlert16 height={20} width={20} />
                </div>
                <div className="bdl-InlineError-text">
                    {error && <FormattedMessage {...messages.inlineErrorText} />}
                </div>
            </Media.Body>
        </Media>
    );
};

export default InlineError;
