/**
 * @flow
 * @file Preview sidebar section component
 * @author Box
 */

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { PlainButton } from '../Button';
import IconCross from '../icons/IconCross';
import './SidebarSection.scss';

type Props = {
    children?: any,
    className: string,
    title: string,
    isOpen: boolean
};

type DefaultProps = {|
    className: string,
    isOpen: boolean
|};

type State = {
    isOpen: boolean
};

class SidebarSection extends PureComponent<DefaultProps, Props, State> {
    props: Props;
    state: State;

    static defaultProps = {
        className: '',
        isOpen: false
    };

    /**
     * [constructor]
     *
     * @private
     * @return {ContentPreview}
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            isOpen: props.isOpen
        };
    }

    /**
     * Click handler for toggling the section
     *
     * @private
     * @param {Event} event - click event
     * @return {void}
     */
    toggleVisibility = () => {
        this.setState((prevState) => ({
            isOpen: !prevState.isOpen
        }));
    };

    /**
     * Renders the section
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    render() {
        const { isOpen }: State = this.state;
        const { children, className, title }: Props = this.props;

        const titleClassName = classNames(
            'bcpr-sidebar-toggle',
            {
                'bcpr-sidebar-toggle-cross': isOpen
            },
            className
        );

        const sectionClassName = classNames(
            'bcpr-sidebar-section',
            {
                'bcpr-sidebar-section-open': isOpen
            },
            className
        );

        return (
            <div className={sectionClassName}>
                <PlainButton onClick={this.toggleVisibility} className='bcpr-sidebar-section-title'>
                    <span className='bcpr-sidebar-section-title-text'>
                        {title}
                    </span>
                    <IconCross color='#b5b5b5' width={11} height={11} className={titleClassName} />
                </PlainButton>
                {isOpen &&
                    <div className='bcpr-sidebar-section-content'>
                        {children}
                    </div>}
            </div>
        );
    }
}

export default SidebarSection;
