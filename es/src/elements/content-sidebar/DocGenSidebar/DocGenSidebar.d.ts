import React from 'react';
import { ErrorContextProps } from '../../../common/types/api';
import { WithLoggerProps } from '../../../common/types/logging';
import './DocGenSidebar.scss';
import { DocGenTemplateTagsResponse } from './types';
type ExternalProps = {
    enabled: boolean;
    getDocGenTags: () => Promise<DocGenTemplateTagsResponse>;
    isDocgenTemplate: boolean;
    checkDocGenTemplate: void;
};
type Props = ExternalProps & ErrorContextProps & WithLoggerProps;
declare const DocGenSidebar: ({ getDocGenTags }: Props) => React.JSX.Element;
export type DocGenSidebarProps = ExternalProps;
export { DocGenSidebar as DocGenSidebarComponent };
declare const _default: any;
export default _default;
