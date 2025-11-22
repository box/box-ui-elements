/**
 * @flow
 * @file Preview sidebar additional tabs component
 * @author Box
 */

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import AdditionalTab from './AdditionalTab';
import AdditionalTabsLoading from './AdditionalTabsLoading';
import type { AdditionalSidebarTab } from '../flowTypes';

import './AdditionalTabs.scss';

type Props = {
    tabs?: Array<AdditionalSidebarTab>,
    isPreviewModernizationEnabled?: boolean,
};

type State = {
    isLoading: boolean,
};

class AdditionalTabs extends PureComponent<Props, State> {
    numLoadedTabs: number = 0;

    constructor(props: Props) {
        super(props);

        this.state = { isLoading: true };
    }

    /**
     * Handles an individual icon image load
     *
     * @return {void}
     */
    onImageLoad = () => {
        const { tabs } = this.props;

        if (!tabs) {
            return;
        }

        const hasMoreTab = tabs.find(tab => tab.id < 0 && !tab.iconUrl);
        const numTabs = tabs.length - (hasMoreTab ? 1 : 0);

        this.numLoadedTabs += 1;

        if (this.numLoadedTabs === numTabs) {
            this.setState({
                isLoading: false,
            });
        }
    };

    render() {
        const { tabs, isPreviewModernizationEnabled } = this.props;
        const { isLoading } = this.state;

        return (
            <div
                className={classNames('bdl-AdditionalTabs', {
                    'bdl-AdditionalTabs--modernized': isPreviewModernizationEnabled,
                })}
            >
                {isLoading && <AdditionalTabsLoading />}
                {tabs &&
                    tabs.map(tabData => (
                        <AdditionalTab
                            key={tabData.id}
                            onImageLoad={this.onImageLoad}
                            isLoading={isLoading}
                            {...tabData}
                        />
                    ))}
            </div>
        );
    }
}

export default AdditionalTabs;
