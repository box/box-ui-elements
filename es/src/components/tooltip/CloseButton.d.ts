import * as React from 'react';
import { IntlShape } from 'react-intl';
type Props = {
    intl: IntlShape;
    onClick: (event: React.SyntheticEvent<HTMLButtonElement, Event>) => void;
};
declare const CloseButton: ({ intl, onClick }: Props) => React.JSX.Element;
export { CloseButton as CloseButtonBase };
declare const _default: React.FC<import("react-intl").WithIntlProps<Props>> & {
    WrappedComponent: React.ComponentType<Props>;
};
export default _default;
