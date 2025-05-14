// @flow
import * as React from 'react';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import { FormattedMessage, injectIntl } from 'react-intl';

import DatalistItem from '../../components/datalist-item';
import SelectorDropdown from '../../components/selector-dropdown';
import SearchForm from '../../components/search-form/SearchForm';
import PlainButton from '../../components/plain-button';
import LoadingIndicator from '../../components/loading-indicator';
import { Flyout, Overlay } from '../../components/flyout';

import MenuToggle from '../../components/dropdown-menu/MenuToggle';
import messages from './messages';
import { TEMPLATE_CUSTOM_PROPERTIES } from './constants';
import type { MetadataTemplate } from '../../common/types/metadata';
import './TemplateDropdown.scss';

type Props = {
    activeTemplate?: ?MetadataTemplate,
    activeTemplateIcon?: React.Node,
    className?: string,
    defaultTemplateIcon?: React.Node,
    entryButton?: React.Node,
    intl: any,
    isDropdownBusy?: boolean,
    onAdd: (template: MetadataTemplate) => void,
    onDropdownToggle?: (isDropdownOpen: boolean) => void,
    templates: Array<MetadataTemplate>,
    title?: React.Node,
    usedTemplates: Array<MetadataTemplate>,
};

type State = {
    filterText: string,
    isDropdownOpen: boolean,
    templates: Array<MetadataTemplate>,
};

const getAvailableTemplates = (allTemplates: Array<MetadataTemplate>, usedTemplates: Array<MetadataTemplate>) =>
    allTemplates.filter(
        (template: MetadataTemplate) =>
            usedTemplates.findIndex(
                (usedTemplate: MetadataTemplate) =>
                    usedTemplate.templateKey === template.templateKey && usedTemplate.scope === template.scope,
            ) === -1,
    );

class TemplateDropdown extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isDropdownOpen: false,
            filterText: '',
            templates: getAvailableTemplates(props.templates, props.usedTemplates),
        };
    }

    /**
     * Updates the state
     *
     * @param {Object} prevProps - next props
     * @return {void}
     */
    componentDidUpdate({ templates: prevTemplates, usedTemplates: prevUsedTemplates }: Props) {
        const { templates, usedTemplates } = this.props;

        if (!isEqual(prevTemplates, templates) || !isEqual(prevUsedTemplates, usedTemplates)) {
            this.setState({
                templates: getAvailableTemplates(templates, usedTemplates),
            });
        }
    }

    getDropdown = () => {
        const {
            isDropdownBusy,
            onAdd,
            activeTemplate,
            defaultTemplateIcon,
            activeTemplateIcon,
            templates: allTemplates,
            title,
            usedTemplates,
        }: Props = this.props;
        const { templates }: State = this.state;
        const hasUnusedTemplates = getAvailableTemplates(allTemplates, usedTemplates).length > 0;
        const hasTemplates = allTemplates.length > 0;
        const hasResults = templates.length > 0;

        let indicatorOrMessage = null;

        if (isDropdownBusy) {
            indicatorOrMessage = (
                <LoadingIndicator className="metadata-instance-editor-template-message template-dropdown-loading-indicator" />
            );
        } else if (!hasTemplates || !hasUnusedTemplates || !hasResults) {
            let message = { id: '' };

            if (!hasTemplates) {
                message = messages.metadataTemplatesServerHasNoTemplates;
            } else if (!hasUnusedTemplates) {
                message = messages.metadataTemplatesNoRemainingTemplates;
            } else if (!hasResults) {
                message = messages.metadataTemplatesNoResults;
            }

            indicatorOrMessage = (
                <i className="metadata-instance-editor-template-message">
                    <FormattedMessage {...message} />
                </i>
            );
        }

        const renderedTemplates = templates.map(template => {
            const isTemplateSelected = activeTemplate && activeTemplate.id === template.id;

            const buttonClassName = classNames('metadata-template-dropdown-select-template', {
                'metadata-template-dropdown-is-selected': isTemplateSelected,
            });

            return (
                <DatalistItem key={template.id}>
                    <PlainButton className={buttonClassName} tabIndex="-1" type="button">
                        {isTemplateSelected ? activeTemplateIcon : defaultTemplateIcon}
                        {this.getTemplateName(template)}
                    </PlainButton>
                </DatalistItem>
            );
        });

        return (
            <>
                <SelectorDropdown
                    className="metadata-instance-editor-template-dropdown-menu"
                    title={title}
                    isAlwaysOpen
                    onSelect={(index: number) => {
                        onAdd(templates[index]);
                    }}
                    selector={this.getSelector()}
                    shouldScroll
                >
                    {indicatorOrMessage ? null : renderedTemplates}
                </SelectorDropdown>
                {indicatorOrMessage}
            </>
        );
    };

    /**
     * Returns the input field for the drop down
     *
     * @return {React.Node} - input selector
     */
    getSelector = () => {
        const { intl }: Props = this.props;
        const { filterText }: State = this.state;
        return (
            <SearchForm
                data-resin-target="metadata-templatesearch"
                label=""
                onChange={this.handleUserInput}
                placeholder={intl.formatMessage(messages.metadataTemplateSearchPlaceholder)}
                shouldPreventClearEventPropagation
                type="text"
                useClearButton
                value={filterText}
            />
        );
    };

    /**
     * Returns template display name.
     * For custom metadata we have it on the client.
     *
     * @return {React.Node} - string or formatted name
     */
    getTemplateName(template: MetadataTemplate): React.Node {
        return template.templateKey === TEMPLATE_CUSTOM_PROPERTIES ? (
            <FormattedMessage className="template-display-name" {...messages.customTitle} />
        ) : (
            <div className="template-display-name">{template.displayName}</div>
        );
    }

    /**
     * Updates the filter text and filters the results
     *
     * @param {UserInput} userInput - input value returned from onChangeHandler from SearchForm.js
     * @return {void}
     */
    handleUserInput = (userInput: string) => {
        const { templates: allTemplates, usedTemplates } = this.props;
        const filterText = userInput;
        const templates = getAvailableTemplates(allTemplates, usedTemplates);

        this.setState({
            filterText,
            templates: templates.filter(template => {
                const label: string = ((template.templateKey === TEMPLATE_CUSTOM_PROPERTIES
                    ? messages.customTitle.defaultMessage
                    : template.displayName): any);
                return label.toLowerCase().includes(filterText.toLowerCase());
            }),
        });
    };

    onOpen = () => {
        const { onDropdownToggle, templates, usedTemplates } = this.props;

        if (onDropdownToggle) {
            onDropdownToggle(true);
        }

        this.setState({
            isDropdownOpen: true,
            filterText: '',
            templates: getAvailableTemplates(templates, usedTemplates),
        });
    };

    onClose = () => {
        const { onDropdownToggle } = this.props;

        if (onDropdownToggle) {
            onDropdownToggle(false);
        }

        this.setState({ isDropdownOpen: false });
    };

    renderEntryButton = () => {
        const { entryButton } = this.props;
        const { isDropdownOpen } = this.state;
        const buttonToggleClassName = classNames('lnk', {
            'is-toggled': isDropdownOpen,
        });
        if (entryButton) {
            return entryButton;
        }
        return (
            <PlainButton data-resin-target="metadata-templateaddmenu" className={buttonToggleClassName} type="button">
                <MenuToggle>
                    <FormattedMessage {...messages.metadataTemplateAdd} />
                </MenuToggle>
            </PlainButton>
        );
    };

    render() {
        const { className } = this.props;
        const flyoutClassName = classNames('metadata-instance-editor-template-dropdown-flyout', className);

        return (
            <Flyout
                className={flyoutClassName}
                closeOnClick
                closeOnClickOutside
                constrainToWindowWithPin
                onClose={this.onClose}
                onOpen={this.onOpen}
                position="bottom-left"
                shouldDefaultFocus
            >
                {this.renderEntryButton()}
                <Overlay>{this.getDropdown()}</Overlay>
            </Flyout>
        );
    }
}

export { TemplateDropdown as TemplateDropdownBase };
export default injectIntl(TemplateDropdown);
