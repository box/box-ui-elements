import * as React from 'react';
import AdditionalTabPlaceholder from './AdditionalTabPlaceholder';
import './AdditionalTabsLoading.scss';

const AdditionalTabsLoading = () => (
    <>
        <AdditionalTabPlaceholder isLoading />
        <AdditionalTabPlaceholder isLoading />
        <AdditionalTabPlaceholder isLoading />
    </>
);

export default AdditionalTabsLoading;
