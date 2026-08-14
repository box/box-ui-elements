import * as React from 'react';
import classNames from 'classnames';

export interface ModalActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Contents of the modal action area */
    children?: React.ReactNode;
    /** Additional CSS class name for the modal action area */
    className?: string;
}

const ModalActions = ({ className, ...rest }: ModalActionsProps) => (
    <div className={classNames('modal-actions', className)} {...rest} />
);

export default ModalActions;
