import React from 'react';
export interface CreateFolderDialogProps {
    appElement: HTMLElement;
    errorCode: string;
    isLoading: boolean;
    isOpen: boolean;
    onCancel: () => void;
    onCreate: (value: string) => void;
    parentElement: HTMLElement;
}
declare const CreateFolderDialog: ({ appElement, errorCode, isOpen, isLoading, onCancel, onCreate, parentElement, }: CreateFolderDialogProps) => React.JSX.Element;
export default CreateFolderDialog;
