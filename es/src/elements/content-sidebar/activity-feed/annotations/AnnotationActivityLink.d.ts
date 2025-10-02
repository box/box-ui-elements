import * as React from 'react';
import { MessageDescriptor, WrappedComponentProps } from 'react-intl';
import './AnnotationActivityLink.scss';
type MessageDescriptorWithValues = {
    values?: Record<string, number>;
} & MessageDescriptor;
export interface AnnotationActivityLinkProps extends WrappedComponentProps {
    className?: string;
    id: string;
    isDisabled: boolean;
    message: MessageDescriptorWithValues;
    onClick: (id: string) => void;
}
declare const AnnotationActivityLink: ({ className, id, intl, isDisabled, message, onClick, ...rest }: AnnotationActivityLinkProps) => JSX.Element;
export { AnnotationActivityLink as AnnotationActivityLinkBase };
declare const _default: React.FC<import("react-intl").WithIntlProps<AnnotationActivityLinkProps>> & {
    WrappedComponent: React.ComponentType<AnnotationActivityLinkProps>;
};
export default _default;
