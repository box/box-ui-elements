/**
 * 
 * @file Helper functions for keyboard events
 * @author Box
 */

/**
 * Function to decode key events into keys.
 * Works for both React synthetic and native events.
 *
 * Will output in the format Shift+I, Control+I...
 * Will outpur Space for spacebar.
 * Will return empty string for modifiers only.
 *
 * @public
 * @param {Event} event - Keyboard event
 * @return {string} Decoded keydown key or empty string
 */
function decode(event) {
  let modifier = '';

  // KeyboardEvent.key is the new spec supported in Chrome, Firefox and IE.
  // KeyboardEvent.keyIdentifier is the old spec supported in Safari.
  // Priority is given to the new spec.
  // $FlowFixMe
  const {
    keyIdentifier
  } = event;
  let key = event.key || keyIdentifier || '';

  // Get the modifiers on their own
  if (event.ctrlKey) {
    modifier = 'Control';
  } else if (event.shiftKey) {
    modifier = 'Shift';
  } else if (event.metaKey) {
    modifier = 'Meta';
  }

  // The key and keyIdentifier specs also include modifiers.
  // Since we are manually getting the modifiers above we do
  // not want to trap them again here.
  if (key === modifier) {
    key = '';
  }

  // keyIdentifier spec returns UTF8 char codes
  // Need to convert them back to ascii.
  if (key.indexOf('U+') === 0) {
    if (key === 'U+001B') {
      key = 'Escape';
    } else {
      key = String.fromCharCode(Number(key.replace('U+', '0x')));
    }
  }

  // If nothing was pressed or we evaluated to nothing, just return
  if (!key) {
    return '';
  }

  // Special casing for space bar
  if (key === ' ') {
    key = 'Space';
  }

  // Edge bug which outputs "Esc" instead of "Escape"
  // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5290772/
  if (key === 'Esc') {
    key = 'Escape';
  }

  // keyIdentifier spec does not prefix the word Arrow.
  // Newer key spec does it automatically.
  if (key === 'Right' || key === 'Left' || key === 'Down' || key === 'Up') {
    key = `Arrow${key}`;
  }
  if (modifier) {
    modifier += '+';
  }
  return modifier + key;
}
export { decode }; // eslint-disable-line
//# sourceMappingURL=keys.js.map