import * as React from 'react';

interface AdditionalTabPlaceholderProps {
    isLoading: boolean;
}

const AdditionalTabPlaceholder = ({ isLoading }: AdditionalTabPlaceholderProps) => (
    <div className={`bdl-AdditionalTabPlaceholder ${isLoading ? 'bdl-is-loading' : ''}`} />
);

export default AdditionalTabPlaceholder;
