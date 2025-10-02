import Pikaday, { PikadayOptions } from 'pikaday';
export interface AccessiblePikadayOptions extends PikadayOptions {
    accessibleFieldEl?: HTMLElement | null | undefined;
    datePickerButtonEl?: HTMLElement | null | undefined;
}
declare class AccessiblePikaday extends Pikaday {
    accessibleFieldEl: HTMLElement | null | undefined;
    datePickerButtonEl: HTMLElement | null | undefined;
    constructor(options: AccessiblePikadayOptions);
    handleBlur: () => void;
    handleClickOutside: (event: MouseEvent) => void;
    show(): void;
    hide(): void;
    destroy(): void;
}
export default AccessiblePikaday;
