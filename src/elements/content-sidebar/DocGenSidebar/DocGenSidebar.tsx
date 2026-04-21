import React, { useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import flow from 'lodash/flow';
import { useIntl, type MessageDescriptor } from 'react-intl';

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
import type { DocGenTag, DocGenTemplateTagsResponse, JsonPathsMap } from './types';
import { PDF_FIELD_TAG_TYPES, isPdfFormFieldTagType } from './types';

const DEFAULT_RETRIES = 10;

type DocGenSection = {
    id: string;
    message: MessageDescriptor;
    tree: JsonPathsMap;
};

const PDF_FIELD_TYPE_MESSAGES: Record<(typeof PDF_FIELD_TAG_TYPES)[number], MessageDescriptor> = {
    checkbox: messages.checkboxTags,
    radiobutton: messages.radiobuttonTags,
    dropdown: messages.dropdownTags,
};

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

const buildDocGenSections = (data: DocGenTag[]): DocGenSection[] => {
    const result: DocGenSection[] = [];
    const imageTags = data.filter(tag => tag.tag_type === 'image');
    const textTags = data.filter(tag => tag.tag_type !== 'image' && !isPdfFormFieldTagType(tag.tag_type));

    if (textTags.length > 0) {
        result.push({
            id: 'text',
            message: messages.textTags,
            tree: tagsToJsonPaths(textTags),
        });
    }

    if (imageTags.length > 0) {
        result.push({
            id: 'image',
            message: messages.imageTags,
            tree: tagsToJsonPaths(imageTags),
        });
    }

    PDF_FIELD_TAG_TYPES.forEach(fieldType => {
        const fieldTags = data.filter(tag => tag.tag_type === fieldType);
        if (fieldTags.length > 0) {
            result.push({
                id: fieldType,
                message: PDF_FIELD_TYPE_MESSAGES[fieldType],
                tree: tagsToJsonPaths(fieldTags),
            });
        }
    });

    return result;
};

type ExternalProps = {
    enabled: boolean;
    getDocGenTags: () => Promise<DocGenTemplateTagsResponse>;
    isDocgenTemplate: boolean;
    checkDocGenTemplate: void;
};

type Props = ExternalProps & ErrorContextProps & WithLoggerProps;

const DocGenSidebar = ({ getDocGenTags }: Props) => {
    const { formatMessage } = useIntl();

    const [hasError, setHasError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sections, setSections] = useState<DocGenSection[]>([]);

    const loadTags = useCallback(
        async (attempts = DEFAULT_RETRIES) => {
            if (attempts <= 0) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const response: DocGenTemplateTagsResponse = await getDocGenTags();
                if (response?.message) {
                    loadTags.call(this, attempts - 1);
                } else if (response?.data) {
                    const { data } = response;
                    setSections(buildDocGenSections(data));
                    setHasError(false);
                    setIsLoading(false);
                } else {
                    setHasError(true);
                    setIsLoading(false);
                }
            } catch (error) {
                setHasError(true);
                setIsLoading(false);
            }
        },
        // disabling eslint because the getDocGenTags prop is changing very frequently
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    useEffect(() => {
        loadTags(DEFAULT_RETRIES);
    }, [loadTags]);

    const isEmpty = sections.length === 0;

    return (
        <SidebarContent sidebarView={SIDEBAR_VIEW_DOCGEN} title={formatMessage(messages.docGenTags)}>
            <div className={classNames('bcs-DocGenSidebar', { center: isEmpty || hasError || isLoading })}>
                {hasError && <Error onClick={() => loadTags(DEFAULT_RETRIES)} />}
                {isLoading && (
                    <LoadingIndicator
                        aria-label={formatMessage(commonMessages.loading)}
                        className="bcs-DocGenSidebar-loading"
                    />
                )}
                {!hasError && !isLoading && isEmpty && <EmptyTags />}
                {!hasError && !isLoading && !isEmpty && (
                    <>
                        {sections.map(section => (
                            <TagsSection key={section.id} message={section.message} data={section.tree} />
                        ))}
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
