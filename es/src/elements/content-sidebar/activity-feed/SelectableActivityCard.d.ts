/// <reference types="react" />
import { Props as ActivityCardProps } from './ActivityCard';
import './SelectableActivityCard.scss';
export type Props = {
    isDisabled?: boolean;
    onSelect: () => void;
} & ActivityCardProps;
declare const SelectableActivityCard: ({ children, className, isDisabled, onSelect, ...rest }: Props) => JSX.Element;
export default SelectableActivityCard;
