/**
 * @flow
 * @file Doc Gen sidebar component
 * @author Box
 */

import flow from 'lodash/flow';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import { ORIGIN_METADATA_SIDEBAR, SIDEBAR_VIEW_METADATA } from '../../../constants';
import { mark } from '../../../utils/performance';
import { withAPIContext } from '../../common/api-context';
import { withErrorBoundary } from '../../common/error-boundary';
import { withLogger } from '../../common/logger';
import { EVENT_JS_READY } from '../../common/logger/constants';
import Loading from './Loading';
import NoTagsAvailable from './NoTagsAvailable';
import SidebarContent from '../SidebarContent';
import TagsSection from './TagsSection';
import messages from './messages';

import type { ErrorContextProps } from '../../../common/types/api';
import type { WithLoggerProps } from '../../../common/types/logging';

import './DocGenSidebar.scss';

import type { DocGenTag } from './types';

type ExternalProps = {
    enabled: boolean,
    getDocGenTags: Function,
};

type Props = {
    intl: IntlShape,
} & ExternalProps &
    ErrorContextProps &
    WithLoggerProps;

type State = {
    loading: boolean,
    tags: {
        image: Array<DocGenTag>,
        text: Array<DocGenTag>,
    },
};

const MARK_NAME_JS_READY = `${ORIGIN_METADATA_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

class DocGenSidebar extends React.PureComponent<Props, State> {
    state = {
        loading: false,
        tags: {
            text: [],
            image: [],
        },
    };

    componentDidMount() {
        if (this.props.getDocGenTags) {
            this.setState({ ...this.state, loading: true });
            this.props.getDocGenTags().then(response => {
                if (response) {
                    this.setState({
                        tags: {
                            text: response.data.filter(tag => tag.tagType === 'text'),
                            image: response.data.filter(tag => tag.tagType === 'image'),
                        },
                        loading: false,
                    });
                }
                this.setState({ ...this.state, loading: false });
            });
        }
    }

    render() {
        const { tags, loading } = this.state;

        const hasNoTags = tags.image.length + tags.text.length === 0;

        return (
            <SidebarContent
                sidebarView={SIDEBAR_VIEW_METADATA}
                title={this.props.intl.formatMessage(messages.docgenTags)}
            >
                <div className="docgen-sidebar">
                    {loading ? (
                        <Loading />
                    ) : (
                        <>
                            {hasNoTags ? (
                                <NoTagsAvailable />
                            ) : (
                                <>
                                    <TagsSection message={messages.textTags} tags={tags.text} />
                                    <TagsSection message={messages.imageTags} tags={tags.image} />
                                </>
                            )}
                        </>
                    )}
                </div>
            </SidebarContent>
        );
    }
}

export type DocGenSidebarProps = ExternalProps;
export { DocGenSidebar as DocGenSidebarComponent };
export default injectIntl(
    flow([withLogger(ORIGIN_METADATA_SIDEBAR), withErrorBoundary(ORIGIN_METADATA_SIDEBAR), withAPIContext])(
        DocGenSidebar,
    ),
);
