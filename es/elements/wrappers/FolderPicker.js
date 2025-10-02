/**
 * 
 * @file Main entry point for the Folder Picker ES6 wrapper
 * @author Box
 */

import ContentPicker from './ContentPicker';
import { TYPE_FOLDER, CLIENT_NAME_FOLDER_PICKER } from '../../constants';
class FolderPicker extends ContentPicker {
  /** @inheritdoc */
  getType() {
    return TYPE_FOLDER;
  }

  /** @inheritdoc */
  getClientName() {
    return CLIENT_NAME_FOLDER_PICKER;
  }
}
export default FolderPicker;
//# sourceMappingURL=FolderPicker.js.map