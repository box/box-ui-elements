/**
 * @flow
 * @file Back Button component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import IconNavigateLeft from '../../../icons/general/IconNavigateLeft';
import messages from '../messages';
import PlainButton from '../../../components/plain-button';
import './BackButton.scss';

type Props = {
    className?: string,
    onClick: () => void,
};

const BackButton = ({ className, onClick, ...rest }: Props) => (
    <PlainButton className={classNames('bdl-BackButton', className)} onClick={onClick} type="button" {...rest}>
        <IconNavigateLeft height={24} width={24} />
        <span className="accessibility-hidden">
            <FormattedMessage {...messages.back} />
        </span>
    </PlainButton>
);

export default BackButton;
