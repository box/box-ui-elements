import { CompositeDecorator, ContentBlock, ContentState } from 'draft-js';

import DraftMentionItem from './DraftMentionItem';

const mentionStrategy = (
    contentBlock: ContentBlock,
    callback: (start: number, end: number) => void,
    contentState: ContentState,
) => {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();

        const ret = entityKey !== null && contentState.getEntity(entityKey).getType() === 'MENTION';
        return ret;
    }, callback);
};

const DraftMentionDecorator = new CompositeDecorator([
    {
        strategy: mentionStrategy,
        component: DraftMentionItem,
    },
]);

export default DraftMentionDecorator;
