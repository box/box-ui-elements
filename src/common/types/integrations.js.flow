// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { APP_INTEGRATION, HTTP_POST, HTTP_GET } from '../../constants';
import BoxToolsInstallMessage from '../../elements/content-open-with/BoxToolsInstallMessage';

type AppIntegrationAPIMiniItem = {
    id: string,
    type: typeof APP_INTEGRATION,
};

type OpenWithAPIItem = {
    app_integration: AppIntegrationAPIMiniItem,
    disabled_reasons: Array<string>,
    display_description: string,
    display_name: string,
    display_order: number,
    is_disabled: boolean,
    should_show_consent_popup: boolean,
};

type OpenWithAPI = {
    default_app_integration?: AppIntegrationAPIMiniItem,
    disabled_reasons?: Array<string>,
    is_disabled?: boolean,
    items: Array<OpenWithAPIItem>,
    should_show_consent_popup?: boolean,
};

type ExecuteAPIParam = {
    key: string,
    value: string,
};

type ExecuteAPI = {
    integration_type: string,
    method: typeof HTTP_POST | typeof HTTP_GET,
    params: ?Array<ExecuteAPIParam>,
    url: string,
};

// TODO: is there a way to consolidate BoxToolsInstallMessage,
// which is just a wrapper around FormattedMessage?
type DisabledReason = string | React.Element<typeof FormattedMessage> | React.Element<typeof BoxToolsInstallMessage>;

type Integration = {
    appIntegrationId: string,
    disabledReasons: Array<DisabledReason>,
    displayDescription: string,
    displayName: string,
    displayOrder: number,
    extension?: string,
    isDefault: boolean,
    isDisabled: boolean,
    requiresConsent: boolean,
    type: typeof APP_INTEGRATION,
};

export type { OpenWithAPI, ExecuteAPI, DisabledReason, Integration };
