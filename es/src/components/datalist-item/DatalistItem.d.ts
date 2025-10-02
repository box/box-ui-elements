import * as React from 'react';
import './DatalistItem.scss';
export interface DatalistItemProps {
    /** Content to render in the list item */
    children: React.ReactNode;
    /** CSS class for the list item */
    className?: string;
    /** Set by a parent datalist component to indicate when the item is highlighted (but not necessarily selected) */
    isActive?: boolean;
    /** Set by a parent datalist component to indicate when the item is selected */
    isSelected?: boolean;
    /** Set by a parent datalist component to receive the updated active item ID */
    setActiveItemID?: (id: string) => void;
}
declare class DatalistItem extends React.Component<DatalistItemProps> {
    constructor(props: DatalistItemProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: DatalistItemProps): void;
    setActiveItemID: () => void;
    id: string;
    render(): React.JSX.Element;
}
export default DatalistItem;
