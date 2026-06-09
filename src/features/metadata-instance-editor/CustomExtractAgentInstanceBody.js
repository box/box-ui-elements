// @flow
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { ActionableInlineNotice } from '@box/blueprint-web';
// $FlowFixMe - blueprint-web-assets icons not typed for Flow
import { Lock } from '@box/blueprint-web-assets/icons/Line';

import TemplatedInstance from './TemplatedInstance';
import CustomInstance from './CustomInstance';

import { getCustomExtractAgentId } from './metadataUtil';

import type { MetadataFields, MetadataTemplate } from '../../common/types/metadata';

import { TEMPLATE_CUSTOM_PROPERTIES } from './constants';

import messages from './messages';

import './CustomExtractAgentInstanceBody.scss';

type Props = {
    // Raw agent configuration value from the cascade policy (e.g. `extract_agent_<id>`).
    // The navigable numeric id is extracted from this value via getCustomExtractAgentId.
    agentConfiguration?: string,
    data: MetadataFields,
    isEditing: boolean,
    onManageExtractAgent?: (agentId: string) => void,
    template: MetadataTemplate,
};

/**
 * Presentational interior for a metadata instance managed by a custom Box AI
 * extract agent. In read-only (view) mode it shows the field values without edit
 * controls; when the user enters edit mode it replaces the form with an informational
 * notice and a button to manage the agent (instead of allowing inline edits).
 *
 * The "manage agent" button is only shown when a navigable numeric agent id can be
 * resolved from the configuration; otherwise the notice is shown without an action.
 */
const CustomExtractAgentInstanceBody = ({
    agentConfiguration,
    data,
    isEditing,
    onManageExtractAgent,
    template,
}: Props) => {
    const { formatMessage } = useIntl();
    const isProperties = template.templateKey === TEMPLATE_CUSTOM_PROPERTIES;
    const customExtractAgentId = getCustomExtractAgentId(agentConfiguration);

    if (isEditing) {
        return (
            <div className="metadata-instance-editor-custom-extract-agent">
                <ActionableInlineNotice
                    icon={Lock}
                    iconAriaLabel={formatMessage(messages.customExtractAgentNoticeIconAriaLabel)}
                    text={formatMessage(messages.customExtractAgentNoticeDescription)}
                >
                    {!!customExtractAgentId && onManageExtractAgent && (
                        <ActionableInlineNotice.PrimaryAction
                            onClick={() => onManageExtractAgent(customExtractAgentId)}
                        >
                            {formatMessage(messages.customExtractAgentManageButton)}
                        </ActionableInlineNotice.PrimaryAction>
                    )}
                </ActionableInlineNotice>
            </div>
        );
    }

    return (
        <div className="metadata-instance-editor-instance">
            <div className="metadata-cascade-notice">
                <FormattedMessage {...messages.metadataCascadePolicyEnabledInfo} />
            </div>
            {isProperties ? (
                <CustomInstance canEdit={false} data={data} />
            ) : (
                <TemplatedInstance canEdit={false} data={data} errors={{}} template={template} />
            )}
        </div>
    );
};

export default CustomExtractAgentInstanceBody;
