/**
 * @flow
 * @file Back Button component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import CustomRoute from '../routing/customRoute';
import type { Location } from '../routing/flowTypes';
import IconNavigateLeft from '../../../icons/general/IconNavigateLeft';
import messages from '../messages';
import PlainButton from '../../../components/plain-button';
import './BackButton.scss';

type Props = {|
    className?: string,
    to?: Location,
|};

const BackButton = ({ className, to, ...rest }: Props) => (
    <CustomRoute>
        {({ history }) => (
            <PlainButton
                className={classNames('bdl-BackButton', className)}
                onClick={() => (to ? history.push(to) : history.goBack())}
                type="button"
                {...rest}
            >
                <IconNavigateLeft height={24} width={24} />
                <span className="accessibility-hidden">
                    <FormattedMessage {...messages.back} />
                </span>
            </PlainButton>
        )}
    </CustomRoute>
);

export default BackButton;
