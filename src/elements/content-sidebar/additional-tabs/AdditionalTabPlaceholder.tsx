import * as React from 'react';

interface AdditionalTabPlaceholderProps {
    isLoading: boolean;
    'data-testid'?: string;
}

const AdditionalTabPlaceholder = ({ isLoading, 'data-testid': dataTestId }: AdditionalTabPlaceholderProps) => (
    <div
        className={`bdl-AdditionalTabPlaceholder ${isLoading ? 'bdl-is-loading' : ''}`}
        data-testid={dataTestId || 'additional-tab-placeholder'}
    >
        <div className="bdl-AdditionalTabPlaceholder-icon">
            {!isLoading && (
                <svg
                    className="icon-ellipsis"
                    height="20"
                    viewBox="0 0 10 2"
                    width="20"
                    aria-hidden="true"
                    focusable="false"
                    role="presentation"
                >
                    <path
                        className="fill-color"
                        d="M1 2c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm8 0c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zM5 2c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"
                        fill="#e8e8e8"
                        fillRule="evenodd"
                    />
                </svg>
            )}
        </div>
    </div>
);

export default AdditionalTabPlaceholder;
