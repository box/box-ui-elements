import React, { PureComponent } from 'react';
import AdditionalTab from './AdditionalTab';
import AdditionalTabsLoading from './AdditionalTabsLoading';
import { AdditionalTabsProps } from './types';
import './AdditionalTabs.scss';

type State = {
    isLoading: boolean;
};

class AdditionalTabs extends PureComponent<AdditionalTabsProps, State> {
    numLoadedTabs = 0;

    constructor(props: AdditionalTabsProps) {
        super(props);
        this.state = { isLoading: true };
    }

    /**
     * Handles an individual icon image load
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
        const { tabs } = this.props;
        const { isLoading } = this.state;

        return (
            <div className="bdl-AdditionalTabs">
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
