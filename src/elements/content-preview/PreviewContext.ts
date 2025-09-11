import React from 'react';

export interface PreviewContextType {
    previewBodyRef: React.RefObject<HTMLDivElement>;
}

const PreviewContext = React.createContext<PreviewContextType | null>(null);

PreviewContext.displayName = 'PreviewContext';
export default PreviewContext;
