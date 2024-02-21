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
import { DocGenTag, DocGenTemplateTagsResponse, JsonPathsMap } from './types';

type ExternalProps = {
    enabled: boolean;
    getDocGenTags: () => Promise<DocGenTemplateTagsResponse>;
    isDocgenTemplate: boolean;
    checkDocGenTemplate: void;
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
    jsonPaths: {
        textTree: JsonPathsMap;
        imageTree: JsonPathsMap;
    };
};

const isJsonPathsMap = (obj: object): obj is JsonPathsMap => {
    return typeof obj === 'object' && obj !== null;
};

const DocGenSidebar = ({ intl, getDocGenTags }: Props) => {
    const [sidebarState, setSidebarState] = React.useState<State>({
        hasError: false,
        loading: false,
        tags: {
            text: [],
            image: [],
        },
        jsonPaths: {
            textTree: {},
            imageTree: {},
        },
    });
    const tagsToJsonPaths = (tags: DocGenTag[]): JsonPathsMap => {
        const jsonPathsMap: JsonPathsMap = {};
        tags.forEach(tag => {
            tag.json_paths.forEach(jsonPath => {
                const paths = jsonPath.split('.');
                let currentObject: JsonPathsMap | {} = jsonPathsMap;
                paths.forEach(segment => {
                    if (isJsonPathsMap(currentObject)) {
                        if (!(segment in currentObject)) {
                            (currentObject as JsonPathsMap)[segment] = {};
                        }
                        currentObject = (currentObject as JsonPathsMap)[segment];
                    }
                });
            });
        });

        return jsonPathsMap;
    };

    const loadTags = () => {
        if (getDocGenTags) {
            setSidebarState({ ...sidebarState, loading: true });
            getDocGenTags()
                .then((response: DocGenTemplateTagsResponse) => {
                    if (response) {
                        // anything that is not an image tag for this view is treated as a text tag
                        const textTags = response?.data?.filter(tag => tag.tag_type !== 'image') || [];
                        const imageTags = response?.data?.filter(tag => tag.tag_type === 'image') || [];
                        setSidebarState({
                            ...sidebarState,
                            tags: {
                                text: textTags,
                                image: imageTags,
                            },
                            loading: false,
                            jsonPaths: {
                                textTree: tagsToJsonPaths(textTags),
                                imageTree: tagsToJsonPaths(imageTags),
                            },
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
        <SidebarContent sidebarView={SIDEBAR_VIEW_METADATA} title={intl.formatMessage(messages.docgenTags)}>
            <div className={classNames('docgen-sidebar', { center: hasNoTags || hasError || loading })}>
                {!!hasError && <Error onClick={loadTags} />}
                {!hasError && loading && <LoadingIndicator className="docgen-loading" />}
                {!hasError && !loading && (
                    <>
                        {hasNoTags ? (
                            <NoTagsAvailable />
                        ) : (
                            <>
                                <TagsSection message={messages.textTags} data={sidebarState.jsonPaths.textTree} />
                                <TagsSection message={messages.imageTags} data={sidebarState.jsonPaths.imageTree} />
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
