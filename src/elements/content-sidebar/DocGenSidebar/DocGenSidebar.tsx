import * as React from 'react';
import classNames from 'classnames';
import flow from 'lodash/flow';
import { useIntl } from 'react-intl';

import { LoadingIndicator } from '@box/blueprint-web';

// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { ORIGIN_DOCGEN_SIDEBAR, SIDEBAR_VIEW_DOCGEN } from '../../../constants';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { withAPIContext } from '../../common/api-context';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { withErrorBoundary } from '../../common/error-boundary';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { withLogger } from '../../common/logger';
import Error from './Error';
import EmptyTags from './EmptyTags';
// @ts-ignore: no ts definition
import SidebarContent from '../SidebarContent';
import TagsSection from './TagsSection';
// @ts-ignore: no ts definition
import messages from './messages';
// @ts-ignore: no ts definition
import { ErrorContextProps } from '../../../common/types/api';
// @ts-ignore: no ts definition
import { WithLoggerProps } from '../../../common/types/logging';
import commonMessages from '../../common/messages';

import './DocGenSidebar.scss';
import { DocGenTag, DocGenTemplateTagsResponse, JsonPathsMap } from './types';

type ExternalProps = {
    enabled: boolean;
    getDocGenTags: () => Promise<DocGenTemplateTagsResponse>;
    isDocgenTemplate: boolean;
    checkDocGenTemplate: void;
};

type Props = ExternalProps & ErrorContextProps & WithLoggerProps;

type TagState = {
    text: DocGenTag[];
    image: DocGenTag[];
};

type JsonPathsState = {
    textTree: JsonPathsMap;
    imageTree: JsonPathsMap;
};

const DocGenSidebar = ({ getDocGenTags }: Props) => {
    const { formatMessage } = useIntl();

    const [hasError, setHasError] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [tags, setTags] = React.useState<TagState>({
        text: [],
        image: [],
    });
    const [jsonPaths, setJsonPaths] = React.useState<JsonPathsState>({
        textTree: {},
        imageTree: {},
    });

    const createNestedObject = (base: JsonPathsMap, paths: string[]) => {
        paths.reduce((obj, path) => {
            if (!obj[path]) obj[path] = {};
            return obj[path];
        }, base);
    };

    const tagsToJsonPaths = (docGenTags: DocGenTag[]): JsonPathsMap => {
        const jsonPathsMap: JsonPathsMap = {};

        docGenTags.forEach(tag => {
            tag.json_paths.forEach(jsonPath => {
                const paths = jsonPath.split('.');
                createNestedObject(jsonPathsMap, paths);
            });
        });

        return jsonPathsMap;
    };

    const loadTags = async () => {
        setIsLoading(true);
        try {
            const response: DocGenTemplateTagsResponse = await getDocGenTags();
            if (response && !!response.data) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const { data } = response || [];

                // anything that is not an image tag for this view is treated as a text tag
                const textTags = data?.filter(tag => tag.tag_type !== 'image') || [];
                const imageTags = data?.filter(tag => tag.tag_type === 'image') || [];
                setTags({
                    text: textTags,
                    image: imageTags,
                });
                setJsonPaths({
                    textTree: tagsToJsonPaths(textTags),
                    imageTree: tagsToJsonPaths(imageTags),
                });
                setHasError(false);
            } else {
                setHasError(true);
            }
        } catch (error) {
            setHasError(true);
        }
        setIsLoading(false);
    };

    React.useEffect(() => {
        loadTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isEmpty = tags.image.length + tags.text.length === 0;

    return (
        <SidebarContent sidebarView={SIDEBAR_VIEW_DOCGEN} title={formatMessage(messages.docGenTags)}>
            <div className={classNames('bcs-DocGenSidebar', { center: isEmpty || hasError || isLoading })}>
                {hasError && <Error onClick={loadTags} />}
                {isLoading && (
                    <LoadingIndicator
                        aria-label={formatMessage(commonMessages.loading)}
                        className="bcs-DocGenSidebar-loading"
                    />
                )}
                {!hasError && !isLoading && isEmpty && <EmptyTags />}
                {!hasError && !isLoading && !isEmpty && (
                    <>
                        <TagsSection message={messages.textTags} data={jsonPaths.textTree} />
                        <TagsSection message={messages.imageTags} data={jsonPaths.imageTree} />
                    </>
                )}
            </div>
        </SidebarContent>
    );
};

export type DocGenSidebarProps = ExternalProps;
export { DocGenSidebar as DocGenSidebarComponent };
export default flow([withLogger(ORIGIN_DOCGEN_SIDEBAR), withErrorBoundary(ORIGIN_DOCGEN_SIDEBAR), withAPIContext])(
    DocGenSidebar,
);
