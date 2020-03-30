import * as React from 'react';
import classNames from 'classnames';

import Button from '../button';
import PrimaryButton from '../primary-button';
import X16 from '../../icon/fill/X16';

import './Nudge.scss';

export interface NudgeProps {
    /** button text used for the primary call to action */
    buttonText: React.ReactNode;
    /** classname to add to the container element. */
    className?: string;
    /** DOM element for the content of the nudge. */
    content: React.ReactNode;
    /** String for the Resin target value */
    dataResinTarget?: string;
    /** DOM element for the illustration image */
    illustration: React.ReactNode;
    /** Boolean value from the parent to determine if the nudge is shown */
    isShown: boolean;
    /** DOM element for the header of the nudge */
    header: React.ReactNode;
    /** onClick callback for the nudge button */
    onButtonClick: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
    /** onClick callback for the nudge closure button */
    onCloseButtonClick: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

function Nudge({
    buttonText,
    className,
    content,
    dataResinTarget = 'nudgeButton',
    illustration,
    isShown,
    header,
    onButtonClick,
    onCloseButtonClick,
}: NudgeProps) {
    const classes = classNames(['bdl-Nudge', className], { 'bdl-is-closed': !isShown });

    const closeButton = (
        <Button aria-label="close-nudge" className="bdl-Nudge-closeButton" onClick={onCloseButtonClick}>
            <X16 height={18} width={18} />
        </Button>
    );

    return (
        <article className={classes} data-resin-component="nudge">
            {closeButton}
            <div className="bdl-Nudge-illustration">{illustration}</div>
            <h2 className="bdl-Nudge-header">{header}</h2>
            <p className="bdl-Nudge-content">{content}</p>
            <div className="bdl-Nudge-button">
                <PrimaryButton data-resin-target={dataResinTarget} onClick={onButtonClick}>
                    {buttonText}
                </PrimaryButton>
            </div>
        </article>
    );
}

export default Nudge;
