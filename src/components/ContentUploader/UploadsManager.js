/**
 * @flow
 * @file Uploads manager
 */

import React, { Component } from 'react';
import classNames from 'classnames';
import ItemList from './ItemList';
import OverallUploadsProgressBar from './OverallUploadsProgressBar';
import './UploadsManager.scss';
import type { UploadItem, View } from '../../flowTypes';

type Props = {
    isExpanded: boolean,
    items: UploadItem[],
    onItemActionClick: Function,
    toggleUploadsManager: Function,
    view: View
};

class UploadsManager extends Component<*, Props> {
    handleProgressBarKeyDown = (event) => {
        const { toggleUploadsManager } = this.props;

        switch (event.key) {
            case 'Enter':
            case 'Space':
                toggleUploadsManager();
                break;
            default:
            // noop
        }
    };

    render() {
        const { items, view, onItemActionClick, toggleUploadsManager, isExpanded } = this.props;
        const isVisible = items.length > 0;

        return (
            <div
                className={classNames('buik uploads-manager-container', {
                    'is-expanded': isExpanded,
                    'is-visible': isVisible
                })}
            >
                <OverallUploadsProgressBar
                    isVisible={isVisible}
                    items={items}
                    onClick={toggleUploadsManager}
                    onKeyDown={this.handleProgressBarKeyDown}
                    view={view}
                />
                <div className='uploads-manager-item-list'>
                    <ItemList items={items} view={view} onClick={onItemActionClick} />
                </div>
            </div>
        );
    }
}

export default UploadsManager;
