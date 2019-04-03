// @flow
import classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { BetaBadge } from '../../components/badge';
import { Link } from '../../components/link';
import Tooltip from '../../components/tooltip/Tooltip';

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
        <Tooltip
            text={
                <FormattedMessage
                    id="be.feedbackCtaText"
                    defaultMessage="Click to provide feedback"
                    description="Call-to-action text describing what to do to navigate to specified feedback form"
                />
            }
            position="middle-right"
        >
            <BetaBadge aria-hidden className="bdl-HeaderFeedbackBadge-betaBadge" />
        </Tooltip>
    ) : (
        <BetaBadge className="bdl-HeaderFeedbackBadge-betaBadge" />
    );

    // TODO: tooltip may require constrainToScrollParent & constrainToWindow in some contexts
    return (
        <span className={classes}>
            <span id="bdl-HeaderFeedbackBadge-ariaLabel" aria-hidden="true" hidden>
                <FormattedMessage
                    id="be.feedbackFormDescription"
                    defaultMessage="Beta Feedback Form"
                    description="Accessible text used to describe the form used for feedback"
                />
            </span>
            <Link href={formUrl} target="_blank" aria-labelledBy="bdl-HeaderFeedbackBadge-ariaLabel">
                {badge}
            </Link>
        </span>
    );
};

export default BetaFeedbackBadge;
