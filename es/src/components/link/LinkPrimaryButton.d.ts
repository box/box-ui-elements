import * as React from 'react';
import { LinkButtonProps } from './LinkButton';
export interface LinkPrimaryButtonProps extends LinkButtonProps {
    className?: string;
}
declare const LinkPrimaryButton: ({ className, ...rest }: LinkPrimaryButtonProps) => React.JSX.Element;
export default LinkPrimaryButton;
