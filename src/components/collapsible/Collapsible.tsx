import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import AnimateHeight from 'react-animate-height';

// @ts-ignore flow import
import { RESIN_TAG_TARGET } from '../../common/variables';
import IconCaretDown from '../../icons/general/IconCaretDown';
import PlainButton from '../plain-button';
import { ButtonType } from '../button';
import { bdlGray50 } from '../../styles/variables';

import './Collapsible.scss';

export interface CollapsibleProps {
    /** animationDuration - duration of animation in milliseconds */
    animationDuration?: number;
    /** buttonProps - other props (e.g. resin target names) to be included in the button */
    buttonProps?: Record<string, React.ReactNode>;
    /** children - content to be displayed in the card when it is expanded */
    children: React.ReactNode;
    /** className - CSS class for the wrapper div */
    className?: string;
    /** hasStickyHeader - determines look of component */
    hasStickyHeader?: boolean;
    /** headerActionItems - determines stickiness of the header */
    headerActionItems?: React.ReactNode;
    /** headerButton - button in the title of the collapsible card */
    headerButton?: React.ReactElement;
    /** isBordered - determines optional header action items */
    isBordered?: boolean;
    /** isOpen - initial state of the collapsible card */
    isOpen: boolean;
    /** onClose - callback called when collapsible is opened */
    onClose?: Function;
    /** onOpen - callback called when collapsible is collapsed */
    onOpen?: Function;
    /** title - string or component in the title of the collapsible card */
    title: string | React.ReactElement;
}

interface CollapsibleState {
    /** isOpen - initial state of the collapsible card */
    isOpen: boolean;
}

class Collapsible extends React.PureComponent<CollapsibleProps, CollapsibleState> {
    static defaultProps = {
        buttonProps: {},
        className: '',
        isOpen: true,
        animationDuration: 100,
    };

    constructor(props: CollapsibleProps) {
        super(props);
        this.state = {
            isOpen: props.isOpen,
        };
    }

    toggleVisibility = () => {
        const { onOpen, onClose } = this.props;
        this.setState(
            prevState => ({
                isOpen: !prevState.isOpen,
            }),
            () => {
                const { isOpen } = this.state;
                if (isOpen && onOpen) {
                    onOpen(this);
                } else if (!isOpen && onClose) {
                    onClose(this);
                }
            },
        );
    };

    render() {
        const { isOpen }: CollapsibleState = this.state;
        const {
            animationDuration,
            buttonProps = {},
            children,
            className,
            isBordered,
            hasStickyHeader,
            headerActionItems,
            title,
        }: CollapsibleProps = this.props;

        const sectionClassName = classNames(
            'collapsible-card',
            {
                'is-open': isOpen,
            },
            {
                'is-bordered': isBordered,
            },
            className,
        );
        const resinTagTarget: string = RESIN_TAG_TARGET;
        const modifiedButtonProps: { [index: string]: string } = omit(buttonProps, [resinTagTarget]);
        const interactionTarget = buttonProps[resinTagTarget];
        const buttonClassName = hasStickyHeader
            ? 'collapsible-card-header has-sticky-header'
            : 'collapsible-card-header';

        if (interactionTarget) {
            modifiedButtonProps[resinTagTarget] = `${interactionTarget}${isOpen ? 'collapse' : 'expand'}`;
        }

        return (
            <div className={sectionClassName}>
                <div className={buttonClassName}>
                    <PlainButton
                        {...modifiedButtonProps}
                        aria-expanded={isOpen}
                        className="collapsible-card-title"
                        onClick={this.toggleVisibility}
                        type={ButtonType.BUTTON}
                    >
                        {title}
                        <IconCaretDown className="collapsible-card-header-caret" color={bdlGray50} width={8} />
                    </PlainButton>
                    {!!headerActionItems && <span className="bdl-Collapsible-actionItems">{headerActionItems}</span>}
                </div>
                <AnimateHeight duration={animationDuration} height={isOpen ? 'auto' : 0}>
                    <div className="collapsible-card-content">{children}</div>
                </AnimateHeight>
            </div>
        );
    }
}

export default Collapsible;
