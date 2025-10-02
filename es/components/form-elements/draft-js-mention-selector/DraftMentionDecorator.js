import { CompositeDecorator } from 'draft-js';
import DraftMentionItem from './DraftMentionItem';
const mentionStrategy = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    const ret = entityKey !== null && contentState.getEntity(entityKey).getType() === 'MENTION';
    return ret;
  }, callback);
};
const DraftMentionDecorator = new CompositeDecorator([{
  strategy: mentionStrategy,
  component: DraftMentionItem
}]);
export default DraftMentionDecorator;
//# sourceMappingURL=DraftMentionDecorator.js.map