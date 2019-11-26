/**
 * @flow
 * @file Skills sidebar component
 * @author Box
 */

import * as React from 'react';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import API from '../../api';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import messages from '../common/messages';
import SidebarContent from './SidebarContent';
import SidebarSkills from './skills/SidebarSkills';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import {
    FIELD_PERMISSIONS_CAN_UPLOAD,
    SKILLS_TRANSCRIPT,
    ORIGIN_SKILLS_SIDEBAR,
    SIDEBAR_VIEW_SKILLS,
} from '../../constants';
import type { WithLoggerProps } from '../../common/types/logging';
import type { SkillCardEntry, SkillCard } from '../../common/types/skills';
import './SkillsSidebar.scss';

type PropsWithoutContext = {
    elementId: string,
    file: BoxItem,
    getPreview: Function,
    getViewer: Function,
    refreshIdentity?: boolean,
};

type Props = {
    api: API,
} & PropsWithoutContext &
    WithLoggerProps;

type State = {
    cards?: Array<SkillCard>,
    errors: NumberBooleanMap,
};

const MARK_NAME_JS_READY = `${ORIGIN_SKILLS_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

class SkillsSidebar extends React.PureComponent<Props, State> {
    state: State = {
        errors: {},
    };

    constructor(props: Props) {
        super(props);
        const { logger } = this.props;
        logger.onReadyMetric({
            endMarkName: MARK_NAME_JS_READY,
        });
    }

    componentDidMount() {
        const { api, file }: Props = this.props;
        api.getMetadataAPI(false).getSkills(file, this.fetchSkillsSuccessCallback, noop);
    }

    componentDidUpdate({ refreshIdentity: prevRefreshIdentity }: Props) {
        const { api, file, refreshIdentity }: Props = this.props;

        if (refreshIdentity !== prevRefreshIdentity) {
            api.getMetadataAPI(false).getSkills(file, this.fetchSkillsSuccessCallback, noop);
        }
    }

    /**
     * Handles skills fetch success
     *
     * @private
     * @param {Array<SkillCard>} cards - Skills cards
     * @return {void}
     */
    fetchSkillsSuccessCallback = (cards: Array<SkillCard>) => {
        this.updatePreviewTranscript(cards);
        this.setState({ cards });
    };

    /**
     * Updates Preview with transcript data
     *
     * @private
     * @param {Array<SkillCard>} cards - Skills cards
     * @return {void}
     */
    updatePreviewTranscript = (cards: Array<SkillCard>): void => {
        const { getPreview, getViewer } = this.props;
        const preview = getPreview ? getPreview() : null;
        const viewer = getViewer ? getViewer() : null;
        const transcriptCard = cards.find(card => card.skill_card_type === SKILLS_TRANSCRIPT);
        if (!transcriptCard || !preview) {
            return;
        }

        if (!viewer) {
            preview.addListener('load', ({ viewer: loadedViewer }) => {
                if (typeof loadedViewer.loadAutoGeneratedCaptions === 'function') {
                    loadedViewer.loadAutoGeneratedCaptions(transcriptCard);
                }
            });
        } else if (typeof viewer.loadAutoGeneratedCaptions === 'function') {
            viewer.loadAutoGeneratedCaptions(transcriptCard);
        }
    };

    /**
     * Success handler for save
     *
     * @private
     * @param {Array} updatedCards - updated skill cards
     * @param {number} index - index of the card being edited
     * @return {void}
     */
    onSaveSuccessHandler = (index: number, updatedCards: Array<SkillCard>): void => {
        const { errors }: State = this.state;
        const clone = { ...errors };
        delete clone[index];
        this.updatePreviewTranscript(updatedCards);
        this.setState({ cards: updatedCards, errors: clone });
    };

    /**
     * Error handler for save
     *
     * @private
     * @param {number} index - index of the card being edited
     * @return {void}
     */
    onSaveErrorHandler = (index: number): void => {
        const { errors }: State = this.state;
        const clone = { ...errors };
        clone[index] = true;
        this.setState({ errors: clone });
    };

    /**
     * Updates skill metadata
     *
     * @private
     * @param {number} index - index of the card being edited
     * @param {Array} removes - entries to remove
     * @param {Array} adds - entries to add
     * @param {Array} replaces - entries to replace
     * @return {void}
     */
    onSave = (
        index: number,
        removes: Array<SkillCardEntry> = [],
        adds: Array<SkillCardEntry> = [],
        replaces: Array<{
            replaced: SkillCardEntry,
            replacement: SkillCardEntry,
        }> = [],
    ): void => {
        const { api, file }: Props = this.props;
        const { cards = [] }: State = this.state;
        const card = cards[index];
        const path = `/cards/${index}`;
        const ops: JSONPatchOperations = [];
        const canEdit = getProp(file, FIELD_PERMISSIONS_CAN_UPLOAD, false);

        if (!canEdit || !card) {
            return;
        }

        if (Array.isArray(replaces)) {
            replaces.forEach(({ replaced, replacement }) => {
                const idx = card.entries.findIndex(entry => entry === replaced);
                if (idx > -1) {
                    ops.push({
                        op: 'replace',
                        path: `${path}/entries/${idx}`,
                        value: replacement,
                    });
                }
            });
        }

        if (Array.isArray(removes)) {
            const deletes = [];
            removes.forEach(removed => {
                const idx = card.entries.findIndex(entry => entry === removed);
                if (idx > -1) {
                    deletes.push(idx);
                }
            });
            // To maintain metadata index positions, removes should be
            // done is reverse order with largest index being removed first.
            // Remove operations are atomic and don't happen in batch.
            deletes
                .sort((a, b) => b - a) // number sort in descending order
                .forEach(idx => {
                    ops.push({
                        op: 'remove',
                        path: `${path}/entries/${idx}`,
                    });
                });
        }

        if (Array.isArray(adds)) {
            adds.forEach(added => {
                ops.push({
                    op: 'add',
                    path: `${path}/entries/-`,
                    value: added,
                });
            });
        }

        // If no ops, don't proceed
        if (ops.length === 0) {
            return;
        }

        // Add test ops before any other ops
        ops.splice(0, 0, {
            op: 'test',
            path,
            value: card,
        });

        api.getMetadataAPI(false).updateSkills(
            file,
            ops,
            (updatedCards: Array<SkillCard>) => {
                this.onSaveSuccessHandler(index, updatedCards);
            },
            () => {
                this.onSaveErrorHandler(index);
            },
        );
    };

    render() {
        const { file, getViewer, elementId }: Props = this.props;
        const { cards, errors }: State = this.state;

        return (
            <SidebarContent
                className="bcs-skills"
                elementId={elementId}
                sidebarView={SIDEBAR_VIEW_SKILLS}
                title={<FormattedMessage {...messages.sidebarSkillsTitle} />}
            >
                {cards ? (
                    <SidebarSkills
                        cards={cards}
                        errors={errors}
                        file={file}
                        getViewer={getViewer}
                        onSkillChange={this.onSave}
                    />
                ) : (
                    <LoadingIndicator />
                )}
            </SidebarContent>
        );
    }
}

export { SkillsSidebar as SkillsSidebarComponent };
export default flow([withLogger(ORIGIN_SKILLS_SIDEBAR), withErrorBoundary(ORIGIN_SKILLS_SIDEBAR), withAPIContext])(
    SkillsSidebar,
);
