/**
 * @flow
 * @file Preview sidebar component
 * @author Box
 */

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import DetailsSidebar from './DetailsSidebar';
import IconComments from '../icons/IconComments';
import IconTasks from '../icons/IconTasks';
import IconVersions from '../icons/IconVersions';
import IconApps from '../icons/IconApps';
import IconDetails from '../icons/IconDetails';
import { PlainButton } from '../Button';
import { BOX_BLUE } from '../../constants';
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

class Sidebar extends PureComponent<void, Props, State> {
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
                    <PlainButton>
                        <IconComments />
                    </PlainButton>
                    <PlainButton>
                        <IconTasks />
                    </PlainButton>
                    <PlainButton>
                        <IconApps />
                    </PlainButton>
                    <PlainButton>
                        <IconVersions />
                    </PlainButton>
                    <PlainButton
                        onClick={this.toggleSidebar}
                        title={sidebarTitle}
                        aria-label={sidebarTitle}
                        className={sidebarBtnClassName}
                    >
                        <IconDetails color={showSidebar ? BOX_BLUE : '#aaa'} />
                    </PlainButton>
                </div>
                {!!file && showSidebar && <DetailsSidebar file={file} getPreviewer={getPreviewer} />}
            </div>
        );
    }
}

export default injectIntl(Sidebar);
