import * as React from 'react';
import classNames from 'classnames';
import flow from 'lodash/flow';
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

type TagState = {
    text: DocGenTag[];
    image: DocGenTag[];
};

type JsonPathsState = {
    textTree: JsonPathsMap;
    imageTree: JsonPathsMap;
};

const isJsonPathsMap = (obj: object): obj is JsonPathsMap => {
    return typeof obj === 'object' && obj !== null;
};

const DocGenSidebar = ({ intl, getDocGenTags }: Props) => {
    const [hasError, setHasError] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [tags, setTags] = React.useState<TagState>({
        text: [],
        image: [],
    });
    const [jsonPaths, setJsonPaths] = React.useState<JsonPathsState>({
        textTree: {},
        imageTree: {},
    });

    const tagsToJsonPaths = (docgenTags: DocGenTag[]): JsonPathsMap => {
        const jsonPathsMap: JsonPathsMap = {};
        docgenTags.forEach(tag => {
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

    const loadTags = async () => {
        setLoading(true);
        try {
            const response: DocGenTemplateTagsResponse = await getDocGenTags();
            if (response && !!response.data) {
                // anything that is not an image tag for this view is treated as a text tag
                const textTags = response?.data?.filter(tag => tag.tag_type !== 'image') || [];
                const imageTags = response?.data?.filter(tag => tag.tag_type === 'image') || [];
                setTags({
                    text: textTags,
                    image: imageTags,
                });
                setLoading(false);
                setJsonPaths({
                    textTree: tagsToJsonPaths(textTags),
                    imageTree: tagsToJsonPaths(imageTags),
                });
            } else {
                setLoading(false);
                setHasError(true);
            }
        } catch (error) {
            setLoading(false);
            setHasError(true);
        }
    };

    React.useEffect(() => {
        loadTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const hasNoTags = tags.image.length + tags.text.length === 0;

    return (
        <SidebarContent sidebarView={SIDEBAR_VIEW_METADATA} title={intl.formatMessage(messages.docgenTags)}>
            <div className={classNames('bcs-DocGenSidebar', { center: hasNoTags || hasError || loading })}>
                {hasError && <Error onClick={loadTags} />}
                {!hasError && loading && <LoadingIndicator className="bcs-DocGenSidebar-loading" />}
                {!hasError && !loading && (
                    <>
                        {hasNoTags ? (
                            <NoTagsAvailable />
                        ) : (
                            <>
                                <TagsSection message={messages.textTags} data={jsonPaths.textTree} />
                                <TagsSection message={messages.imageTags} data={jsonPaths.imageTree} />
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
