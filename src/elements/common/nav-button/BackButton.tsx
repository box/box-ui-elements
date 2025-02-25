import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Route } from 'react-router-dom';
import type { Location } from 'history';
import IconNavigateLeft from '../../../icons/general/IconNavigateLeft';
import messages from '../messages';
import PlainButton from '../../../components/plain-button';
import { ButtonType } from '../../../components/button';
import './BackButton.scss';

export interface BackButtonProps {
    className?: string;
    to?: Location;
}

const BackButton = ({ className, to, ...rest }: BackButtonProps) => (
    <Route>
        {({ history }) => (
            <PlainButton
                className={classNames('bdl-BackButton', className)}
                onClick={() => (to ? history.push(to) : history.goBack())}
                type={ButtonType.BUTTON}
                {...rest}
            >
                <IconNavigateLeft height={24} width={24} />
                <span className="accessibility-hidden">
                    <FormattedMessage {...messages.back} />
                </span>
            </PlainButton>
        )}
    </Route>
);

export default BackButton;
