// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Text } from '@box/blueprint-web';
import classNames from 'classnames';

import { bdlBoxBlue } from '../../../styles/variables';
import Tooltip from '../../../components/tooltip';
import IconInfo from '../../../icons/general/IconInfo';
import type { MessageItem } from '../flowTypes';

import './SecurityControlsItem.scss';

type Props = {
    ...MessageItem,
    isRedesignEnabled?: boolean,
};

const ICON_SIZE = 13;

const SecurityControlsItem = ({ isRedesignEnabled = false, message, tooltipMessage }: Props) => {
    const messageContent = React.isValidElement(message) ? message : <FormattedMessage {...message} />;

    return (
        <li className={classNames({ 'bdl-SecurityControlsItem': !isRedesignEnabled })}>
            {isRedesignEnabled ? (
                <Text as="p" variant="bodyDefault">
                    {messageContent}
                </Text>
            ) : (
                <>
                    {/* $FlowFixMe */}
                    {messageContent}
                    {tooltipMessage && (
                        <Tooltip
                            className="bdl-SecurityControlsItem-tooltip"
                            text={<FormattedMessage {...tooltipMessage} />}
                            position="middle-right"
                            isTabbable={false}
                        >
                            <span className="bdl-SecurityControlsItem-tooltipIcon">
                                <IconInfo color={bdlBoxBlue} width={ICON_SIZE} height={ICON_SIZE} />
                            </span>
                        </Tooltip>
                    )}
                </>
            )}
        </li>
    );
};

export default SecurityControlsItem;
