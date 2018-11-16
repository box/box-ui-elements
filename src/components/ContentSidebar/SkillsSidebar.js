/**
 * @flow
 * @file Skills sidebar component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import { SKILLS_TRANSCRIPT, ERROR_TYPE_CONTENT_SIDEBAR } from '../../constants';
import messages from '../messages';
import SidebarContent from './SidebarContent';
import { withAPIContext } from '../APIContext';
import { withErrorBoundary } from '../ErrorBoundary';
import SidebarSkills from './Skills/SidebarSkills';
import API from '../../api';

type PropsWithoutContext = {
    file: BoxItem,
    getPreview: Function,
    getViewer: Function,
};

type Props = {
    api: API,
} & PropsWithoutContext;

type State = {
    cards?: Array<SkillCard>,
    errors: NumberBooleanMap,
};

class SkillsSidebar extends React.PureComponent<Props, State> {
    state: State = {
        errors: {},
    };

    componentDidMount() {
        const { api, file }: Props = this.props;
        api.getMetadataAPI(false).getSkills(
            file,
            (cards: Array<SkillCard>) => {
                this.updatePreviewTranscript(cards);
                this.setState({ cards });
            },
            noop,
        );
    }

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
     * Updates skill metadata
     *
     * @private
     * @param {string} id - File id
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
        const { cards = [], errors }: State = this.state;
        const { permissions = {} }: BoxItem = file;
        const card = cards[index];
        const path = `/cards/${index}`;
        const ops: JsonPatchData = [];

        if (!permissions.can_upload || !card) {
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
            deletes
                .sort()
                .reverse()
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
                const clone = { ...errors };
                delete clone[index];
                this.updatePreviewTranscript(updatedCards);
                this.setState({ cards: updatedCards, errors: clone });
            },
            () => {
                const clone = { ...errors };
                clone[index] = true;
                this.setState({ errors: clone });
            },
        );
    };

    render() {
        const { file, getViewer }: Props = this.props;
        const { cards, errors }: State = this.state;

        return (
            <SidebarContent title={<FormattedMessage {...messages.sidebarSkillsTitle} />}>
                {cards ? (
                    <SidebarSkills
                        file={file}
                        cards={cards}
                        errors={errors}
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
export default withErrorBoundary(ERROR_TYPE_CONTENT_SIDEBAR)(withAPIContext(SkillsSidebar));
