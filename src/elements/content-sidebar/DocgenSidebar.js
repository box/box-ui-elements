// @ts-check
/**
 * @flow
 * @file Sign sidebar component
 * @author Box
 */

import flow from 'lodash/flow';
import * as React from 'react';
import type { ErrorContextProps } from '../../common/types/api';
import type { WithLoggerProps } from '../../common/types/logging';
import { ORIGIN_METADATA_SIDEBAR, SIDEBAR_VIEW_METADATA } from '../../constants';
import { mark } from '../../utils/performance';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { EVENT_JS_READY } from '../common/logger/constants';
import SidebarContent from './SidebarContent';

type EUAProps = {
    enabled: boolean,
    getDocgenTags: Function,
};

type ExternalProps = {
    // isFeatureEnabled: boolean,
    docgenPreviewSidebarProps: EUAProps,
};

type DocgenTag = {
    json_paths: Array<string>,
    tag_content: string,
    tag_type: string,
};

type Props = {
    isLoading: boolean,
} & ExternalProps &
    ErrorContextProps &
    WithLoggerProps;

type State = { tags: Array<DocgenTag> };

const MARK_NAME_JS_READY = `${ORIGIN_METADATA_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

// TO DO: implement actual sidebar content in separate tickets
class DocgenSidebar extends React.PureComponent<Props, State> {
    state = {
        tags: [],
    };

    componentDidMount() {
        this.props.docgenPreviewSidebarProps.getDocgenTags().then(response => {
            this.setState({ tags: response?.payload?.data });
        });
    }

    render() {
        const { isLoading } = this.props;
        const { tags } = this.state;

        return (
            <SidebarContent sidebarView={SIDEBAR_VIEW_METADATA} title="Box Docgen">
                <input placeholder="Search" />
                {isLoading && <div>Loading</div>}
                {tags.length > 0 ? (
                    <div>
                        {tags.map(tag => (
                            <p key={tag.json_paths[0]}>{tag.json_paths[0]}</p>
                        ))}
                    </div>
                ) : (
                    <div>No Tags found</div>
                )}
            </SidebarContent>
        );
    }
}

export type DocgenSidebarProps = ExternalProps;
export { DocgenSidebar as DocgenSidebarComponent };
export default flow([withLogger(ORIGIN_METADATA_SIDEBAR), withErrorBoundary(ORIGIN_METADATA_SIDEBAR), withAPIContext])(
    DocgenSidebar,
);
