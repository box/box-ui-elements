import * as React from 'react';
import AdditionalTabPlaceholder from './AdditionalTabPlaceholder';
import './AdditionalTabsLoading.scss';

const AdditionalTabsLoading = () => (
    <div className="bdl-AdditionalTabsLoading" data-testid="additional-tabs-loading">
        <AdditionalTabPlaceholder isLoading data-testid="additional-tab-placeholder" />
        <AdditionalTabPlaceholder isLoading data-testid="additional-tab-placeholder" />
        <AdditionalTabPlaceholder isLoading data-testid="additional-tab-placeholder" />
    </div>
);

export default AdditionalTabsLoading;
