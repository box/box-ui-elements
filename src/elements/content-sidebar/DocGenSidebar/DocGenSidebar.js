/**
 * @flow
 * @file Doc Gen sidebar component
 * @author Box
 */

import flow from 'lodash/flow';
import * as React from 'react';
import type { ErrorContextProps } from '../../../common/types/api';
import type { WithLoggerProps } from '../../../common/types/logging';
import { ORIGIN_METADATA_SIDEBAR, SIDEBAR_VIEW_METADATA } from '../../../constants';
import { mark } from '../../../utils/performance';
import { withAPIContext } from '../../common/api-context';
import { withErrorBoundary } from '../../common/error-boundary';
import { withLogger } from '../../common/logger';
import { EVENT_JS_READY } from '../../common/logger/constants';
import SidebarContent from '../SidebarContent';
import NoTagsAvailable from './NoTagsAvailable';
import SearchInput from './SearchInput';
import TagsList from './TagsList';

import type { DocGenTag } from './types';

type ExternalProps = {
    enabled: boolean,
    getDocGenTags: Function,
};

type Props = {
    isLoading: boolean,
} & ExternalProps &
    ErrorContextProps &
    WithLoggerProps;

type State = { tags: Array<DocGenTag> };

const MARK_NAME_JS_READY = `${ORIGIN_METADATA_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

// TO DO: implement actual sidebar content in separate tickets
class DocGenSidebar extends React.PureComponent<Props, State> {
    state = {
        tags: [],
    };

    componentDidMount() {
        if (this.props.getDocGenTags) {
            this.props.getDocGenTags().then(response => {
                this.setState({ tags: response?.data });
            });
        }
    }

    render() {
        const { isLoading } = this.props;
        const { tags } = this.state;

        return (
            <SidebarContent sidebarView={SIDEBAR_VIEW_METADATA} title="Box DocGen">
                <SearchInput />
                {isLoading && <div>Loading</div>}
                {tags.length > 0 ? <TagsList tags={tags} /> : <NoTagsAvailable />}
            </SidebarContent>
        );
    }
}

export type DocGenSidebarProps = ExternalProps;
export { DocGenSidebar as DocGenSidebarComponent };
export default flow([withLogger(ORIGIN_METADATA_SIDEBAR), withErrorBoundary(ORIGIN_METADATA_SIDEBAR), withAPIContext])(
    DocGenSidebar,
);
