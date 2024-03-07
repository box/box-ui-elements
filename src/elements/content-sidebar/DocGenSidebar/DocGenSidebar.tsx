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
    getDocGenTags: Promise<DocGenTemplateTagsResponse>;
    isDocgenTemplate: boolean;
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
                paths.forEach((segment, index) => {
                    if (isJsonPathsMap(currentObject)) {
                        if (!(segment in currentObject)) {
                            (currentObject as JsonPathsMap)[segment] = {};
                        }
                        if (index === paths.length - 1) {
                            currentObject = (currentObject as JsonPathsMap)[segment];
                        } else {
                            currentObject = (currentObject as JsonPathsMap)[segment];
                        }
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
                        const dummyTags: DocGenTag[] = [
                            {
                                tag_content: '{{ isActive }}',
                                tag_type: 'text',
                                json_paths: ['isActive'],
                            },
                            {
                                tag_content: '{{ about }}',
                                tag_type: 'text',
                                json_paths: ['about', 'about.name'],
                            },
                            {
                                tag_content: '{{ phone }}',
                                tag_type: 'text',
                                json_paths: ['phone'],
                            },
                            {
                                tag_content: '{{ company }}',
                                tag_type: 'text',
                                json_paths: ['company', 'company.name'],
                            },
                            {
                                tag_content: '{{contract.customerName}}',
                                tag_type: 'text',
                                json_paths: ['contract', 'contract.customerName'],
                            },

                            {
                                tag_content: '{{contract.customerAddress.street}}',
                                tag_type: 'text',
                                json_paths: ['contract', 'contract.customerAddress', 'contract.customerAddress.street'],
                            },

                            {
                                tag_content: '{{contract.customerAddress.city}}',
                                tag_type: 'text',
                                json_paths: ['contract', 'contract.customerAddress', 'contract.customerAddress.city'],
                            },
                            {
                                tag_content: '{{if contract.country == “UK”}}',
                                tag_type: 'conditional',
                                json_paths: ['contract', 'contract.country'],
                            },
                            {
                                tag_content: '{{if contract.country == “1111” and contract.city == “London” }}',
                                tag_type: 'conditional',
                                json_paths: ['contract', 'contract.country', 'contract.city'],
                            },
                            {
                                tag_content: '{{elseif contract.country == “JAPAN” and contract.city == “Tokyo“}}',
                                tag_type: 'conditional',
                                json_paths: ['contract', 'contract.country', 'contract.city'],
                            },
                            {
                                tag_content: '{{invoice.image}}',
                                tag_type: 'image',
                                json_paths: ['invoice', 'invoice.image'],
                            },
                            {
                                tag_content: '{{item.quantity * item.price}}',
                                tag_type: 'arithmetic',
                                json_paths: ['products', 'products.quantity', 'products.price'],
                            },
                            {
                                tag_content: '{{tablerow item in products }}',
                                tag_type: 'table-loop',
                                json_paths: ['products'],
                            },
                            {
                                tag_content: '{{item.name}}',
                                tag_type: 'text',
                                json_paths: ['products', 'products.name', 'products.quantity', 'products.price'],
                            },
                            {
                                tag_content: '{{item.quantity * item.price}}',
                                tag_type: 'arithmetic',
                                json_paths: ['products', 'products.quantity', 'products.price'],
                            },
                            {
                                tag_content: '{{$sum(products.amount)}}',
                                tag_type: 'arithmetic',
                                json_paths: ['products', 'products.amount'],
                            },
                            {
                                tag_content: '{{invoice.id}}',
                                tag_type: 'text',
                                json_paths: ['invoice', 'invoice.id'],
                            },
                            {
                                tag_content: '{{invoice.date}}',
                                tag_type: 'text',
                                json_paths: ['invoice', 'invoice.date'],
                            },
                            {
                                tag_content: '{{invoice.billingAddress.street::uppercase}}',
                                tag_type: 'text',
                                json_paths: ['invoice', 'invoice.billingAddress', 'invoice.billingAddress.street'],
                            },
                            {
                                tag_content: '{{tablerow item in products }}',
                                tag_type: 'table-loop',
                                json_paths: [
                                    'products',
                                    'products.name',
                                    'products.description',
                                    'products.quantity',
                                    'products.price',
                                ],
                            },
                            {
                                tag_content: '{{item.name}}',
                                tag_type: 'text',
                                json_paths: ['products', 'products.name', 'products.quantity', 'products.price'],
                            },
                            {
                                tag_content: '{{item.quantity * item.price}}',
                                tag_type: 'arithmetic',
                                json_paths: ['products', 'products.quantity', 'products.price'],
                            },
                        ];
                        response.data = dummyTags;
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
