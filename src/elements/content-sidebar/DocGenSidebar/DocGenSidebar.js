/**
 * @flow
 * @file Doc Gen sidebar component
 * @author Box
 */

import classNames from 'classnames';
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
import Error from './Error';
import NoTagsAvailable from './NoTagsAvailable';
import SidebarContent from '../SidebarContent';
import TagsSection from './TagsSection';
import messages from './messages';

import type { ErrorContextProps } from '../../../common/types/api';
import type { WithLoggerProps } from '../../../common/types/logging';

import './DocGenSidebar.scss';

type ExternalProps = {
    enabled: boolean,
    getDocGenTags: Function,
};

type Props = {
    intl: IntlShape,
} & ExternalProps &
    ErrorContextProps &
    WithLoggerProps;

const MARK_NAME_JS_READY = `${ORIGIN_METADATA_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

const DocGenSidebar = (props: Props) => {
    const [sidebarState, setSidebarState] = React.useState({
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
                .then(response => {
                    if (response) {
                        setSidebarState({
                            ...sidebarState,
                            tags: {
                                text: response.data.filter(tag => tag.tagType === 'text'),
                                image: response.data.filter(tag => tag.tagType === 'image'),
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
                {!hasError && loading && <Loading />}
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
    flow([withLogger(ORIGIN_METADATA_SIDEBAR), withErrorBoundary(ORIGIN_METADATA_SIDEBAR), withAPIContext])(
        DocGenSidebar,
    ),
);
