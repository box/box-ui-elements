import React from 'react';
// @ts-ignore flow import
import PreviewError from './PreviewError';
import { PreviewLoading } from '../../components/preview';
import './PreviewMask.scss';

export type Props = {
    errorCode?: string;
    extension?: string;
    isLoading?: boolean;
};

export default function PreviewMask({ errorCode, extension, isLoading }: Props): React.ReactElement | null {
    if (!errorCode && !isLoading) {
        return null;
    }

    return (
        <div className="bcpr-PreviewMask">
            {errorCode ? <PreviewError errorCode={errorCode} /> : isLoading && <PreviewLoading extension={extension} />}
        </div>
    );
}
