// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';

import IconMetadataFilter from '../../../icons/metadata-view/IconMetadataFilter';
import FilterItem from './FilterItem';
import Button from '../../../components/button/Button';
import PrimaryButton from '../../../components/primary-button/PrimaryButton';
import MenuToggle from '../../../components/dropdown-menu/MenuToggle';
import { Flyout, Overlay } from '../../../components/flyout';

import messages from '../messages';

type State = {
    appliedConditions: Array<Object>,
    conditions: Array<Object>,
    isMenuOpen: boolean,
};

type Props = {
    onFilterChange?: Function,
    template?: Object,
};

class FilterButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const conditionID = this.generateConditionID();
        this.state = {
            appliedConditions: [],
            conditions: [
                {
                    attributeDisplayText: '',
                    attributeKey: null,
                    id: conditionID,
                    fieldId: '',
                    operatorDisplayText: '',
                    operatorKey: null,
                    valueDisplayText: '',
                    valueKey: null,
                    valueType: '',
                },
            ],
            isMenuOpen: false,
        };
    }

    onClose = () => {
        this.setState({
            isMenuOpen: false,
        });
    };

    onOpen = () => {
        this.setState({ isMenuOpen: true });
    };

    toggleButton = () => {
        this.setState({ isMenuOpen: !this.state.isMenuOpen });
    };

    generateConditionID = () => {
        return uniqueId();
    };

    addFilter = () => {
        const conditionID = this.generateConditionID();
        this.setState({
            conditions: [
                ...this.state.conditions,
                {
                    attributeDisplayText: '',
                    attributeKey: null,
                    id: conditionID,
                    fieldId: '',
                    operatorDisplayText: '',
                    operatorKey: null,
                    valueDisplayText: '',
                    valueKey: null,
                    valueType: '',
                },
            ],
        });
    };

    applyFilters = () => {
        const { onFilterChange } = this.props;
        const { conditions } = this.state;
        if (onFilterChange) {
            onFilterChange(conditions);
        }
        this.setState({
            appliedConditions: conditions,
        });
    };

    update = (
        index: number,
        condition: Object,
        fieldDisplayText: string | Date,
        fieldDisplayTextType: string,
        fieldId: string,
        fieldKey: string | Date,
        fieldKeyType: string,
        valueType: string,
    ) => {
        const { conditions } = this.state;
        const conditionToUpdate = conditions.find(currentCondition => {
            return currentCondition.id === condition.id;
        });
        if (conditionToUpdate) {
            const updatedCondition = {
                ...conditionToUpdate,
                [fieldDisplayTextType]: fieldDisplayText,
                [fieldKeyType]: fieldKey,
                valueType,
                fieldId,
            };

            if (fieldKeyType === 'attributeKey') {
                updatedCondition.operatorKey = null;
                updatedCondition.valueKey = null;
            }

            const updatedConditions = conditions.slice(0);
            const idx = conditions.findIndex(c => c.id === updatedCondition.id);
            updatedConditions[idx] = updatedCondition;

            this.setState({
                conditions: updatedConditions,
            });
        }
    };

    deleteCondition = (index: number) => {
        const { conditions } = this.state;

        const updatedConditions = conditions.filter((condition, conditionIndex) => {
            return conditionIndex !== index;
        });

        this.setState({
            conditions: updatedConditions,
        });
    };

    shouldClose = (event?: SyntheticEvent<>) => {
        // The current approach assumes that the Apply button contains at most one child element
        if (event && event.target) {
            if (
                (event.target: window.HTMLButtonElement).classList.contains('apply-filters-button') ||
                (event.target: window.HTMLSpanElement).parentNode.classList.contains('apply-filters-button')
            ) {
                return true;
            }
        }
        return false;
    };

    render() {
        const { template } = this.props;
        const { appliedConditions, conditions, isMenuOpen } = this.state;

        const numberOfAppliedConditions = appliedConditions.length;

        const buttonClasses = classNames('query-bar-button', numberOfAppliedConditions !== 0 ? 'is-active' : '');

        const isFilterDisabled = template === undefined;

        return (
            <Flyout
                className="query-bar-filter-dropdown-flyout"
                closeOnClick
                closeOnClickOutside
                closeOnClickPredicate={this.shouldClose}
                onClose={this.onClose}
                onOpen={this.onOpen}
                overlayIsVisible={isMenuOpen}
                position="bottom-right"
                shouldDefaultFocus
            >
                <Button
                    className={buttonClasses}
                    isDisabled={isFilterDisabled}
                    onClick={this.toggleButton}
                    type="button"
                >
                    <MenuToggle>
                        <IconMetadataFilter className="button-icon" />
                        <span className="button-label">
                            {numberOfAppliedConditions === 0 ? (
                                <FormattedMessage {...messages.filtersButtonText} />
                            ) : (
                                <FormattedMessage
                                    {...messages.multipleFiltersButtonText}
                                    values={{
                                        number: numberOfAppliedConditions,
                                    }}
                                />
                            )}
                        </span>
                    </MenuToggle>
                </Button>

                <Overlay>
                    {isMenuOpen ? (
                        <div className="filter-button-dropdown">
                            <div className="filter-button-dropdown-header">
                                {conditions.length === 0 ? (
                                    <FormattedMessage {...messages.noFiltersAppliedText} />
                                ) : null}
                                {conditions.map((condition, index) => {
                                    return (
                                        <FilterItem
                                            key={`metadata-view-filter-item-${condition.id}`}
                                            condition={condition}
                                            deleteCondition={this.deleteCondition}
                                            index={index}
                                            template={template}
                                            update={this.update}
                                        />
                                    );
                                })}
                            </div>
                            <div className="filter-button-dropdown-footer">
                                <Button type="button" onClick={this.addFilter}>
                                    <FormattedMessage {...messages.addFilterButtonText} />
                                </Button>

                                <PrimaryButton
                                    className="apply-filters-button"
                                    onClick={this.applyFilters}
                                    type="button"
                                >
                                    <FormattedMessage {...messages.applyFiltersButtonText} />
                                </PrimaryButton>
                            </div>
                        </div>
                    ) : (
                        <div />
                    )}
                </Overlay>
            </Flyout>
        );
    }
}

export default FilterButton;
