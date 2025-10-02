function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Folder upload bootstrapping
 * @author Box
 */

import { getEntryFromDataTransferItem, getFile, getFileAPIOptions, getDataTransferItem, getDataTransferItemAPIOptions } from '../../utils/uploads';
import FolderUploadNode from './FolderUploadNode';
const PATH_DELIMITER = '/';
class FolderUpload {
  /**
   * [constructor]
   *
   * @param {Function} addFilesToUploadQueue
   * @param {string} destinationFolderId
   * @param {Function} addFolderToUploadQueue
   * @param {Object} baseAPIOptions
   * @return {void}
   */
  constructor(addFilesToUploadQueue, destinationFolderId, addFolderToUploadQueue, baseAPIOptions) {
    _defineProperty(this, "files", []);
    this.addFilesToUploadQueue = addFilesToUploadQueue;
    this.destinationFolderId = destinationFolderId;
    this.addFolderToUploadQueue = addFolderToUploadQueue;
    this.baseAPIOptions = baseAPIOptions;
  }

  /**
   * Create a folder tree from fileList wekbkitRelativePath
   *
   * @public
   * @param  {Array} Array<UploadFileWithAPIOptions | UploadFile> | FileList
   * @returns {void}
   */
  buildFolderTreeFromWebkitRelativePath(fileList) {
    Array.from(fileList).forEach(fileData => {
      const file = getFile(fileData);
      const {
        webkitRelativePath
      } = file;
      if (!webkitRelativePath) {
        return;
      }
      const fileAPIOptions = getFileAPIOptions(fileData);
      const pathArray = webkitRelativePath.split(PATH_DELIMITER).slice(0, -1);
      if (pathArray.length <= 0) {
        return;
      }

      // Since only 1 folder tree can be uploaded a time with using webkitRelativePath, the root folder name
      // of all the files should be the same.
      if (!this.folder) {
        const rootFolderName = pathArray[0];
        this.folder = this.createFolderUploadNode(rootFolderName, fileAPIOptions);
      }

      // Add file to the root folder
      if (pathArray.length === 1) {
        this.folder.files.push(file);
      }
      let subTree = this.folder.folders;
      // Walk the path after the root folder
      const pathArryAfterRoot = pathArray.slice(1);
      pathArryAfterRoot.forEach((folderName, index) => {
        // Create new child folder
        if (!subTree[folderName]) {
          subTree[folderName] = this.createFolderUploadNode(folderName, fileAPIOptions);
        }
        if (index === pathArryAfterRoot.length - 1) {
          // end of path, push the file
          subTree[folderName].files.push(file);
        } else {
          // walk the tree
          subTree = subTree[folderName].folders;
        }
      });
    });
  }

  /**
   * Build folder tree from dataTransferItem, which can only represent 1 folder tree
   *
   * @param {DataTransferItem | UploadDataTransferItemWithAPIOptions} dataTransferItem
   * @returns {void}
   */
  buildFolderTreeFromDataTransferItem(dataTransferItem) {
    const item = getDataTransferItem(dataTransferItem);
    const apiOptions = getDataTransferItemAPIOptions(dataTransferItem);
    const entry = getEntryFromDataTransferItem(item);
    const {
      name
    } = entry;
    this.folder = this.createFolderUploadNode(name, apiOptions, entry);
  }

  /**
   * Create a FolderUploadNode instance
   *
   * @param {string} name
   * @param {Object} apiOptions
   * @param {FileSystemFileEntry} [entry]
   * @returns {FolderUploadNode}
   */
  createFolderUploadNode(name, apiOptions, entry) {
    return new FolderUploadNode(name, this.addFilesToUploadQueue, this.addFolderToUploadQueue, apiOptions, _objectSpread(_objectSpread({}, this.baseAPIOptions), apiOptions), entry);
  }

  /**
   * Upload folders
   *
   * @public
   * @param {Object} Options
   * @param {Function} options.errorCallback
   * @returns {Promise<any>}
   */
  async upload({
    errorCallback,
    successCallback
  }) {
    await this.folder.upload(this.destinationFolderId, errorCallback, true);
    // If the folder upload failed then a folderID will not be set
    const newFolderId = this.folder.getFolderId();
    if (newFolderId) {
      successCallback([{
        id: newFolderId
      }]);
    }
  }

  /**
   * Noop cancel
   *
   * @public
   */
  cancel() {}
}
export default FolderUpload;
//# sourceMappingURL=FolderUpload.js.map