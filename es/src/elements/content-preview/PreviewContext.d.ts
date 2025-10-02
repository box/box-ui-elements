import React from 'react';
export interface PreviewContextType {
    previewBodyRef: React.RefObject<HTMLDivElement>;
}
declare const PreviewContext: React.Context<PreviewContextType>;
export default PreviewContext;
