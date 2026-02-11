import * as React from 'react';
// @ts-ignore flow import
import PreviewError from './PreviewError';
import { PreviewLoading } from '../../components/preview';
import './PreviewMask.scss';

export type Props = {
    errorCode?: string;
    extension?: string;
    isLoading?: boolean;
    isLoadingDeferred?: boolean;
};

export default function PreviewMask({
    errorCode,
    extension,
    isLoading,
    isLoadingDeferred = false,
}: Props): React.ReactElement | null {
    if (errorCode) {
        return (
            <div className="bcpr-PreviewMask">
                <PreviewError errorCode={errorCode} />
            </div>
        );
    }

    if (isLoading) {
        return <div className="bcpr-PreviewMask">{!isLoadingDeferred && <PreviewLoading extension={extension} />}</div>;
    }

    return null;
}
