import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button as BlueprintButton } from '@box/blueprint-web';
import { type ButtonProps } from '@box/blueprint-web/lib-esm/button/types';
import RadarButton from '../radar-button/RadarButton';
import { ButtonType } from './Button';

type ButtonAdapterProps = Omit<ButtonProps, 'disabled' | 'loading' | 'variant' | 'ref' | 'type' | 'children'> & {
    isDisabled?: boolean;
    isLoading?: boolean;
    isSelected?: boolean;
    setRef?: (ref: HTMLButtonElement | null) => void;
    showRadar?: boolean;
    type?: ButtonType;
    children?: React.ReactNode;
};

const ButtonAdapter = React.forwardRef<HTMLButtonElement, ButtonAdapterProps>(
    (
        {
            isSelected,
            showRadar,
            setRef,
            isDisabled,
            isLoading,
            type = ButtonType.SUBMIT,
            children,
            className,
            ...props
        },
        ref,
    ) => {
        const buttonRef = React.useCallback(
            (element: HTMLButtonElement | null) => {
                if (setRef) {
                    setRef(element);
                }
                if (typeof ref === 'function') {
                    ref(element);
                } else if (ref) {
                    ref.current = element;
                }
            },
            [setRef, ref],
        );

        const formattedChildren = React.isValidElement(children)
            ? children.type === FormattedMessage
                ? (children.props as { defaultMessage?: string }).defaultMessage || ''
                : children
            : children || '';

        const buttonProps = {
            ...props,
            className,
            disabled: isDisabled,
            loading: isLoading,
            type,
            variant: isSelected ? 'primary' : 'secondary',
            ref: buttonRef,
            children: formattedChildren || '',
        } as const as ButtonProps;

        return showRadar ? <RadarButton {...buttonProps} /> : <BlueprintButton {...buttonProps} />;
    },
);

ButtonAdapter.displayName = 'ButtonAdapter';

export { ButtonType };
export default ButtonAdapter;
