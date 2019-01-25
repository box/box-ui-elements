// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';

import Button from 'components/button/Button';
import PrimaryButton from 'components/primary-button/PrimaryButton';
import MenuToggle from 'components/dropdown-menu/MenuToggle';
import { Flyout, Overlay } from 'components/flyout';
import FilterItem from './FilterItem';
import IconMetadataFilter from '../../../icons/metadata-view/IconMetadataFilter';
import { isValidCondition } from '../validator';

import messages from '../messages';

type State = {
    activeFilterConditions: Array<Object>,
    isDisabled: boolean,
    isFilterMenuOpen: boolean,
    filterConditions: Array<Object>,
    numberOfActiveFilters: number,
    numberOfValidConditions: number,
};

type Props = {
    template?: Object,
};

class FilterButton extends React.Component<Props, State> {
    state = {
        activeFilterConditions: [],
        isDisabled: true,
        isFilterMenuOpen: false,
        filterConditions: [
            {
                attributeDisplayText: '',
                attributeKey: null,
                conditionId: uniqueId(),
                fieldId: '',
                isValidCondition: false,
                operatorDisplayText: '',
                operatorKey: null,
                valueDisplayText: '',
                valueKey: null,
                valueType: '',
            },
        ],
        numberOfActiveFilters: 0,
        numberOfValidConditions: 0,
    };

    onClose = () => {
        this.setState({
            isFilterMenuOpen: false,
        });
    };

    onOpen = () => {
        this.setState({ isFilterMenuOpen: true });
    };

    toggleFilterButton = () => {
        this.setState({ isFilterMenuOpen: !this.state.isFilterMenuOpen });
    };

    addFilter = () => {
        this.setState({
            isDisabled: true,
            filterConditions: [
                ...this.state.filterConditions,
                {
                    attributeDisplayText: '',
                    attributeKey: null,
                    conditionId: uniqueId(),
                    isValidCondition: false,
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
        const { isDisabled, filterConditions } = this.state;
        if (!isDisabled) {
            const validConditions = this.getValidConditions(filterConditions);
            this.setState({
                activeFilterConditions: validConditions,
                numberOfActiveFilters: this.state.numberOfValidConditions,
            });
        }
    };

    updateFilterCondition = (
        index: number,
        condition: Object,
        fieldDisplayText: string | Date,
        fieldDisplayTextType: string,
        fieldId: string,
        fieldKey: string | Date,
        fieldKeyType: string,
        valueType: string,
    ) => {
        const { filterConditions } = this.state;
        const updatedCondition = filterConditions.find(currentCondition => {
            return currentCondition.conditionId === condition.conditionId;
        });
        if (updatedCondition) {
            const newFilterCondition = {
                ...updatedCondition,
                [fieldDisplayTextType]: fieldDisplayText,
                [fieldKeyType]: fieldKey,
                valueType,
                fieldId,
            };

            if (fieldKeyType === 'attributeKey') {
                newFilterCondition.operatorKey = null;
                newFilterCondition.valueKey = null;
            }

            newFilterCondition.isValidCondition = this.checkValidCondition(newFilterCondition);

            const filteredConditions = filterConditions.slice(0);
            const foundIndex = filterConditions.findIndex(
                condition => condition.conditionId === newFilterCondition.conditionId,
            );
            filteredConditions[foundIndex] = newFilterCondition;

            const validConditions = this.getValidConditions(filteredConditions);
            const numberOfValidConditions = {
                isDisabled: validConditions.length === 0,
                numberOfValidConditions: validConditions.length,
            };

            this.setState({
                ...numberOfValidConditions,
                filterConditions: filteredConditions,
            });
        }
    };

    getValidConditions = (filterConditions: Array<Object>) => {
        let validConditions = [];
        filterConditions.forEach(condition => {
            if (condition.isValidCondition) {
                validConditions = [...validConditions, condition];
            }
        });
        return validConditions;
    };

    checkValidCondition = (condition: Object) => {
        return isValidCondition(condition.valueType, condition);
    };

    deleteCondition = (index: number) => {
        const { filterConditions } = this.state;

        const updatedFilterConditions = filterConditions.filter((condition, conditionIndex) => {
            return conditionIndex !== index;
        });

        const validConditions = this.getValidConditions(updatedFilterConditions);

        const numberOfValidConditions = {
            isDisabled: validConditions.length === 0 && updatedFilterConditions.length > 0,
            numberOfValidConditions: validConditions.length,
        };

        this.setState({
            filterConditions: updatedFilterConditions,
            ...numberOfValidConditions,
        });
    };

    shouldClose = (event?: SyntheticEvent<>) => {
        const { isDisabled } = this.state;
        if (event && event.target && !isDisabled) {
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
        const { isFilterMenuOpen, isDisabled, filterConditions, numberOfActiveFilters } = this.state;

        const buttonClasses = classNames('query-bar-button', numberOfActiveFilters !== 0 ? 'is-active' : '');

        return (
            <Flyout
                className="query-bar-filter-dropdown-flyout"
                closeOnClick
                closeOnClickOutside
                onClose={this.onClose}
                onOpen={this.onOpen}
                position="bottom-right"
                closeOnClickPredicate={this.shouldClose}
                shouldDefaultFocus
                overlayIsVisible={isFilterMenuOpen}
            >
                <Button
                    className={buttonClasses}
                    isDisabled={template === undefined}
                    onClick={this.toggleFilterButton}
                    type="button"
                >
                    <MenuToggle>
                        <IconMetadataFilter className="button-icon" />
                        <span className="button-label">
                            {numberOfActiveFilters === 0 ? (
                                <FormattedMessage {...messages.filtersButtonText} />
                            ) : (
                                <FormattedMessage
                                    {...messages.multipleFiltersButtonText}
                                    values={{
                                        number: numberOfActiveFilters,
                                    }}
                                />
                            )}
                        </span>
                    </MenuToggle>
                </Button>

                <Overlay>
                    {isFilterMenuOpen ? (
                        <div className="filter-button-dropdown">
                            <div className="filter-button-dropdown-header">
                                {filterConditions.length === 0 ? (
                                    <FormattedMessage {...messages.noFiltersAppliedText} />
                                ) : null}
                                {filterConditions.map((condition, index) => {
                                    return (
                                        <FilterItem
                                            key={`metadata-view-filter-item-${condition.conditionId}`}
                                            template={template}
                                            condition={condition}
                                            index={index}
                                            updateFilterCondition={this.updateFilterCondition}
                                            deleteCondition={this.deleteCondition}
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
                                    type="button"
                                    onClick={this.applyFilters}
                                    isDisabled={isDisabled}
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
