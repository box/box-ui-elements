import React from 'react';
import { ExternalProps as ContentAnswersModalExternalProps } from './ContentAnswersModal';
import { BoxItem } from '../../common/types/core';
interface ExternalProps extends ContentAnswersModalExternalProps {
    show?: boolean;
}
interface Props {
    className?: string;
    file: BoxItem;
}
declare const ContentAnswers: (props: ContentAnswersModalExternalProps & Props) => React.JSX.Element;
export type ContentAnswersProps = ExternalProps & Props;
export default ContentAnswers;
