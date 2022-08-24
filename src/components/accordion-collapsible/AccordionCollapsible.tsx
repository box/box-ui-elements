import * as React from 'react';
import classNames from 'classnames';
import AnimateHeight from 'react-animate-height';

import { bdlGray50 } from '../../styles/variables';
import IconChevron, { DirectionType } from '../../icons/general/IconChevron';
import PlainButton from '../plain-button';
import { ButtonType } from '../button';

import './AccordionCollapsible.scss';

type AccordionCollapsibleProps = {
    /** animationDuration - duration of animation in milliseconds */
    animationDuration?: number;
    /** containerProps - other props (e.g. resin target names) to be included in wrapper div */
    containerProps?: Record<string, React.ReactNode>;
    /** buttonProps - other props (e.g. resin target names) to be included in the button */
    buttonProps?: Record<string, React.ReactNode>;
    /** children - content to be displayed in the card when it is expanded */
    children: Array<React.ReactChild> | React.ReactChild;
    /** className - CSS class for the wrapper div */
    className?: string;
    /** isOpen - initial state of the collapsible card */
    isOpen: boolean;
    /** onClose - callback called when collapsible is opened */
    onClose?: Function;
    /** onOpen - callback called when collapsible is collapsed */
    onOpen?: Function;
    /** title - string or component in the title of the collapsible card */
    title: string | React.ReactElement;
};

type AccordionCollapsibleState = {
    /** isOpen - initial state of the collapsible card */
    isOpen: boolean;
};

const AccordionCollapsible = ({
    animationDuration = 100,
    containerProps,
    buttonProps,
    children,
    className,
    isOpen,
    onClose,
    onOpen,
    title,
}: AccordionCollapsibleProps) => {
    const [state, setState] = React.useState<AccordionCollapsibleState>({ isOpen });

    const toggleVisibility = () => {
        if (state.isOpen && onClose) {
            onClose();
        } else if (!state.isOpen && onOpen) {
            onOpen();
        }
        setState({ isOpen: !state.isOpen });
    };

    return (
        <div
            {...containerProps}
            className={classNames('accordion-collapsible-container', className, {
                'is-open': state.isOpen,
            })}
        >
            <div className="accordion-collapsible-header">
                <PlainButton
                    {...buttonProps}
                    aria-expanded={state.isOpen}
                    className="accordion-collapsible-header-btn"
                    onClick={toggleVisibility}
                    type={ButtonType.BUTTON}
                >
                    <div className="accordion-collapsible-title">{title}</div>
                    <IconChevron
                        className="accordion-collapsible-icon"
                        color={bdlGray50}
                        direction={state.isOpen ? DirectionType.DOWN : DirectionType.RIGHT}
                    />
                </PlainButton>
            </div>
            <AnimateHeight duration={animationDuration} height={state.isOpen ? 'auto' : 0}>
                <div className="accordion-collapsible-dropdown-container">{children}</div>
            </AnimateHeight>
        </div>
    );
};

export { AccordionCollapsibleProps };
export default AccordionCollapsible;
