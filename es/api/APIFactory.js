function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Main entry point for the box api
 * @author Box
 */

import Cache from '../utils/Cache';
import ChunkedUploadAPI from './uploads/MultiputUpload';
import PlainUploadAPI from './uploads/PlainUpload';
import FolderAPI from './Folder';
import FileAPI from './File';
import WebLinkAPI from './WebLink';
import SearchAPI from './Search';
import RecentsAPI from './Recents';
import VersionsAPI from './Versions';
import CommentsAPI from './Comments';
import TasksNewAPI from './tasks/TasksNew';
import TaskCollaboratorsAPI from './tasks/TaskCollaborators';
import TaskLinksAPI from './tasks/TaskLinks';
import ThreadedCommentsAPI from './ThreadedComments';
import FileAccessStatsAPI from './FileAccessStats';
import FileActivitiesAPI from './FileActivities';
import MarkerBasedGroupsAPI from './MarkerBasedGroups';
import MarkerBasedUsersAPI from './MarkerBasedUsers';
import GroupsAPI from './Groups';
import UsersAPI from './Users';
import MetadataAPI from './Metadata';
import FileCollaboratorsAPI from './FileCollaborators';
import FileCollaborationsAPI from './FileCollaborations';
import FolderCollaborationsAPI from './FolderCollaborations';
import CollaborationsAPI from './Collaborations';
import FeedAPI from './Feed';
import AppIntegrationsAPI from './AppIntegrations';
import AnnotationsAPI from './Annotations';
import OpenWithAPI from './OpenWith';
import MetadataQueryAPI from './MetadataQuery';
import BoxEditAPI from './box-edit';
import IntelligenceAPI from './Intelligence';
import { DEFAULT_HOSTNAME_API, DEFAULT_HOSTNAME_UPLOAD, TYPE_FOLDER, TYPE_FILE, TYPE_WEBLINK } from '../constants';
class APIFactory {
  /**
   * @property {*}
   */

  /**
   * @property {FileAPI}
   */

  /**
   * @property {WebLink}
   */

  /**
   * @property {FolderAPI}
   */

  /**
   * @property {PlainUploadAPI}
   */

  /**
   * @property {ChunkedUploadAPI}
   */

  /**
   * @property {SearchAPI}
   */

  /**
   * @property {RecentsAPI}
   */

  /**
   * @property {VersionsAPI}
   */

  /**
   * @property {CommentsAPI}
   */

  /**
   * @property {ThreadedCommentsAPI}
   */

  /**
   * @property {TasksNewAPI}
   */

  /**
   * @property {TaskCollaboratorsAPI}
   */

  /**
   * @property {TaskLinksAPI}
   */

  /*
   * @property {FileAccessStatsAPI}
   */

  /*
   * @property {FileActivitiesAPI}
   */

  /*
   * @property {MarkerBasedGroupsAPI}
   */

  /*
   * @property {MarkerBasedUsersAPI}
   */

  /**
   * @property {GroupsAPI}
   */

  /*
   * @property {UsersAPI}
   */

  /*
   * @property {MetadataAPI}
   */

  /**
   * @property {FileCollaboratorsAPI}
   */

  /**
   * @property {FileCollaborationsAPI}
   */

  /**
   * @property {FolderCollaborationsAPI}
   */

  /**
   * @property {CollaborationsAPI}
   */

  /**
   * @property {FeedAPI}
   */

  /**
   * @property {OpenWithAPI}
   */

  /**
   * @property {AppIntegrationsAPI}
   */

  /**
   * @property {MetadataQueryAPI}
   */

  /** @property {BoxEditAPI}
   *
   */

  /**
   * @property {AnnotationsAPI}
   */

  /**
   * @property {IntelligenceAPI}
   */

  /**
   * [constructor]
   *
   * @param {Object} options
   * @param {string} options.id - item id
   * @param {string|function} options.token - Auth token
   * @param {string} [options.sharedLink] - Shared link
   * @param {string} [options.sharedLinkPassword] - Shared link password
   * @param {string} [options.apiHost] - Api host
   * @param {string} [options.uploadHost] - Upload host name
   * @return {API} Api instance
   */
  constructor(options) {
    this.options = _objectSpread(_objectSpread({}, options), {}, {
      apiHost: options.apiHost || DEFAULT_HOSTNAME_API,
      uploadHost: options.uploadHost || DEFAULT_HOSTNAME_UPLOAD,
      cache: options.cache || new Cache(),
      language: options.language
    });
  }

  /**
   * [destructor]
   *
   * @param {boolean} destroyCache - true to destroy cache
   * @return {void}
   */
  destroy(destroyCache = false) {
    if (this.fileAPI) {
      this.fileAPI.destroy();
      delete this.fileAPI;
    }
    if (this.weblinkAPI) {
      this.weblinkAPI.destroy();
      delete this.weblinkAPI;
    }
    if (this.plainUploadAPI) {
      this.plainUploadAPI.destroy();
      delete this.plainUploadAPI;
    }
    if (this.chunkedUploadAPI) {
      this.chunkedUploadAPI.destroy();
      delete this.chunkedUploadAPI;
    }
    if (this.folderAPI) {
      this.folderAPI.destroy();
      delete this.folderAPI;
    }
    if (this.searchAPI) {
      this.searchAPI.destroy();
      delete this.searchAPI;
    }
    if (this.recentsAPI) {
      this.recentsAPI.destroy();
      delete this.recentsAPI;
    }
    if (this.versionsAPI) {
      this.versionsAPI.destroy();
      delete this.versionsAPI;
    }
    if (this.fileAccessStatsAPI) {
      this.fileAccessStatsAPI.destroy();
      delete this.fileAccessStatsAPI;
    }
    if (this.fileActivitiesAPI) {
      this.fileActivitiesAPI.destroy();
      delete this.fileActivitiesAPI;
    }
    if (this.tasksNewAPI) {
      this.tasksNewAPI.destroy();
      delete this.tasksNewAPI;
    }
    if (this.taskCollaboratorsAPI) {
      this.taskCollaboratorsAPI.destroy();
      delete this.taskCollaboratorsAPI;
    }
    if (this.taskLinksAPI) {
      this.taskLinksAPI.destroy();
      delete this.taskLinksAPI;
    }
    if (this.commentsAPI) {
      this.commentsAPI.destroy();
      delete this.commentsAPI;
    }
    if (this.threadedCommentsAPI) {
      this.threadedCommentsAPI.destroy();
      delete this.threadedCommentsAPI;
    }
    if (this.markerBasedGroupsAPI) {
      this.markerBasedGroupsAPI.destroy();
      delete this.markerBasedGroupsAPI;
    }
    if (this.markerBasedUsersAPI) {
      this.markerBasedUsersAPI.destroy();
      delete this.markerBasedUsersAPI;
    }
    if (this.groupsAPI) {
      this.groupsAPI.destroy();
      delete this.groupsAPI;
    }
    if (this.usersAPI) {
      this.usersAPI.destroy();
      delete this.usersAPI;
    }
    if (this.metadataAPI) {
      this.metadataAPI.destroy();
      delete this.metadataAPI;
    }
    if (this.fileCollaboratorsAPI) {
      this.fileCollaboratorsAPI.destroy();
      delete this.fileCollaboratorsAPI;
    }
    if (this.fileCollaborationsAPI) {
      this.fileCollaborationsAPI.destroy();
      delete this.fileCollaborationsAPI;
    }
    if (this.folderCollaborationsAPI) {
      this.folderCollaborationsAPI.destroy();
      delete this.folderCollaborationsAPI;
    }
    if (this.collaborationsAPI) {
      this.collaborationsAPI.destroy();
      delete this.collaborationsAPI;
    }
    if (this.appIntegrationsAPI) {
      this.appIntegrationsAPI.destroy();
      delete this.appIntegrationsAPI;
    }
    if (this.metadataQueryAPI) {
      this.metadataQueryAPI.destroy();
      delete this.metadataQueryAPI;
    }
    if (this.openWithAPI) {
      this.openWithAPI.destroy();
      delete this.openWithAPI;
    }
    if (this.annotationsAPI) {
      this.annotationsAPI.destroy();
      delete this.annotationsAPI;
    }
    if (this.intelligenceAPI) {
      this.intelligenceAPI.destroy();
      delete this.intelligenceAPI;
    }
    if (destroyCache) {
      this.options.cache = new Cache();
    }
  }

  /**
   * Gets the cache instance
   *
   * @return {Cache} cache instance
   */
  getCache() {
    return this.options.cache;
  }

  /**
   * Returns the API based on type of item
   *
   * @private
   * @param {String} type - item type
   * @return {ItemAPI} api
   */
  getAPI(type) {
    let api;
    switch (type) {
      case TYPE_FOLDER:
        api = this.getFolderAPI();
        break;
      case TYPE_FILE:
        api = this.getFileAPI();
        break;
      case TYPE_WEBLINK:
        api = this.getWebLinkAPI();
        break;
      default:
        throw new Error('Unknown Type!');
    }
    return api;
  }

  /**
   * API for file
   *
   * @return {FileAPI} FileAPI instance
   */
  getFileAPI(shouldDestroy = true) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.fileAPI = new FileAPI(this.options);
    return this.fileAPI;
  }

  /**
   * API for web links
   *
   * @return {WebLinkAPI} WebLinkAPI instance
   */
  getWebLinkAPI() {
    this.destroy();
    this.weblinkAPI = new WebLinkAPI(this.options);
    return this.weblinkAPI;
  }

  /**
   * API for plain uploads
   *
   * @return {UploadAPI} UploadAPI instance
   */
  getPlainUploadAPI() {
    this.destroy();
    this.plainUploadAPI = new PlainUploadAPI(this.options);
    return this.plainUploadAPI;
  }

  /**
   * API for chunked uploads
   *
   * @return {UploadAPI} UploadAPI instance
   */
  getChunkedUploadAPI() {
    this.destroy();
    this.chunkedUploadAPI = new ChunkedUploadAPI(this.options);
    return this.chunkedUploadAPI;
  }

  /**
   * API for folder
   *
   * @return {FolderAPI} FolderAPI instance
   */
  getFolderAPI(shouldDestroy = true) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.folderAPI = new FolderAPI(this.options);
    return this.folderAPI;
  }

  /**
   * API for search
   *
   * @return {SearchAPI} SearchAPI instance
   */
  getSearchAPI() {
    this.destroy();
    this.searchAPI = new SearchAPI(this.options);
    return this.searchAPI;
  }

  /**
   * API for recents
   *
   * @return {RecentsAPI} RecentsAPI instance
   */
  getRecentsAPI() {
    this.destroy();
    this.recentsAPI = new RecentsAPI(this.options);
    return this.recentsAPI;
  }

  /**
   * API for metadata
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {MetadataAPI} MetadataAPI instance
   */
  getMetadataAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.metadataAPI = new MetadataAPI(this.options);
    return this.metadataAPI;
  }

  /**
   * API for versions
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {VersionsAPI} VersionsAPI instance
   */
  getVersionsAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.versionsAPI = new VersionsAPI(this.options);
    return this.versionsAPI;
  }

  /**
   * API for comments
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {CommentsAPI} CommentsAPI instance
   */
  getCommentsAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.commentsAPI = new CommentsAPI(this.options);
    return this.commentsAPI;
  }

  /**
   * API for threaded comments
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {ThreadedCommentsAPI} ThreadedCommentsAPI instance
   */
  getThreadedCommentsAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);
    return this.threadedCommentsAPI;
  }

  /**
   * API for tasks
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {TasksAPI} TaskAssignmentsAPI instance
   */
  getTasksNewAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.tasksNewAPI = new TasksNewAPI(this.options);
    return this.tasksNewAPI;
  }

  /**
   * API for taskCollaborators
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {TaskCollaboratorsAPI} TaskCollaboratorsAPI instance
   */
  getTaskCollaboratorsAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.taskCollaboratorsAPI = new TaskCollaboratorsAPI(this.options);
    return this.taskCollaboratorsAPI;
  }

  /**
   * API for taskLinks
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {TasksAPI} TaskLinksAPI instance
   */
  getTaskLinksAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.taskLinksAPI = new TaskLinksAPI(this.options);
    return this.taskLinksAPI;
  }

  /**
   * API for file access stats
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {FileAccessStatsAPI} FileAccessStatsAPI instance
   */
  getFileAccessStatsAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.fileAccessStatsAPI = new FileAccessStatsAPI(this.options);
    return this.fileAccessStatsAPI;
  }

  /**
   * API for file access stats
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {FileActivitiesAPI} FileActivitiesAPI instance
   */
  getFileActivitiesAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.fileActivitiesAPI = new FileActivitiesAPI(this.options);
    return this.fileActivitiesAPI;
  }

  /**
   * API for file collaborators
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {FileCollaboratorsAPI} FileCollaboratorsAPI instance
   */
  getFileCollaboratorsAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.fileCollaboratorsAPI = new FileCollaboratorsAPI(this.options);
    return this.fileCollaboratorsAPI;
  }

  /**
   * API for file collaborations
   *
   * This is different from the FileCollaboratorsAPI! See ./FileCollaborations for more information.
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {FileCollaborationsAPI} FileCollaborationsAPI instance
   */
  getFileCollaborationsAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.fileCollaborationsAPI = new FileCollaborationsAPI(this.options);
    return this.fileCollaborationsAPI;
  }

  /**
   * API for folder collaborations
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {FolderCollaborationsAPI} FolderCollaborationsAPI instance
   */
  getFolderCollaborationsAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.folderCollaborationsAPI = new FolderCollaborationsAPI(this.options);
    return this.folderCollaborationsAPI;
  }

  /**
   * API for collaborations
   *
   * This is different from the other collaboration/collaborator APIs!
   * See ./Collaborations for more information.
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {CollaborationsAPI} CollaborationsAPI instance
   */
  getCollaborationsAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.collaborationsAPI = new CollaborationsAPI(this.options);
    return this.collaborationsAPI;
  }

  /**
   * API for Groups (marker-based paging)
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {MarkerBasedGroupsAPI} MarkerBasedGroupsAPI instance
   */
  getMarkerBasedGroupsAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.markerBasedGroupsAPI = new MarkerBasedGroupsAPI(this.options);
    return this.markerBasedGroupsAPI;
  }

  /**
   * API for Users (marker-based paging)
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {MarkerBasedUsersAPI} MarkerBasedUsersAPI instance
   */
  getMarkerBasedUsersAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.markerBasedUsersAPI = new MarkerBasedUsersAPI(this.options);
    return this.markerBasedUsersAPI;
  }

  /**
   * API for Groups (offset-based paging)
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {GroupsAPI} GroupsAPI instance
   */
  getGroupsAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.groupsAPI = new GroupsAPI(this.options);
    return this.groupsAPI;
  }

  /**
   * API for Users (offset-based paging)
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {UsersAPI} UsersAPI instance
   */
  getUsersAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.usersAPI = new UsersAPI(this.options);
    return this.usersAPI;
  }

  /**
   * API for Feed Items
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {FeedAPI} FeedAPI instance
   */
  getFeedAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.feedItemsAPI = new FeedAPI(this.options);
    return this.feedItemsAPI;
  }

  /**
   * API for Open With
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {OpenWithAPI} OpenWithAPI instance
   */
  getOpenWithAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.openWithAPI = new OpenWithAPI(this.options);
    return this.openWithAPI;
  }

  /**
   * API for the App Integrations endpoint
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {AppIntegrationsAPI} AppIntegrationsAPI instance
   */
  getAppIntegrationsAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.appIntegrationsAPI = new AppIntegrationsAPI(this.options);
    return this.appIntegrationsAPI;
  }

  /**
   * API for Metadata Query
   *
   * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
   * @return {MetadataQuery} MetadataQuery instance
   */
  getMetadataQueryAPI(shouldDestroy = false) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.metadataQueryAPI = new MetadataQueryAPI(this.options);
    return this.metadataQueryAPI;
  }

  /**
   * API for Box Edit
   *
   * @return {BoxEditAPI} BoxEditAPI instance
   */
  getBoxEditAPI() {
    this.boxEditAPI = new BoxEditAPI();
    return this.boxEditAPI;
  }

  /**
   * API for Annotations
   *
   * @return {AnnotationsAPI} AnnotationsAPI instance
   */
  getAnnotationsAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.annotationsAPI = new AnnotationsAPI(this.options);
    return this.annotationsAPI;
  }

  /**
   * API for Intelligence
   *
   * @return {IntelligenceAPI} IntelligenceAPI instance
   */
  getIntelligenceAPI(shouldDestroy) {
    if (shouldDestroy) {
      this.destroy();
    }
    this.intelligenceAPI = new IntelligenceAPI(this.options);
    return this.intelligenceAPI;
  }
}
export default APIFactory;
//# sourceMappingURL=APIFactory.js.map