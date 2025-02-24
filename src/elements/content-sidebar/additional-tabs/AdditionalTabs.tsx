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
        const { tabs } = props;
        const hasIconTabs = tabs?.some(tab => tab.iconUrl);
        this.state = { isLoading: hasIconTabs ?? true };
    }

    componentDidMount() {
        const { tabs } = this.props;
        if (!tabs?.some(tab => tab.iconUrl)) {
            this.setState({ isLoading: false });
        }
    }

    /**
     * Handles an individual icon image load
     */
    onImageLoad = () => {
        const { tabs } = this.props;

        if (!tabs) {
            return;
        }

        const tabsWithIcons = tabs.filter(tab => tab.iconUrl);
        this.numLoadedTabs += 1;

        if (this.numLoadedTabs >= tabsWithIcons.length || tabsWithIcons.length === 0) {
            this.setState({ isLoading: false });
        }
    };

    render() {
        const { tabs } = this.props;
        const { isLoading } = this.state;

        if (!tabs) {
            return <AdditionalTabsLoading data-testid="additional-tabs-loading" />;
        }

        if (!tabs) {
            return <AdditionalTabsLoading data-testid="additional-tabs-loading" />;
        }

        return (
            <>
                {isLoading && <AdditionalTabsLoading data-testid="additional-tabs-loading" />}
                <div
                    className={`bdl-AdditionalTabs ${isLoading ? 'bdl-is-loading' : ''}`}
                    data-testid="additional-tabs"
                    aria-hidden={isLoading ? 'true' : undefined}
                >
                    {tabs.map(tabData => (
                        <AdditionalTab
                            key={tabData.id}
                            isLoading={isLoading}
                            onImageLoad={this.onImageLoad}
                            {...tabData}
                        />
                    ))}
                </div>
            </>
        );
    }
}

export default AdditionalTabs;
