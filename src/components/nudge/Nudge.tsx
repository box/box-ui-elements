import * as React from 'react';
import classNames from 'classnames';

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
    /** DOM element for the illustration image */
    illustration: React.ReactNode;
    /** DOM element for the header of the nudge */
    header: React.ReactNode;
    /** onClick callback for the nudge button */
    onButtonClick?: () => void;
}

function Nudge({ buttonText, className, content, illustration, header, onButtonClick }: NudgeProps) {
    const [isClosed, setIsClosed] = React.useState<boolean>(false);
    const classes = classNames(['Nudge', className], { 'Nudge--isClosed': isClosed });

    const closeButton = (
        // eslint-disable-next-line react/button-has-type
        <button
            aria-label="close-nudge"
            className="Nudge-closeButton"
            onClick={() => {
                setIsClosed(true);
            }}
        >
            <X16 height={18} width={18} />
        </button>
    );

    return (
        <div className={classes}>
            {closeButton}
            <div className="Nudge-illustration">{illustration}</div>
            <div className="Nudge-header">{header}</div>
            <div className="Nudge-content">{content}</div>
            <div className="Nudge-button">
                <PrimaryButton onClick={onButtonClick}>{buttonText}</PrimaryButton>
            </div>
        </div>
    );
}

export default Nudge;
