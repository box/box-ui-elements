import * as React from 'react';
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
declare function Nudge({ buttonText, className, content, dataResinTarget, illustration, isShown, header, onButtonClick, onCloseButtonClick, }: NudgeProps): React.JSX.Element;
export default Nudge;
