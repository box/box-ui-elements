// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import MetadataDefaultBadge from '../../../icons/badges/MetadataDefaultBadge';
import MetadataActiveBadge from '../../../icons/badges/MetadataActiveBadge';
import TemplateDropdown from '../../metadata-instance-editor/TemplateDropdown';
import Button from '../../../components/button/Button';
import MenuToggle from '../../../components/dropdown-menu/MenuToggle';
import messages from '../messages';
import LoadingIndicator from '../../../components/loading-indicator';
import type { MetadataTemplate } from '../../../common/types/metadata';

type State = {
    isTemplateMenuOpen: boolean,
};

type Props = {
    activeTemplate?: MetadataTemplate,
    onAdd?: Function,
    onTemplateChange?: Function,
    templates?: Array<Object>,
    usedTemplates: Array<Object>,
};

class TemplateButton extends React.Component<Props, State> {
    static defaultProps = {
        usedTemplates: [],
    };

    state = {
        isTemplateMenuOpen: false,
    };

    toggleTemplateDropdownButton = () => {
        this.setState({ isTemplateMenuOpen: !this.state.isTemplateMenuOpen });
    };

    updateActiveTemplate = (template: MetadataTemplate) => {
        const { onTemplateChange } = this.props;

        if (onTemplateChange) {
            onTemplateChange(template);
        }
    };

    renderEntryButton = () => {
        const { templates, activeTemplate } = this.props;

        let icon;
        let text;

        const isLoadingTemplates = !templates;
        const hasTemplates = templates && templates.length > 0;

        if (isLoadingTemplates) {
            icon = <LoadingIndicator className="loading-indicator" />;
            text = <FormattedMessage {...messages.templatesLoadingButtonText} />;
        } else if (!hasTemplates) {
            text = <FormattedMessage {...messages.noTemplatesText} />;
        } else if (activeTemplate) {
            icon = <MetadataActiveBadge />;
            text = activeTemplate.displayName;
        } else if (!activeTemplate) {
            icon = <MetadataDefaultBadge />;
            text = <FormattedMessage {...messages.templatesButtonText} />;
        }

        const buttonClasses = classNames('query-bar-button', {
            'is-active': activeTemplate,
        });

        return (
            <Button
                className={buttonClasses}
                isDisabled={!templates || templates.length === 0}
                type="button"
                onClick={this.toggleTemplateDropdownButton}
            >
                <MenuToggle>
                    {icon}
                    <span className="button-label">{text}</span>
                </MenuToggle>
            </Button>
        );
    };

    renderTitle = () => (
        <div className="template-dropdown-list-title">
            <FormattedMessage {...messages.metadataViewTemplateListHeaderTitle} />
        </div>
    );

    render() {
        const { activeTemplate, templates, usedTemplates } = this.props;
        return (
            <TemplateDropdown
                className="query-bar-template-dropdown-flyout"
                defaultTemplateIcon={<MetadataDefaultBadge className="template-list-item-badge" />}
                title={this.renderTitle()}
                onAdd={this.updateActiveTemplate}
                activeTemplate={activeTemplate}
                activeTemplateIcon={<MetadataActiveBadge className="template-list-item-badge" />}
                templates={templates || []}
                usedTemplates={usedTemplates}
                entryButton={this.renderEntryButton()}
            />
        );
    }
}

export default TemplateButton;
