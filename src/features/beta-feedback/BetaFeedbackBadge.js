// @flow
import classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { BetaBadge } from '../../components/badge';
import { Link } from '../../components/link';
import Tooltip from '../../components/tooltip/Tooltip';

import messages from './messages';

import './styles/BetaFeedbackBadge.scss';

type Props = {
    className?: string,
    formUrl: string,
    tooltip?: boolean,
};

const BetaFeedbackBadge = ({ className = '', tooltip = false, ...rest }: Props) => {
    const classes = classNames('bdl-HeaderFeedbackBadge', className);
    const { formUrl } = rest;
    const badge = tooltip ? (
        <Tooltip position="middle-right" text={<FormattedMessage {...messages.feedbackCtaText} />}>
            <BetaBadge aria-hidden className="bdl-HeaderFeedbackBadge-betaBadge" />
        </Tooltip>
    ) : (
        <BetaBadge className="bdl-HeaderFeedbackBadge-betaBadge" />
    );

    // TODO: tooltip may require constrainToScrollParent & constrainToWindow in some contexts
    return (
        <span className={classes}>
            <span aria-hidden="true" hidden id="bdl-HeaderFeedbackBadge-ariaLabel">
                <FormattedMessage {...messages.feedbackFormDescription} />
            </span>
            <Link aria-labelledby="bdl-HeaderFeedbackBadge-ariaLabel" href={formUrl} target="_blank">
                {badge}
            </Link>
        </span>
    );
};

export default BetaFeedbackBadge;
