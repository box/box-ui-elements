import { Record } from 'immutable';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import * as React from 'react';

export interface HotkeyConfig {
    /** Optional description shown in the help modal */
    description?: React.ReactNode | null;
    /** Handler invoked when the hotkey is pressed */
    handler: (event: KeyboardEvent, combo?: string) => void;
    /** Key or keys that trigger the handler */
    key: string | string[];
    /** Category used to group hotkeys in the help modal */
    type?: string;
}

const HotkeyRecord = Record({
    description: null as React.ReactNode | null,
    handler: noop as HotkeyConfig['handler'],
    key: '' as string | string[],
    type: undefined as string | undefined,
});

const HotkeyPropType = PropTypes.shape({
    description: PropTypes.node,
    handler: PropTypes.func.isRequired,
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
    type: PropTypes.string,
});

export { HotkeyPropType };
export default HotkeyRecord;
