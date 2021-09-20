import * as React from 'react';
import IconFileVideo from '../../icon/content/FileVideo32';
import PreviewLoadingRing from './PreviewLoadingRing';
import { getColor, getIcon } from './previewIcons';
import './PreviewLoading.scss';

export type Props = {
    extension?: string;
};

export default function PreviewLoading({ extension }: Props): React.ReactElement {
    const color = getColor(extension);
    const Icon = getIcon(extension);
    const theme = Icon === IconFileVideo ? 'dark' : 'light'; // Video files are displayed on a dark background

    return (
        <PreviewLoadingRing className="bdl-PreviewLoading" color={color} theme={theme}>
            <Icon className="bdl-PreviewLoading-icon" />
        </PreviewLoadingRing>
    );
}
