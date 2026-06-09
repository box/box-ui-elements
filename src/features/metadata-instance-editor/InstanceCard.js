// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Collapsible from '../../components/collapsible/Collapsible';
import IconMetadataColored from '../../icons/general/IconMetadataColored';
import IconAlertCircle from '../../icons/general/IconAlertCircle';

import type { MetadataCascadePolicy, MetadataTemplate } from '../../common/types/metadata';

import { TEMPLATE_CUSTOM_PROPERTIES } from './constants';
import { RESIN_TAG_TARGET } from '../../common/variables';
import { bdlWatermelonRed } from '../../styles/variables';

import messages from './messages';

type Props = {
    cascadePolicy?: MetadataCascadePolicy,
    children: React.Node,
    hasError?: boolean,
    headerActionItems?: React.Node,
    isCascadingPolicyApplicable?: boolean,
    isOpen: boolean,
    template: MetadataTemplate,
};

/**
 * Presentational card frame for a metadata instance: a Collapsible with a
 * title (icon + display name + optional error mark). Knows nothing about
 * editing or agents — it only renders chrome and whatever body is passed as
 * children.
 */
const InstanceCard = ({
    cascadePolicy = {},
    children,
    hasError = false,
    headerActionItems,
    isCascadingPolicyApplicable,
    isOpen,
    template,
}: Props) => {
    const { fields = [] } = template;
    const isProperties = template.templateKey === TEMPLATE_CUSTOM_PROPERTIES;
    const type = isCascadingPolicyApplicable && cascadePolicy.id ? 'cascade' : 'default';

    // Animate short and tall cards at consistent speeds.
    const animationDuration = (fields.length + 1) * 50;

    const title = (
        <span className="metadata-instance-editor-instance-title">
            <IconMetadataColored type={type} />
            <span
                className={classNames('metadata-instance-editor-instance-title-text', {
                    'metadata-instance-editor-instance-has-error': hasError,
                })}
            >
                {isProperties ? <FormattedMessage {...messages.customTitle} /> : template.displayName}
            </span>
            {hasError && <IconAlertCircle color={bdlWatermelonRed} />}
        </span>
    );

    return (
        <Collapsible
            animationDuration={animationDuration}
            buttonProps={{
                [RESIN_TAG_TARGET]: 'metadata-card',
            }}
            hasStickyHeader
            headerActionItems={headerActionItems}
            isBordered
            isOpen={isOpen}
            title={title}
        >
            {children}
        </Collapsible>
    );
};

export default InstanceCard;
