/**
 * @flow
 * @file Preview sidebar component
 * @author Box
 */

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import DetailsSidebar from './DetailsSidebar';
import IconComments from '../icons/IconComments';
import IconTasks from '../icons/IconTasks';
import IconVersions from '../icons/IconVersions';
import IconApps from '../icons/IconApps';
import IconDetails from '../icons/IconDetails';
import { PlainButton } from '../Button';
import { BOX_BLUE } from '../../constants';
import type { BoxItem } from '../../flowTypes';
import './Sidebar.scss';

type Props = {
    file?: BoxItem,
    getPreviewer: Function,
    getLocalizedMessage: Function
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
        const { file, getPreviewer, getLocalizedMessage }: Props = this.props;
        const { showSidebar }: State = this.state;
        const sidebarTitle = getLocalizedMessage('buik.preview.sidebar.details.title');

        const sidebarClassName = classNames('bcpr-sidebar', {
            'bcpr-sidebar-visible': showSidebar
        });

        const sidebarBtnClassName = classNames({
            'bcpr-sidebar-btn-selected': showSidebar
        });

        return (
            <div className={sidebarClassName}>
                <div className='bcpr-sidebar-btns'>
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
                {!!file &&
                    showSidebar &&
                    <DetailsSidebar
                        file={file}
                        getPreviewer={getPreviewer}
                        getLocalizedMessage={getLocalizedMessage}
                    />}
            </div>
        );
    }
}

export default Sidebar;
