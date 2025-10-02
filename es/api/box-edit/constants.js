const BOX_TOOLS_PLUGIN_NAME = 'Box.BoxTools'; // @TODO Should be passed as a config
const BOX_SECURE_LOCAL_BASE_URL = 'https://edit.boxlocalhost.com:';
const BOX_UNSECURE_LOCAL_BASE_URL = 'http://127.0.0.1:';
const ACTIVEX_CHANNEL_NAME = 'activex_channel';
const HTTP_CHANNEL_NAME = 'http_channel';
const HTTPS_CHANNEL_NAME = 'https_channel';
const SAFARI_CHANNEL_NAME = 'safari_channel';
const OPERATION_STATUS = 'status';
const OPERATION_REQUEST = 'application_request';
const OPERATION_COMMAND = 'application_command';
const UNCREATED_STATUS = 'uncreated';
const CREATED_STATUS = 'created';
const ACTIVE_STATUS = 'active';
const HIVE_TABLE_WEBAPP_BOXTOOLS_ANALYTICS = 'webapp_boxtools_analytics';
const SECRET_STORE_COOKIE_NAME = 'box-edit-secret-cookie-name';
const BOX_EDIT_APP_NAME = 'BoxEdit';
const REQUEST_ID_PRE = 'BOX-EXT-REQ-ID-';
const REQUEST_TIMEOUT_RESPONSE_CODE = 408;
const OUTPUT_EVENT = 'box_extension_output';
const BOX_EDIT_NOT_SUPPORTED_ERROR = 'box_edit_not_supported_error';
const BOX_EDIT_UNINSTALLED_ERROR = 'box_edit_uninstalled_error';
const BOX_EDIT_UPGRADE_BROWSER_ERROR = 'box_edit_upgrade_browser_error';
const BOX_EDIT_SAFARI_ERROR = 'box_edit_safari_error';
const BOX_EDIT_INSECURE_REQUESTS_UPGRADED_ERROR = 'box_edit_insecure_requests_upgraded_error';
const KEY_LENGTH = 16;
const KEY_ID_LENGTH = 8;
const IV = '75392C57F66CE7E7EF47110410280DD7';
const EXTENSION_BLACKLIST = {
  A6P: 1,
  AC: 1,
  AS: 1,
  ACR: 1,
  ACTION: 1,
  AIR: 1,
  APP: 1,
  AWK: 1,
  BAT: 1,
  BOXNOTE: 1,
  CGI: 1,
  CHM: 1,
  CMD: 1,
  COM: 1,
  CSH: 1,
  DEK: 1,
  DLD: 1,
  DS: 1,
  EBM: 1,
  ESH: 1,
  EXE: 1,
  EZS: 1,
  FKY: 1,
  FRS: 1,
  FXP: 1,
  GADGET: 1,
  HMS: 1,
  HTA: 1,
  ICD: 1,
  INX: 1,
  IPF: 1,
  ISU: 1,
  JAR: 1,
  JS: 1,
  JSE: 1,
  JSX: 1,
  KIX: 1,
  LNK: 1,
  LUA: 1,
  MCR: 1,
  MEM: 1,
  MPX: 1,
  MS: 1,
  MSI: 1,
  MST: 1,
  OBS: 1,
  PAF: 1,
  PEX: 1,
  PIF: 1,
  PL: 1,
  PRC: 1,
  PRG: 1,
  PVD: 1,
  PWC: 1,
  PY: 1,
  PYC: 1,
  PYO: 1,
  QPX: 1,
  RBX: 1,
  REG: 1,
  RGS: 1,
  ROX: 1,
  RPJ: 1,
  SCAR: 1,
  SCR: 1,
  SCRIPT: 1,
  SCPT: 1,
  SCT: 1,
  SH: 1,
  SHB: 1,
  SHS: 1,
  SPR: 1,
  TLB: 1,
  TMS: 1,
  U3P: 1,
  UDF: 1,
  URL: 1,
  VB: 1,
  VBE: 1,
  VBS: 1,
  VBSCRIPT: 1,
  WCM: 1,
  WPK: 1,
  WS: 1,
  WSF: 1,
  XQT: 1
};
export default {
  SAFARI_CHANNEL_NAME,
  SECRET_STORE_COOKIE_NAME,
  BOX_EDIT_APP_NAME,
  BOX_EDIT_NOT_SUPPORTED_ERROR,
  BOX_EDIT_UNINSTALLED_ERROR,
  BOX_EDIT_UPGRADE_BROWSER_ERROR,
  BOX_EDIT_SAFARI_ERROR,
  BOX_EDIT_INSECURE_REQUESTS_UPGRADED_ERROR,
  BOX_TOOLS_PLUGIN_NAME,
  BOX_SECURE_LOCAL_BASE_URL,
  BOX_UNSECURE_LOCAL_BASE_URL,
  ACTIVEX_CHANNEL_NAME,
  HTTP_CHANNEL_NAME,
  HTTPS_CHANNEL_NAME,
  OPERATION_STATUS,
  OPERATION_REQUEST,
  OPERATION_COMMAND,
  UNCREATED_STATUS,
  CREATED_STATUS,
  ACTIVE_STATUS,
  HIVE_TABLE_WEBAPP_BOXTOOLS_ANALYTICS,
  KEY_LENGTH,
  KEY_ID_LENGTH,
  IV,
  OUTPUT_EVENT,
  REQUEST_ID_PRE,
  REQUEST_TIMEOUT_RESPONSE_CODE,
  EXTENSION_BLACKLIST
};
//# sourceMappingURL=constants.js.map