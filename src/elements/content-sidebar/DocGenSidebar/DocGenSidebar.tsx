import classNames from 'classnames';
import flow from 'lodash/flow';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';

// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { ORIGIN_DOCGEN_SIDEBAR, SIDEBAR_VIEW_METADATA } from '../../../constants';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { withAPIContext } from '../../common/api-context';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { withErrorBoundary } from '../../common/error-boundary';
import LoadingIndicator from '../../../components/loading-indicator';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { withLogger } from '../../common/logger';
import Error from './Error';
import NoTagsAvailable from './NoTagsAvailable';
// @ts-ignore: no ts definition
import SidebarContent from '../SidebarContent';
import TagsSection from './TagsSection';
// @ts-ignore: no ts definition
import messages from './messages';
// @ts-ignore: no ts definition
import { ErrorContextProps } from '../../../common/types/api';
// @ts-ignore: no ts definition
import { WithLoggerProps } from '../../../common/types/logging';

import './DocGenSidebar.scss';
import { DocGenTag, DocGenTemplateTagsResponse } from './types';

type ExternalProps = {
    enabled: boolean;
    getDocGenTags: Function;
};

type Props = {
    intl: IntlShape;
} & ExternalProps &
    ErrorContextProps &
    WithLoggerProps;

type State = {
    hasError: boolean;
    loading: boolean;
    tags: {
        image: DocGenTag[];
        text: DocGenTag[];
    };
};

const DocGenSidebar = (props: Props) => {
    const [sidebarState, setSidebarState] = React.useState<State>({
        hasError: false,
        loading: false,
        tags: {
            text: [],
            image: [],
        },
    });

    const loadTags = () => {
        if (props.getDocGenTags) {
            setSidebarState({ ...sidebarState, loading: true });
            props
                .getDocGenTags()
                .then((response: DocGenTemplateTagsResponse) => {
                    if (response) {
                        setSidebarState({
                            ...sidebarState,
                            tags: {
                                text: response.data.filter(tag => tag.tag_type === 'text'),
                                image: response.data.filter(tag => tag.tag_type === 'image'),
                            },
                            loading: false,
                        });
                    } else {
                        setSidebarState({ ...sidebarState, loading: false });
                    }
                })
                .catch(() => setSidebarState({ ...sidebarState, loading: false, hasError: true }));
        }
    };

    React.useEffect(() => {
        loadTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { hasError, tags, loading } = sidebarState;

    const hasNoTags = tags.image.length + tags.text.length === 0;

    return (
        <SidebarContent sidebarView={SIDEBAR_VIEW_METADATA} title={props.intl.formatMessage(messages.docgenTags)}>
            <div className={classNames('docgen-sidebar', { center: hasNoTags || hasError || loading })}>
                {hasError && <Error onClick={loadTags} />}
                {!hasError && loading && <LoadingIndicator className="docgen-loading" />}
                {!hasError && !loading && (
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
};

export type DocGenSidebarProps = ExternalProps;
export { DocGenSidebar as DocGenSidebarComponent };
export default injectIntl(
    flow([withLogger(ORIGIN_DOCGEN_SIDEBAR), withErrorBoundary(ORIGIN_DOCGEN_SIDEBAR), withAPIContext])(DocGenSidebar),
);
