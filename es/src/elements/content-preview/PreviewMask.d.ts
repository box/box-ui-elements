import * as React from 'react';
import './PreviewMask.scss';
export type Props = {
    errorCode?: string;
    extension?: string;
    isLoading?: boolean;
};
export default function PreviewMask({ errorCode, extension, isLoading }: Props): React.ReactElement | null;
