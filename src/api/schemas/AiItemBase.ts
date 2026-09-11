/**
 * @author Box
 */

export type AiItemBaseTypeField = 'file';

export interface AiItemBase {
    /**
     * The ID of the item.
     */
    readonly id: string;
    /**
     * The type of the item.
     */
    readonly type: AiItemBaseTypeField;
    /**
     * The content of the item, often the text representation.
     */
    readonly content?: string;
}
