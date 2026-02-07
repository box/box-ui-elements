import * as React from 'react';
// @ts-ignore flow import
import PreviewError from './PreviewError';
import { PreviewLoading } from '../../components/preview';
import './PreviewMask.scss';

export type Props = {
    errorCode?: string;
    extension?: string;
    isDeferringLoading?: boolean;
    isLoading?: boolean;
};

export default function PreviewMask({
    errorCode,
    extension,
    isDeferringLoading = false,
    isLoading,
}: Props): React.ReactElement | null {
    if (errorCode) {
        return (
            <div className="bcpr-PreviewMask">
                <PreviewError errorCode={errorCode} />
            </div>
        );
    }

    if (isDeferringLoading) {
        return <div className="bcpr-PreviewMask" />;
    }

    if (isLoading) {
        return (
            <div className="bcpr-PreviewMask">
                <PreviewLoading extension={extension} />
            </div>
        );
    }

    return null;
}
