/**
 * @flow
 * @file Flow types
 * @author Box
 */
/* eslint-disable no-unused-vars */
// NOTE: all of these imports resolve to `any`
// see https://github.com/facebook/flow/issues/7574
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor, InjectIntlProvidedProps } from 'react-intl';
import type { $AxiosXHR, $AxiosError, Axios, CancelTokenSource } from 'axios';
import type FolderAPI from '../src/api/Folder';
import type FileAPI from '../src/api/File';
import type WebLinkAPI from '../src/api/WebLink';
import type MultiputUploadAPI from '../src/api/uploads/MultiputUpload';
import type PlainUploadAPI from '../src/api/uploads/PlainUpload';
import type APICache from '../src/utils/Cache';
import type { ContentSidebarProps } from '../src/elements/content-sidebar';
import type { ContentOpenWithProps } from '../src/elements/content-open-with';
import type { ContentPreviewProps } from '../src/elements/content-preview';
import type { FeatureConfig } from '../src/elements/common/feature-checking';
