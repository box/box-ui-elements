import * as React from 'react';
import DefaultError from '../common/error-boundary/DefaultError';
import './SidebarLoadingError.scss';

const SidebarLoadingError = () => (
    <div className="bcs-loading-error">
        <DefaultError />
    </div>
);

export default SidebarLoadingError;
