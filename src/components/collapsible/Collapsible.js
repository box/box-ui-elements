// @flow
import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import AnimateHeight from 'react-animate-height';

import { RESIN_TAG_TARGET } from '../../common/variables';
import IconCaretDown from '../../icons/general/IconCaretDown';
import PlainButton from '../plain-button';
import { bdlGray50 } from '../../styles/variables';

import './Collapsible.scss';

type Props = {
    /** Duration of animation (milliseconds) */
    animationDuration?: number,
    /** Other props (e.g. resin target names) to be included in the button */
    buttonProps?: Object,
    /** Content to be displayed in the card if it's expanded */
    children: React.Node,
    /** CSS class for the wrapper div */
    className?: string,
    /** Determines look of component */
    hasStickyHeader?: boolean,
    /** Determines stickiness of the header */
    headerActionItems?: React.Node,
    /** Determines optional header action items */
    isBordered?: boolean,
    /** Initial state of the collapsible card */
    isOpen: boolean,
    /** callback called when collapsible is opened */
    onClose?: Function,
    /** callback called when collapsible is collapsed */
    onOpen?: Function,
    /** Title string or component */
    title: string | React.Node,
};

type State = {
    isOpen: boolean,
};

class Collapsible extends React.PureComponent<Props, State> {
    static defaultProps = {
        buttonProps: {},
        className: '',
        isOpen: true,
        animationDuration: 100,
    };

    constructor(props: Props) {
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
        const { isOpen }: State = this.state;
        const {
            animationDuration,
            buttonProps = {},
            children,
            className,
            isBordered,
            hasStickyHeader,
            headerActionItems,
            title,
        }: Props = this.props;

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
        const interactionTarget = buttonProps[RESIN_TAG_TARGET];
        const modifiedButtonProps = omit(buttonProps, [RESIN_TAG_TARGET]);
        const buttonClassName = hasStickyHeader
            ? 'collapsible-card-header has-sticky-header'
            : 'collapsible-card-header';

        if (interactionTarget) {
            modifiedButtonProps[RESIN_TAG_TARGET] = `${interactionTarget}${isOpen ? 'collapse' : 'expand'}`;
        }

        return (
            <div className={sectionClassName}>
                <div className={buttonClassName}>
                    <PlainButton
                        {...modifiedButtonProps}
                        className="collapsible-card-title"
                        onClick={this.toggleVisibility}
                        type="button"
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
