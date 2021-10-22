import Pikaday, { PikadayOptions } from 'pikaday';

export interface AccessiblePikadayOptions extends PikadayOptions {
    accessibleField?: HTMLElement | null;
}

// An extended version of Pikaday to work when `isAccessible` prop is `true`. https://jira.inside-box.net/browse/A11Y-213
class AccessiblePikaday extends Pikaday {
    accessibleField: HTMLElement | null | undefined;

    constructor(options: AccessiblePikadayOptions) {
        super(options);
        this.accessibleField = options.accessibleField;

        // Override behavior as if `options.field` and `options.bound` were set.
        // See https://github.com/Pikaday/Pikaday/blob/master/pikaday.js#L671
        //     https://github.com/Pikaday/Pikaday/blob/master/pikaday.js#L695-L703
        if (this.accessibleField) {
            document.body.appendChild(this.el);

            this.accessibleField.addEventListener('click', this.handleClick);
            this.accessibleField.addEventListener('focus', this.handleFocus);
            this.accessibleField.addEventListener('blur', this.handleBlur);

            this.hide();
        }
    }

    handleClick = () => {
        this.show();
    };

    handleFocus = () => {
        this.show();
    };

    handleBlur = () => {
        // TODO: Test in IE11
        this.hide();
    };

    handleClickOutside = (e: MouseEvent) => {
        if (this.isVisible() && !this.el.contains(e.target as HTMLElement)) {
            this.hide();
        }
    };

    show() {
        super.show();
        if (this.accessibleField) {
            document.addEventListener('click', this.handleClickOutside, true);
            this.adjustPosition();
        }
    }

    hide() {
        super.hide();
        if (this.accessibleField) {
            document.removeEventListener('click', this.handleClickOutside);
        }
    }

    destroy() {
        super.destroy();
        if (this.accessibleField) {
            this.accessibleField.removeEventListener('click', this.handleClick);
            this.accessibleField.removeEventListener('focus', this.handleFocus);
            this.accessibleField.removeEventListener('blur', this.handleBlur);
        }
    }
}

export default AccessiblePikaday;
