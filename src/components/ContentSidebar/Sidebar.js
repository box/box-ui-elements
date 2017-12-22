/**
 * @flow
 * @file Preview sidebar component
 * @author Box
 */

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import DetailsSidebar from './DetailsSidebar';
import messages from '../messages';
import type { BoxItem } from '../../flowTypes';
import './Sidebar.scss';

type Props = {
    file?: BoxItem,
    getPreviewer: Function,
    intl: any
};

type State = {
    showSidebar: boolean
};

class Sidebar extends PureComponent<Props, State> {
    props: Props;
    state: State;

    /**
     * [constructor]
     *
     * @private
     * @return {Sidebar}
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            showSidebar: true
        };
    }

    /**
     * Handles showing or hiding of hasSidebar
     *
     * @private
     * @return {void}
     */
    toggleSidebar = (): void => {
        this.setState((prevState) => ({
            showSidebar: !prevState.showSidebar
        }));
    };

    /**
     * Renders the sidebar
     *
     * @inheritdoc
     */
    render() {
        const { file, getPreviewer, intl }: Props = this.props;
        const { showSidebar }: State = this.state;
        const sidebarTitle = intl.formatMessage(messages.sidebarDetailsTitle);

        const sidebarClassName = classNames('bcs', {
            'bcs-visible': showSidebar
        });

        const sidebarBtnClassName = classNames({
            'bcs-btn-selected': showSidebar
        });

        return (
            <div className={sidebarClassName}>
                <div className='bcs-btns'>
                    <PlainButton />
                    <PlainButton />
                    <PlainButton />
                    <PlainButton />
                    <PlainButton
                        onClick={this.toggleSidebar}
                        title={sidebarTitle}
                        aria-label={sidebarTitle}
                        className={sidebarBtnClassName}
                    />
                </div>
                {!!file && showSidebar && <DetailsSidebar file={file} getPreviewer={getPreviewer} />}
            </div>
        );
    }
}

export default injectIntl(Sidebar);
