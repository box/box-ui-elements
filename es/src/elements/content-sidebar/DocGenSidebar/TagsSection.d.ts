import * as React from 'react';
import { MessageDescriptor } from 'react-intl';
import { JsonPathsMap } from './types';
import './DocGenSidebar.scss';
type Props = {
    message: MessageDescriptor;
    data: JsonPathsMap;
};
declare const TagsSection: ({ data, message }: Props) => React.JSX.Element;
export default TagsSection;
