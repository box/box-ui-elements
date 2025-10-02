/**
 * 
 * @file Main entry point for the File Picker ES6 wrapper
 * @author Box
 */

import ContentPicker from './ContentPicker';
import { TYPE_FILE, TYPE_WEBLINK, CLIENT_NAME_FILE_PICKER } from '../../constants';
class FilePicker extends ContentPicker {
  /** @inheritdoc */
  getType() {
    return `${TYPE_FILE},${TYPE_WEBLINK}`;
  }

  /** @inheritdoc */
  getClientName() {
    return CLIENT_NAME_FILE_PICKER;
  }
}
export default FilePicker;
//# sourceMappingURL=FilePicker.js.map