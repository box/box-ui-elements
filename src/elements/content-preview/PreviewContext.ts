import React from 'react';

export interface PreviewContextType {
    previewBodyRef: HTMLDivElement | null;
}

const PreviewContext = React.createContext<PreviewContextType | null>(null);

export default PreviewContext;
