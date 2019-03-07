/**
 * @flow
 * @file Preview sidebar additional tabs components
 * @author Box
 */

import React, { PureComponent } from 'react';
import AdditionalTab from './AdditionalTab';
import AdditionalTabsLoading from './AdditionalTabsLoading';
import './AdditionalTabs.scss';

type Props = {
    tabs: ?AdditionalSidebarTabs,
};

type State = {
    isLoading: boolean,
};

class AdditionalTabs extends PureComponent<Props, State> {
    initialState: State = {
        isLoading: true,
    };

    constructor(props) {
        super(props);

        this.numLoadedTabs = 0;

        this.state = { ...this.initialState };
    }

    onImageLoad = () => {
        const { tabs } = this.props;

        this.numLoadedTabs += 1;

        // If we're displaying the more tab, consider it loaded.
        const hasMoreTab = tabs.find(tab => tab.id < 0 && !tab.iconUrl);
        const moreTabCount = hasMoreTab ? 1 : 0;

        if (this.numLoadedTabs === tabs.length - moreTabCount) {
            this.setState({
                isLoading: false,
            });
        }
    };

    render() {
        const { tabs } = this.props;
        const { isLoading } = this.state;

        return (
            <div className="bcs-nav-additional-tabs">
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
