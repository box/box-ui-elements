import React from 'react';
import { IntlShape } from 'react-intl';
import './ContentAnswersOpenButton.scss';
interface ContentAnswersOpenButtonProps {
    fileExtension: string;
    intl: IntlShape;
    isHighlighted: boolean;
    isModalOpen: boolean;
    onClick: () => void;
}
declare const _default: React.FC<import("react-intl").WithIntlProps<ContentAnswersOpenButtonProps>> & {
    WrappedComponent: React.ComponentType<ContentAnswersOpenButtonProps>;
};
export default _default;
