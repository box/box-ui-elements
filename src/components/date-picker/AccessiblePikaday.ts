import Pikaday, { PikadayOptions } from 'pikaday';

export interface AccessiblePikadayOptions extends PikadayOptions {
    accessibleFieldEl?: HTMLElement | null | undefined;
    datePickerButtonEl?: HTMLElement | null | undefined;
}

// An extended version of Pikaday to work when `isAccessible` prop is `true`
class AccessiblePikaday extends Pikaday {
    accessibleFieldEl: HTMLElement | null | undefined;

    datePickerButtonEl: HTMLElement | null | undefined;

    constructor(options: AccessiblePikadayOptions) {
        super(options);
        this.accessibleFieldEl = options.accessibleFieldEl;
        this.datePickerButtonEl = options.datePickerButtonEl;

        // Override behavior as if `options.field` and `options.bound` were set.
        // See https://github.com/Pikaday/Pikaday/blob/master/pikaday.js#L671
        //     https://github.com/Pikaday/Pikaday/blob/master/pikaday.js#L695-L703
        if (this.accessibleFieldEl) {
            this.el.classList.add('is-bound');
            document.body.appendChild(this.el);

            this.accessibleFieldEl.addEventListener('blur', this.handleBlur);

            this.hide();
        }
    }

    handleBlur = () => {
        this.hide();
    };

    handleClickOutside = (event: MouseEvent) => {
        if (
            this.isVisible() &&
            this.datePickerButtonEl &&
            this.datePickerButtonEl.contains(event.target as HTMLElement)
        ) {
            return;
        }

        if (this.isVisible() && !this.el.contains(event.target as HTMLElement)) {
            this.hide();

            const currentFocusEl = document.activeElement as HTMLElement;
            if (this.accessibleFieldEl && currentFocusEl && currentFocusEl.tabIndex < 0) {
                this.accessibleFieldEl.focus();
            }
        }
    };

    show() {
        super.show();
        if (this.accessibleFieldEl) {
            document.addEventListener('click', this.handleClickOutside, true);
            this.adjustPosition();
        }
    }

    hide() {
        super.hide();
        if (this.accessibleFieldEl) {
            document.removeEventListener('click', this.handleClickOutside);
        }
    }

    destroy() {
        super.destroy();
        if (this.accessibleFieldEl) {
            this.accessibleFieldEl.removeEventListener('blur', this.handleBlur);
            document.removeEventListener('click', this.handleClickOutside);
        }
    }
}

export default AccessiblePikaday;
