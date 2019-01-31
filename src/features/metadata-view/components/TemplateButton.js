// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Button from 'components/button/Button';
import MenuToggle from 'components/dropdown-menu/MenuToggle';
import LoadingIndicator from 'components/loading-indicator';
import MetadataDefaultBadge from '../../../icons/badges/MetadataDefaultBadge';
import MetadataActiveBadge from '../../../icons/badges/MetadataActiveBadge';
import TemplateDropdown from '../../metadata-instance-editor/TemplateDropdown';

import messages from '../messages';

type State = {
    isTemplateMenuOpen: boolean,
    selectedTemplate: MetadataTemplate | null,
};

type Props = {
    onAdd?: Function,
    templates?: Array<Object>,
    onTemplateChange?: Function,
    usedTemplates: Array<Object>,
};

class TemplateButton extends React.Component<Props, State> {
    static defaultProps = {
        usedTemplates: [],
    };

    state = {
        isTemplateMenuOpen: false,
        selectedTemplate: null,
    };

    toggleTemplateDropdownButton = () => {
        this.setState({ isTemplateMenuOpen: !this.state.isTemplateMenuOpen });
    };

    updateSelectedTemplate = (template: MetadataTemplate) => {
        const { onTemplateChange } = this.props;
        this.setState({
            // TODO: Remove local state for selectedTemplate and have this component listen for template passed down from props
            selectedTemplate: template,
        });

        if (onTemplateChange) {
            onTemplateChange(template);
        }
    };

    renderEntryButton = () => {
        const { templates } = this.props;
        const { selectedTemplate } = this.state;

        let icon;
        let text;

        if (!templates) {
            icon = <LoadingIndicator className="loading-indicator" />;
            text = <FormattedMessage {...messages.templatesLoadingButtonText} />;
        } else if (selectedTemplate) {
            icon = <MetadataActiveBadge />;
            text = selectedTemplate.displayName;
        } else if (!selectedTemplate) {
            icon = <MetadataDefaultBadge />;
            text = <FormattedMessage {...messages.templatesButtonText} />;
        }

        const buttonClasses = classNames('query-bar-button', {
            'is-active': selectedTemplate,
        });

        return (
            <Button
                className={buttonClasses}
                isDisabled={!templates}
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
        const { templates, usedTemplates } = this.props;
        const { selectedTemplate } = this.state;
        return (
            <TemplateDropdown
                className="query-bar-template-dropdown-flyout"
                defaultTemplateIcon={<MetadataDefaultBadge className="template-list-item-badge" />}
                title={this.renderTitle()}
                onAdd={this.updateSelectedTemplate}
                selectedTemplate={selectedTemplate}
                selectedTemplateIcon={<MetadataActiveBadge className="template-list-item-badge" />}
                templates={templates || []}
                usedTemplates={usedTemplates}
                entryButton={this.renderEntryButton()}
            />
        );
    }
}

export default TemplateButton;
