import React, { PureComponent } from 'react';
import AdditionalTab from './AdditionalTab';
import AdditionalTabsLoading from './AdditionalTabsLoading';
import type { AdditionalSidebarTab } from '../flowTypes';
import './AdditionalTabs.scss';

interface Props {
    tabs?: AdditionalSidebarTab[];
}

interface State {
    isLoading: boolean;
}

class AdditionalTabs extends PureComponent<Props, State> {
    private numLoadedTabs: number = 0;

    constructor(props: Props) {
        super(props);
        this.state = { isLoading: true };
    }

    onImageLoad = (): void => {
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

    render(): React.ReactElement {
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
