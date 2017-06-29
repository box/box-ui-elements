/**
 * @flow
 * @file Folder Tree Popup Component
 * @author Box
 */

import makePopup from '../makePopup';
import ContentTree from './ContentTree';
import { CLIENT_NAME_CONTENT_TREE } from '../../constants';

export default makePopup(CLIENT_NAME_CONTENT_TREE)(ContentTree);
