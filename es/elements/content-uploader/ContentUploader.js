function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import uniqueid from 'lodash/uniqueId';
import { TooltipProvider } from '@box/blueprint-web';
import DroppableContent from './DroppableContent';
import Footer from './Footer';
import UploadsManager from './UploadsManager';
import API from '../../api';
import Browser from '../../utils/Browser';
import Internationalize from '../common/Internationalize';
import makeResponsive from '../common/makeResponsive';
import { withBlueprintModernization } from '../common/withBlueprintModernization';
import ThemingStyles from '../common/theming';
import FolderUpload from '../../api/uploads/FolderUpload';
import { getTypedFileId, getTypedFolderId } from '../../utils/file';
import { getDataTransferItemId, getFile, getFileAPIOptions, getFileFromDataTransferItem, getFileId, getDataTransferItemAPIOptions, getPackageFileFromDataTransferItem, isDataTransferItemAFolder, isDataTransferItemAPackage, isMultiputSupported } from '../../utils/uploads';
import { DEFAULT_ROOT, CLIENT_NAME_CONTENT_UPLOADER, CLIENT_VERSION, DEFAULT_HOSTNAME_API, DEFAULT_HOSTNAME_UPLOAD, ERROR_CODE_ITEM_NAME_IN_USE, ERROR_CODE_UPLOAD_FILE_LIMIT, STATUS_COMPLETE, STATUS_ERROR, STATUS_IN_PROGRESS, STATUS_PENDING, STATUS_STAGED, VIEW_ERROR, VIEW_UPLOAD_EMPTY, VIEW_UPLOAD_IN_PROGRESS, VIEW_UPLOAD_SUCCESS } from '../../constants';
import '../common/fonts.scss';
import '../common/base.scss';
const CHUNKED_UPLOAD_MIN_SIZE_BYTES = 104857600; // 100MB
const FILE_LIMIT_DEFAULT = 100; // Upload at most 100 files at once by default
const HIDE_UPLOAD_MANAGER_DELAY_MS_DEFAULT = 8000;
const EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD = 5;
const UPLOAD_CONCURRENCY = 6;
class ContentUploader extends Component {
  /**
   * [constructor]
   *
   * @return {ContentUploader}
   */
  constructor(props) {
    super(props);
    _defineProperty(this, "isAutoExpanded", false);
    /**
     * Return base API options from props
     *
     * @private
     * @returns {Object}
     */
    _defineProperty(this, "getBaseAPIOptions", () => {
      const {
        apiHost,
        clientName,
        requestInterceptor,
        responseInterceptor,
        sharedLink,
        sharedLinkPassword,
        token,
        uploadHost
      } = this.props;
      return {
        apiHost,
        clientName,
        requestInterceptor,
        responseInterceptor,
        sharedLink,
        sharedLinkPassword,
        token,
        uploadHost,
        version: CLIENT_VERSION
      };
    });
    /**
     * Given an array of files, return the files that are new to the Content Uploader
     *
     * @param {Array<UploadFileWithAPIOptions | File>} files
     */
    _defineProperty(this, "getNewFiles", files => {
      const {
        rootFolderId
      } = this.props;
      return Array.from(files).filter(file => !this.itemIdsRef.current[getFileId(file, rootFolderId)]);
    });
    /**
     * Given an array of files, return the files that are new to the Content Uploader
     *
     * @param {Array<UploadFileWithAPIOptions | File>} files
     */
    _defineProperty(this, "getNewDataTransferItems", items => {
      const {
        rootFolderId
      } = this.props;
      return Array.from(items).filter(item => !this.itemIdsRef.current[getDataTransferItemId(item, rootFolderId)]);
    });
    /**
     * Converts File API to upload items and adds to upload queue.
     *
     * @private
     * @param {Array<UploadFileWithAPIOptions | UploadFile>} files - Files to be added to upload queue
     * @param {Function} itemUpdateCallback - function to be invoked after items status are updated
     * @param {boolean} [isRelativePathIgnored] - if true webkitRelativePath property is ignored
     * @return {void}
     */
    _defineProperty(this, "addFilesToUploadQueue", (files, itemUpdateCallback, isRelativePathIgnored = false) => {
      const {
        isPrepopulateFilesEnabled,
        onBeforeUpload,
        rootFolderId
      } = this.props;
      if (!files || files.length === 0) {
        return;
      }
      const newFiles = this.getNewFiles(files);
      if (newFiles.length === 0) {
        return;
      }
      const newItemIds = {};
      newFiles.forEach(file => {
        newItemIds[getFileId(file, rootFolderId)] = true;
      });
      clearTimeout(this.resetItemsTimeout);
      const firstFile = getFile(newFiles[0]);
      const newItemIdsState = _objectSpread(_objectSpread({}, this.itemIdsRef.current), newItemIds);
      this.itemIdsRef.current = newItemIdsState;
      this.setState({
        itemIds: newItemIdsState
      }, () => {
        onBeforeUpload(newFiles);
        if (firstFile.webkitRelativePath && !isRelativePathIgnored) {
          // webkitRelativePath should be ignored when the upload destination folder is known
          this.addFilesWithRelativePathToQueue(newFiles, itemUpdateCallback);
        } else {
          this.addFilesWithoutRelativePathToQueue(newFiles, isPrepopulateFilesEnabled ? this.upload : itemUpdateCallback);
        }
      });
    });
    /**
     * Add dropped items to the upload queue
     *
     * @private
     * @param {DataTransfer} droppedItems
     * @param {Function} itemUpdateCallback
     * @returns {void}
     */
    _defineProperty(this, "addDroppedItemsToUploadQueue", (droppedItems, itemUpdateCallback) => {
      if (droppedItems.items) {
        this.addDataTransferItemsToUploadQueue(droppedItems.items, itemUpdateCallback);
      } else {
        this.addFilesToUploadQueue(Array.from(droppedItems.files), itemUpdateCallback);
      }
    });
    /**
     * Add dataTransferItems to the upload queue
     *
     * @private
     * @param {DataTransferItemList} dataTransferItems
     * @param {Function} itemUpdateCallback
     * @returns {void}
     */
    _defineProperty(this, "addDataTransferItemsToUploadQueue", (dataTransferItems, itemUpdateCallback) => {
      const {
        isFolderUploadEnabled
      } = this.props;
      if (!dataTransferItems || dataTransferItems.length === 0) {
        return;
      }
      const folderItems = [];
      const fileItems = [];
      const packageItems = [];
      Array.from(dataTransferItems).forEach(item => {
        const isDirectory = isDataTransferItemAFolder(item);
        if (Browser.isSafari() && isDataTransferItemAPackage(item)) {
          packageItems.push(item);
        } else if (isDirectory && isFolderUploadEnabled) {
          folderItems.push(item);
        } else if (!isDirectory) {
          fileItems.push(item);
        }
      });
      this.addFileDataTransferItemsToUploadQueue(fileItems, itemUpdateCallback);
      this.addPackageDataTransferItemsToUploadQueue(packageItems, itemUpdateCallback);
      this.addFolderDataTransferItemsToUploadQueue(folderItems, itemUpdateCallback);
    });
    /**
     * Add dataTransferItem of file type to the upload queue
     *
     * @private
     * @param {Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>} dataTransferItems
     * @param {Function} itemUpdateCallback
     * @returns {Promise<void>}
     */
    _defineProperty(this, "addFileDataTransferItemsToUploadQueue", async (dataTransferItems, itemUpdateCallback) => {
      const files = await Promise.all(dataTransferItems.map(item => getFileFromDataTransferItem(item)));
      this.addFilesToUploadQueue(files.filter(file => file), itemUpdateCallback);
    });
    /**
     * Add dataTransferItem of package type to the upload queue
     *
     * @private
     * @param {Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>} dataTransferItems
     * @param {Function} itemUpdateCallback
     * @returns {void}
     */
    _defineProperty(this, "addPackageDataTransferItemsToUploadQueue", (dataTransferItems, itemUpdateCallback) => {
      const packageFiles = dataTransferItems.map(item => getPackageFileFromDataTransferItem(item));
      this.addFilesToUploadQueue(packageFiles.filter(packageFile => packageFile), itemUpdateCallback);
    });
    /**
     * Add dataTransferItem of folder type to the upload queue
     *
     * @private
     * @param {Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>} dataTransferItems
     * @param {Function} itemUpdateCallback
     * @returns {void}
     */
    _defineProperty(this, "addFolderDataTransferItemsToUploadQueue", (dataTransferItems, itemUpdateCallback) => {
      const {
        rootFolderId
      } = this.props;
      if (dataTransferItems.length === 0) {
        return;
      }
      const newItems = this.getNewDataTransferItems(dataTransferItems);
      newItems.forEach(item => {
        this.itemIdsRef.current[getDataTransferItemId(item, rootFolderId)] = true;
      });
      if (newItems.length === 0) {
        return;
      }
      const fileAPIOptions = getDataTransferItemAPIOptions(newItems[0]);
      const {
        folderId = rootFolderId
      } = fileAPIOptions;
      const folderUploads = newItems.map(item => {
        const folderUpload = this.getFolderUploadAPI(folderId);
        folderUpload.buildFolderTreeFromDataTransferItem(item);
        return {
          api: folderUpload,
          extension: '',
          isFolder: true,
          name: folderUpload.folder.name,
          options: fileAPIOptions,
          progress: 0,
          size: 1,
          status: STATUS_PENDING
        };
      });
      this.addToQueue(folderUploads, itemUpdateCallback);
    });
    /**
     * Get folder upload API instance
     *
     * @private
     * @param {string} folderId
     * @return {FolderUpload}
     */
    _defineProperty(this, "getFolderUploadAPI", folderId => {
      const uploadBaseAPIOptions = this.getBaseAPIOptions();
      return new FolderUpload(this.addFilesToUploadQueue, folderId, this.addToQueue, uploadBaseAPIOptions);
    });
    /**
     * Add folder to upload queue
     *
     * @private
     * @param {FolderUpload} folderUpload
     * @param {Function} itemUpdateCallback
     * @param {Object} apiOptions
     * @return {void}
     */
    _defineProperty(this, "addFolderToUploadQueue", (folderUpload, itemUpdateCallback, apiOptions) => {
      this.addToQueue([
      // $FlowFixMe no file property
      {
        api: folderUpload,
        extension: '',
        isFolder: true,
        name: folderUpload.folder.name,
        options: apiOptions,
        progress: 0,
        size: 1,
        status: STATUS_PENDING
      }], itemUpdateCallback);
    });
    /**
     * Converts File API to upload items and adds to upload queue for files with webkitRelativePath missing or ignored.
     *
     * @private
     * @param {Array<UploadFileWithAPIOptions | File>} files - Files to be added to upload queue
     * @param {Function} itemUpdateCallback - function to be invoked after items status are updated
     * @return {void}
     */
    _defineProperty(this, "addFilesWithoutRelativePathToQueue", (files, itemUpdateCallback) => {
      const {
        rootFolderId
      } = this.props;

      // Convert files from the file API to upload items
      const newItems = files.map(file => {
        const uploadFile = getFile(file);
        const uploadAPIOptions = getFileAPIOptions(file);
        const {
          name,
          size
        } = uploadFile;

        // Extract extension or use empty string if file has no extension
        let extension = name.substr(name.lastIndexOf('.') + 1);
        if (extension.length === name.length) {
          extension = '';
        }
        const api = this.getUploadAPI(uploadFile, uploadAPIOptions);
        const uploadItem = {
          api,
          extension,
          file: uploadFile,
          name,
          progress: 0,
          size,
          status: STATUS_PENDING
        };
        if (uploadAPIOptions) {
          uploadItem.options = uploadAPIOptions;
        }
        this.itemIdsRef.current[getFileId(uploadItem, rootFolderId)] = true;
        return uploadItem;
      });
      if (newItems.length === 0) {
        return;
      }
      this.setState({
        itemIds: this.itemIdsRef.current
      });
      this.addToQueue(newItems, itemUpdateCallback);
    });
    /**
     * Add new items to the upload queue
     *
     * @private
     * @param {Array<UploadFileWithAPIOptions | File>} newItems - Files to be added to upload queue
     * @param {Function} itemUpdateCallback - function to be invoked after items status are updated
     * @return {void}
     */
    _defineProperty(this, "addToQueue", (newItems, itemUpdateCallback) => {
      const {
        fileLimit,
        useUploadsManager
      } = this.props;
      const {
        isUploadsManagerExpanded
      } = this.state;
      let updatedItems = [];
      const prevItemsNum = this.itemsRef.current.length;
      const totalNumOfItems = prevItemsNum + newItems.length;

      // Don't add more than fileLimit # of items
      if (totalNumOfItems > fileLimit) {
        updatedItems = this.itemsRef.current.concat(newItems.slice(0, fileLimit - prevItemsNum));
        this.setState({
          errorCode: ERROR_CODE_UPLOAD_FILE_LIMIT
        });
      } else {
        updatedItems = this.itemsRef.current.concat(newItems);
        this.setState({
          errorCode: ''
        });

        // If the number of items being uploaded passes the threshold, expand the upload manager
        if (prevItemsNum < EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD && totalNumOfItems >= EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD && useUploadsManager && !isUploadsManagerExpanded) {
          this.isAutoExpanded = true;
          this.expandUploadsManager();
        }
      }
      this.updateViewAndCollection(updatedItems, () => {
        if (itemUpdateCallback) {
          itemUpdateCallback();
        }
        const {
          view
        } = this.state;
        // Automatically start upload if other files are being uploaded
        if (view === VIEW_UPLOAD_IN_PROGRESS) {
          this.upload();
        }
      });
    });
    /**
     * Removes an item from the upload queue. Cancels upload if in progress.
     *
     * @param {UploadItem} item - Item to remove
     * @return {void}
     */
    _defineProperty(this, "removeFileFromUploadQueue", item => {
      const {
        onCancel,
        useUploadsManager
      } = this.props;
      // Clear any error errorCode in footer
      this.setState({
        errorCode: ''
      });
      const {
        api
      } = item;
      api.cancel();
      const itemIndex = this.itemsRef.current.indexOf(item);
      const updatedItems = this.itemsRef.current.slice(0, itemIndex).concat(this.itemsRef.current.slice(itemIndex + 1));
      onCancel([item]);
      this.updateViewAndCollection(updatedItems, () => {
        // Minimize uploads manager if there are no more items
        if (useUploadsManager && !updatedItems.length) {
          this.minimizeUploadsManager();
        }
        const {
          view
        } = this.state;
        if (view === VIEW_UPLOAD_IN_PROGRESS) {
          this.upload();
        }
      });
    });
    /**
     * Aborts uploads in progress and clears upload list.
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "cancel", () => {
      this.itemsRef.current.forEach(uploadItem => {
        const {
          api,
          status
        } = uploadItem;
        if (status === STATUS_IN_PROGRESS) {
          api.cancel();
        }
      });

      // Reset upload collection
      this.updateViewAndCollection([]);
    });
    /**
     * Uploads all items in the upload collection.
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "upload", () => {
      this.itemsRef.current.forEach(uploadItem => {
        if (uploadItem.status === STATUS_PENDING) {
          this.uploadFile(uploadItem);
        }
      });
    });
    /**
     * Handles a successful upload.
     *
     * @private
     * @param {UploadItem} item - Upload item corresponding to success event
     * @param {BoxItem[]} entries - Successfully uploaded Box File objects
     * @return {void}
     */
    _defineProperty(this, "handleUploadSuccess", (item, entries) => {
      const {
        onUpload,
        useUploadsManager
      } = this.props;
      item.progress = 100;
      if (!item.error) {
        item.status = STATUS_COMPLETE;
      }

      // Cache Box File object of successfully uploaded item
      if (entries && entries.length === 1) {
        const [boxFile] = entries;
        item.boxFile = boxFile;
      }
      const updatedItems = [...this.itemsRef.current];
      updatedItems[this.itemsRef.current.indexOf(item)] = item;

      // Broadcast that a file has been uploaded
      if (useUploadsManager) {
        onUpload(item);
        this.checkClearUploadItems();
      } else {
        onUpload(item.boxFile);
      }
      this.updateViewAndCollection(updatedItems, () => {
        const {
          view
        } = this.state;
        if (view === VIEW_UPLOAD_IN_PROGRESS) {
          this.upload();
        }
      });
    });
    _defineProperty(this, "resetUploadManagerExpandState", () => {
      this.isAutoExpanded = false;
      this.setState({
        isUploadsManagerExpanded: false
      });
    });
    /**
     * Handles an upload error.
     *
     * @private
     * @param {UploadItem} item - Upload item corresponding to error
     * @param {Error} error - Upload error
     * @return {void}
     */
    _defineProperty(this, "handleUploadError", (item, error) => {
      const {
        onError,
        useUploadsManager
      } = this.props;
      const {
        file
      } = item;
      item.status = STATUS_ERROR;
      item.error = error;
      const newItems = [...this.itemsRef.current];
      const index = newItems.findIndex(singleItem => singleItem === item);
      if (index !== -1) {
        newItems[index] = item;
      }

      // Broadcast that there was an error uploading a file
      const errorData = useUploadsManager ? {
        item,
        error
      } : {
        file,
        error
      };
      onError(errorData);
      this.updateViewAndCollection(newItems, () => {
        if (useUploadsManager) {
          this.isAutoExpanded = true;
          this.expandUploadsManager();
        }
        const {
          view
        } = this.state;
        if (view === VIEW_UPLOAD_IN_PROGRESS) {
          this.upload();
        }
      });
    });
    /**
     * Handles an upload progress event.
     *
     * @private
     * @param {UploadItem} item - Upload item corresponding to progress event
     * @param {ProgressEvent} event - Progress event
     * @return {void}
     */
    _defineProperty(this, "handleUploadProgress", (item, event) => {
      if (!event.total || item.status === STATUS_COMPLETE || item.status === STATUS_STAGED) {
        return;
      }
      item.progress = Math.min(Math.round(event.loaded / event.total * 100), 100);
      item.status = item.progress === 100 ? STATUS_STAGED : STATUS_IN_PROGRESS;
      const {
        onProgress
      } = this.props;
      onProgress(item);
      const updatedItems = [...this.itemsRef.current];
      updatedItems[this.itemsRef.current.indexOf(item)] = item;
      this.updateViewAndCollection(updatedItems);
    });
    /**
     * Updates item based on its status.
     *
     * @private
     * @param {UploadItem} item - The upload item to update
     * @return {void}
     */
    _defineProperty(this, "onClick", item => {
      const {
        chunked,
        isResumableUploadsEnabled,
        onClickCancel,
        onClickResume,
        onClickRetry
      } = this.props;
      const {
        file,
        status,
        error
      } = item;
      const isChunkedUpload = chunked && !item.isFolder && file.size > CHUNKED_UPLOAD_MIN_SIZE_BYTES && isMultiputSupported();
      const isResumable = isResumableUploadsEnabled && isChunkedUpload && item.api.sessionId;
      switch (status) {
        case STATUS_IN_PROGRESS:
        case STATUS_STAGED:
        case STATUS_COMPLETE:
        case STATUS_PENDING:
          this.removeFileFromUploadQueue(item);
          onClickCancel(item);
          break;
        case STATUS_ERROR:
          if (error?.code === ERROR_CODE_ITEM_NAME_IN_USE) {
            this.removeFileFromUploadQueue(item);
            onClickCancel(item);
          } else if (isResumable) {
            item.bytesUploadedOnLastResume = item.api.totalUploadedBytes;
            this.resumeFile(item);
            onClickResume(item);
          } else {
            this.resetFile(item);
            this.uploadFile(item);
            onClickRetry(item);
          }
          break;
        default:
          break;
      }
    });
    /**
     * Click action button for all uploads in the Uploads Manager with the given status.
     *
     * @private
     * @param {UploadStatus} - the status that items should have for their action button to be clicked
     * @return {void}
     */
    _defineProperty(this, "clickAllWithStatus", status => {
      this.itemsRef.current.forEach(item => {
        if (!status || item.status === status) {
          this.onClick(item);
        }
      });
    });
    /**
     * Expands the upload manager
     *
     * @return {void}
     */
    _defineProperty(this, "expandUploadsManager", () => {
      const {
        useUploadsManager
      } = this.props;
      if (!useUploadsManager) {
        return;
      }
      clearTimeout(this.resetItemsTimeout);
      this.setState({
        isUploadsManagerExpanded: true
      });
    });
    /**
     * Minimizes the upload manager
     *
     * @return {void}
     */
    _defineProperty(this, "minimizeUploadsManager", () => {
      const {
        onMinimize,
        useUploadsManager
      } = this.props;
      if (!useUploadsManager || !onMinimize) {
        return;
      }
      clearTimeout(this.resetItemsTimeout);
      onMinimize();
      this.resetUploadManagerExpandState();
      this.checkClearUploadItems();
    });
    /**
     * Checks if the upload items should be cleared after a timeout
     *
     * @return {void}
     */
    _defineProperty(this, "checkClearUploadItems", () => {
      this.resetItemsTimeout = setTimeout(this.resetUploadsManagerItemsWhenUploadsComplete, HIDE_UPLOAD_MANAGER_DELAY_MS_DEFAULT);
    });
    /**
     * Toggles the upload manager
     *
     * @return {void}
     */
    _defineProperty(this, "toggleUploadsManager", () => {
      const {
        isUploadsManagerExpanded
      } = this.state;
      if (isUploadsManagerExpanded) {
        this.minimizeUploadsManager();
      } else {
        this.expandUploadsManager();
      }
    });
    /**
     * Empties the items queue
     *
     * @return {void}
     */
    _defineProperty(this, "resetUploadsManagerItemsWhenUploadsComplete", () => {
      const {
        onCancel,
        useUploadsManager
      } = this.props;
      const {
        isUploadsManagerExpanded,
        view
      } = this.state;

      // Do not reset items when upload manger is expanded or there're uploads in progress
      if (isUploadsManagerExpanded && useUploadsManager && !!this.itemsRef.current.length || view === VIEW_UPLOAD_IN_PROGRESS) {
        return;
      }
      onCancel(this.itemsRef.current);
      this.itemsRef.current = [];
      this.itemIdsRef.current = {};
      this.setState({
        items: [],
        itemIds: {}
      });
    });
    /**
     * Adds file to the upload queue and starts upload immediately
     *
     * @param {Array<UploadFileWithAPIOptions | File>} files
     * @param {Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>} dataTransferItems
     * @return {void}
     */
    _defineProperty(this, "addFilesWithOptionsToUploadQueueAndStartUpload", (files, dataTransferItems) => {
      this.addFilesToUploadQueue(files, this.upload);
      this.addDataTransferItemsToUploadQueue(dataTransferItems, this.upload);
    });
    const {
      rootFolderId: _rootFolderId,
      token: _token,
      useUploadsManager: _useUploadsManager
    } = props;
    this.state = {
      view: _rootFolderId && _token || _useUploadsManager ? VIEW_UPLOAD_EMPTY : VIEW_ERROR,
      items: [],
      errorCode: '',
      itemIds: {},
      isUploadsManagerExpanded: false
    };
    this.id = uniqueid('bcu_');
    this.itemsRef = /*#__PURE__*/React.createRef();
    this.itemsRef.current = [];
    this.itemIdsRef = /*#__PURE__*/React.createRef();
    this.itemIdsRef.current = {};
  }

  /**
   * Fetches the root folder on load
   *
   * @private
   * @inheritdoc
   * @return {void}
   */
  componentDidMount() {
    this.rootElement = document.getElementById(this.id);
    this.appElement = this.rootElement;
    const {
      files,
      isPrepopulateFilesEnabled
    } = this.props;
    // isPrepopulateFilesEnabled is a prop used to pre-populate files without clicking upload button.
    if (isPrepopulateFilesEnabled && files && files.length > 0) {
      this.addFilesToUploadQueue(files, this.upload);
    }
  }

  /**
   * Cancels pending uploads
   *
   * @private
   * @inheritdoc
   * @return {void}
   */
  componentWillUnmount() {
    this.cancel();
  }

  /**
   * Adds new items to the queue when files prop gets updated in window view
   *
   * @return {void}
   */
  componentDidUpdate() {
    const {
      files,
      dataTransferItems,
      useUploadsManager
    } = this.props;
    const hasFiles = Array.isArray(files) && files.length > 0;
    const hasItems = Array.isArray(dataTransferItems) && dataTransferItems.length > 0;
    const hasUploads = hasFiles || hasItems;
    if (!useUploadsManager || !hasUploads) {
      return;
    }

    // TODO: this gets called unnecessarily (upon each render regardless of the queue not changing)
    this.addFilesWithOptionsToUploadQueueAndStartUpload(files, dataTransferItems);
  }

  /**
   * Create and return new instance of API creator
   *
   * @param {UploadItemAPIOptions} [uploadAPIOptions]
   * @return {API}
   */
  createAPIFactory(uploadAPIOptions) {
    const {
      rootFolderId
    } = this.props;
    const folderId = getProp(uploadAPIOptions, 'folderId') || rootFolderId;
    const fileId = getProp(uploadAPIOptions, 'fileId');
    const itemFolderId = getTypedFolderId(folderId);
    const itemFileId = fileId ? getTypedFileId(fileId) : null;
    return new API(_objectSpread(_objectSpread({}, this.getBaseAPIOptions()), {}, {
      id: itemFileId || itemFolderId
    }, uploadAPIOptions));
  }
  /**
   * Converts File API to upload items and adds to upload queue for files with webkitRelativePath.
   *
   * @private
   * @param {Array<UploadFileWithAPIOptions | File>} files - Files to be added to upload queue
   * @param {Function} itemUpdateCallback - function to be invoked after items status are updated
   * @return {void}
   */
  addFilesWithRelativePathToQueue(files, itemUpdateCallback) {
    if (files.length === 0) {
      return;
    }
    const {
      rootFolderId
    } = this.props;
    const fileAPIOptions = getFileAPIOptions(files[0]);
    const {
      folderId = rootFolderId
    } = fileAPIOptions;
    const folderUpload = this.getFolderUploadAPI(folderId);

    // Only 1 folder tree can be built with files having webkitRelativePath properties
    folderUpload.buildFolderTreeFromWebkitRelativePath(files);
    this.addFolderToUploadQueue(folderUpload, itemUpdateCallback, fileAPIOptions);
  }
  /**
   * Returns a new API instance for the given file.
   *
   * @private
   * @param {File} file - File to get a new API instance for
   * @param {UploadItemAPIOptions} [uploadAPIOptions]
   * @return {UploadAPI} - Instance of Upload API
   */
  getUploadAPI(file, uploadAPIOptions) {
    const {
      chunked,
      isResumableUploadsEnabled,
      isUploadFallbackLogicEnabled
    } = this.props;
    const {
      size
    } = file;
    const factory = this.createAPIFactory(uploadAPIOptions);
    if (chunked && size > CHUNKED_UPLOAD_MIN_SIZE_BYTES) {
      if (isMultiputSupported()) {
        const chunkedUploadAPI = factory.getChunkedUploadAPI();
        if (isResumableUploadsEnabled) {
          chunkedUploadAPI.isResumableUploadsEnabled = true;
        }
        if (isUploadFallbackLogicEnabled) {
          chunkedUploadAPI.isUploadFallbackLogicEnabled = true;
        }
        return chunkedUploadAPI;
      }

      /* eslint-disable no-console */
      console.warn('Chunked uploading is enabled, but not supported by your browser. You may need to enable HTTPS.');
      /* eslint-enable no-console */
    }
    const plainUploadAPI = factory.getPlainUploadAPI();
    if (isUploadFallbackLogicEnabled) {
      plainUploadAPI.isUploadFallbackLogicEnabled = true;
    }
    return plainUploadAPI;
  }
  /**
   * Helper to upload a single file.
   *
   * @param {UploadItem} item - Upload item object
   * @return {void}
   */
  uploadFile(item) {
    const {
      overwrite,
      rootFolderId
    } = this.props;
    const {
      api,
      file,
      options
    } = item;
    const numItemsUploading = this.itemsRef.current.filter(item_t => item_t.status === STATUS_IN_PROGRESS).length;
    if (numItemsUploading >= UPLOAD_CONCURRENCY) {
      return;
    }
    const uploadOptions = {
      file,
      folderId: options && options.folderId ? options.folderId : rootFolderId,
      errorCallback: error => this.handleUploadError(item, error),
      progressCallback: event => this.handleUploadProgress(item, event),
      successCallback: entries => this.handleUploadSuccess(item, entries),
      overwrite,
      fileId: options && options.fileId ? options.fileId : null
    };
    item.status = STATUS_IN_PROGRESS;
    const updatedItems = [...this.itemsRef.current];
    updatedItems[this.itemsRef.current.indexOf(item)] = item;
    api.upload(uploadOptions);
    this.updateViewAndCollection(updatedItems);
  }

  /**
   * Helper to resume uploading a single file.
   *
   * @param {UploadItem} item - Upload item object
   * @return {void}
   */
  resumeFile(item) {
    const {
      onResume,
      overwrite,
      rootFolderId
    } = this.props;
    const {
      api,
      file,
      options
    } = item;
    const numItemsUploading = this.itemsRef.current.filter(item_t => item_t.status === STATUS_IN_PROGRESS).length;
    if (numItemsUploading >= UPLOAD_CONCURRENCY) {
      return;
    }
    const resumeOptions = {
      file,
      folderId: options && options.folderId ? options.folderId : rootFolderId,
      errorCallback: error => this.handleUploadError(item, error),
      progressCallback: event => this.handleUploadProgress(item, event),
      successCallback: entries => this.handleUploadSuccess(item, entries),
      overwrite,
      sessionId: api && api.sessionId ? api.sessionId : null,
      fileId: options && options.fileId ? options.fileId : null
    };
    item.status = STATUS_IN_PROGRESS;
    delete item.error;
    const updatedItems = [...this.itemsRef.current];
    updatedItems[this.itemsRef.current.indexOf(item)] = item;
    onResume(item);
    api.resume(resumeOptions);
    this.updateViewAndCollection(updatedItems);
  }

  /**
   * Helper to reset a file. Cancels any current upload and resets progress.
   *
   * @param {UploadItem} item - Upload item to reset
   * @return {void}
   */
  resetFile(item) {
    const {
      api,
      file,
      options
    } = item;
    if (api && typeof api.cancel === 'function') {
      api.cancel();
    }

    // Reset API, progress & status
    item.api = this.getUploadAPI(file, options);
    item.progress = 0;
    item.status = STATUS_PENDING;
    delete item.error;
    const updatedItems = [...this.itemsRef.current];
    updatedItems[this.itemsRef.current.indexOf(item)] = item;
    this.updateViewAndCollection(updatedItems);
  }
  /**
   * Updates view and internal upload collection with provided items.
   *
   * @private
   * @param {UploadItem[]} item - Items to update collection with
   * @param {Function} callback
   * @return {void}
   */
  updateViewAndCollection(items, callback) {
    const {
      isPartialUploadEnabled,
      isResumableUploadsEnabled,
      onComplete,
      useUploadsManager
    } = this.props;
    const someUploadIsInProgress = items.some(uploadItem => uploadItem.status !== STATUS_COMPLETE);
    const someUploadHasFailed = items.some(uploadItem => uploadItem.status === STATUS_ERROR);
    const allItemsArePending = !items.some(uploadItem => uploadItem.status !== STATUS_PENDING);
    const noFileIsPendingOrInProgress = items.every(uploadItem => uploadItem.status !== STATUS_PENDING && uploadItem.status !== STATUS_IN_PROGRESS);
    const areAllItemsFinished = items.every(uploadItem => uploadItem.status === STATUS_COMPLETE || uploadItem.status === STATUS_ERROR);
    const uploadItemsStatus = isResumableUploadsEnabled ? areAllItemsFinished : noFileIsPendingOrInProgress;
    let view = '';
    if (items && items.length === 0 || allItemsArePending) {
      view = VIEW_UPLOAD_EMPTY;
    } else if (isPartialUploadEnabled && areAllItemsFinished) {
      const filesToBeUploaded = items.filter(item => item.status === STATUS_COMPLETE);
      view = VIEW_UPLOAD_SUCCESS;
      if (!useUploadsManager) {
        onComplete(cloneDeep(filesToBeUploaded.map(item => item.boxFile)));
        // Reset item collection after successful upload
        items = [];
      }
    } else if (someUploadHasFailed && useUploadsManager) {
      view = VIEW_ERROR;
    } else if (someUploadIsInProgress) {
      view = VIEW_UPLOAD_IN_PROGRESS;
    } else {
      view = VIEW_UPLOAD_SUCCESS;
      if (!useUploadsManager) {
        onComplete(cloneDeep(items.map(item => item.boxFile)));
        // Reset item collection after successful upload
        items = [];
      }
    }
    if (uploadItemsStatus && useUploadsManager) {
      if (this.isAutoExpanded) {
        this.resetUploadManagerExpandState();
      } // Else manually expanded so don't close
      onComplete(items);
    }
    const state = {
      items,
      view
    };
    if (items.length === 0) {
      this.itemIdsRef.current = {};
      state.itemIds = {};
      state.errorCode = '';
    }
    this.itemsRef.current = items;
    this.setState(state, callback);
  }
  /**
   * Renders the content uploader
   *
   * @inheritdoc
   * @return {Component}
   */
  render() {
    const {
      className,
      fileLimit,
      isDraggingItemsToUploadsManager = false,
      isFolderUploadEnabled,
      isResumableUploadsEnabled,
      isTouch,
      language,
      measureRef,
      messages,
      onClose,
      onUpgradeCTAClick,
      theme,
      useUploadsManager
    } = this.props;
    const {
      view,
      items,
      errorCode,
      isUploadsManagerExpanded
    } = this.state;
    const isEmpty = items.length === 0;
    const isVisible = !isEmpty || !!isDraggingItemsToUploadsManager;
    const hasFiles = items.length !== 0;
    const isLoading = items.some(item => item.status === STATUS_IN_PROGRESS);
    const isDone = items.every(item => item.status === STATUS_COMPLETE || item.status === STATUS_STAGED);
    const styleClassName = classNames('bcu', className, {
      'be-app-element': !useUploadsManager,
      be: !useUploadsManager
    });
    return /*#__PURE__*/React.createElement(Internationalize, {
      language: language,
      messages: messages
    }, /*#__PURE__*/React.createElement(TooltipProvider, null, useUploadsManager ? /*#__PURE__*/React.createElement("div", {
      ref: measureRef,
      className: styleClassName,
      id: this.id
    }, /*#__PURE__*/React.createElement(ThemingStyles, {
      selector: `#${this.id}`,
      theme: theme
    }), /*#__PURE__*/React.createElement(UploadsManager, {
      isDragging: isDraggingItemsToUploadsManager,
      isExpanded: isUploadsManagerExpanded,
      isResumableUploadsEnabled: isResumableUploadsEnabled,
      isVisible: isVisible,
      items: items,
      onItemActionClick: this.onClick,
      onRemoveActionClick: this.removeFileFromUploadQueue,
      onUpgradeCTAClick: onUpgradeCTAClick,
      onUploadsManagerActionClick: this.clickAllWithStatus,
      toggleUploadsManager: this.toggleUploadsManager,
      view: view
    })) : /*#__PURE__*/React.createElement("div", {
      ref: measureRef,
      className: styleClassName,
      id: this.id
    }, /*#__PURE__*/React.createElement(ThemingStyles, {
      selector: `#${this.id}`,
      theme: theme
    }), /*#__PURE__*/React.createElement(DroppableContent, {
      addDataTransferItemsToUploadQueue: this.addDroppedItemsToUploadQueue,
      addFiles: this.addFilesToUploadQueue,
      allowedTypes: ['Files'],
      isFolderUploadEnabled: isFolderUploadEnabled,
      isTouch: isTouch,
      items: items,
      onClick: this.onClick,
      view: view
    }), /*#__PURE__*/React.createElement(Footer, {
      errorCode: errorCode,
      fileLimit: fileLimit,
      hasFiles: hasFiles,
      isLoading: isLoading,
      onCancel: this.cancel,
      onClose: onClose,
      onUpload: this.upload,
      isDone: isDone
    }))));
  }
}
_defineProperty(ContentUploader, "defaultProps", {
  apiHost: DEFAULT_HOSTNAME_API,
  chunked: true,
  className: '',
  clientName: CLIENT_NAME_CONTENT_UPLOADER,
  dataTransferItems: [],
  files: [],
  fileLimit: FILE_LIMIT_DEFAULT,
  isDraggingItemsToUploadsManager: false,
  isFolderUploadEnabled: false,
  isPartialUploadEnabled: false,
  isPrepopulateFilesEnabled: false,
  isResumableUploadsEnabled: false,
  isUploadFallbackLogicEnabled: false,
  onBeforeUpload: noop,
  onCancel: noop,
  onClickCancel: noop,
  onClickResume: noop,
  onClickRetry: noop,
  onClose: noop,
  onComplete: noop,
  onError: noop,
  onMinimize: noop,
  onProgress: noop,
  onResume: noop,
  onUpload: noop,
  overwrite: true,
  rootFolderId: DEFAULT_ROOT,
  uploadHost: DEFAULT_HOSTNAME_UPLOAD,
  useUploadsManager: false
});
export default flow([makeResponsive, withBlueprintModernization])(ContentUploader);
export { ContentUploader as ContentUploaderComponent, CHUNKED_UPLOAD_MIN_SIZE_BYTES };
//# sourceMappingURL=ContentUploader.js.map