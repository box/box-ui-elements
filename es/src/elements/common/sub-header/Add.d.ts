import * as React from 'react';
export interface AddProps {
    isDisabled: boolean;
    onCreate: () => void;
    onUpload: () => void;
    portalElement?: HTMLElement;
    showCreate: boolean;
    showUpload: boolean;
}
declare const Add: ({ isDisabled, onUpload, onCreate, portalElement, showCreate, showUpload }: AddProps) => React.JSX.Element;
export default Add;
