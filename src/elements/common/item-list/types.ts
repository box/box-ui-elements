import type { ColumnProps } from '@box/blueprint-web';

export type ItemListColumn = Partial<ColumnProps> & {
    messageId: string;
};
