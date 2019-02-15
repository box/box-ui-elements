// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';

import IconMetadataFilter from '../../../../icons/metadata-view/IconMetadataFilter';
import Condition from './Condition';
import Button from '../../../../components/button/Button';
import PrimaryButton from '../../../../components/primary-button/PrimaryButton';
import MenuToggle from '../../../../components/dropdown-menu/MenuToggle';
import { Flyout, Overlay } from '../../../../components/flyout';
import { AND, OR, WHERE } from '../../constants';

import messages from '../../messages';

import type { ColumnType, SelectOptionType } from '../../flowTypes';

type State = {
    appliedConditions: Array<Object>,
    areErrorsEnabled: boolean,
    conditions: Array<Object>,
    isMenuOpen: boolean,
    selectedPrefix: typeof WHERE | typeof AND | typeof OR,
};

type Props = {
    columns?: Array<ColumnType>,
    onFilterChange?: Function,
};

class FilterButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            appliedConditions: [],
            conditions: [],
            selectedPrefix: AND,
            areErrorsEnabled: false,
            isMenuOpen: false,
        };
    }

    componentDidMount() {
        const id = this.generateConditionID();
        const initialCondition = this.createCondition(id);

        this.setState({
            conditions: [initialCondition],
        });
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

    createCondition = (conditionID: string) => {
        const { columns } = this.props;
        const { selectedPrefix, conditions } = this.state;
        if (columns) {
            const firstField = columns[0];
            const prefix = conditions.length === 0 ? WHERE : selectedPrefix;

            return {
                prefix,
                columnDisplayText: firstField.displayName,
                columnKey: 0,
                id: conditionID,
                fieldId: firstField.id,
                operatorDisplayText: '',
                operatorKey: 0,
                valueDisplayText: null,
                valueKey: null,
                valueType: firstField.type,
            };
        }
        return {};
    };

    generateConditionID = () => {
        return uniqueId();
    };

    addFilter = () => {
        const id = this.generateConditionID();
        const newCondition = this.createCondition(id);
        this.setState({
            conditions: [...this.state.conditions, newCondition],
            areErrorsEnabled: false,
        });
    };

    applyFilters = () => {
        const { onFilterChange } = this.props;
        const { conditions } = this.state;

        const areAllValid = this.areAllValid();

        if (areAllValid) {
            if (onFilterChange) {
                onFilterChange(conditions);
            }
            this.setState({
                appliedConditions: conditions,
            });
        } else {
            this.setState({
                areErrorsEnabled: true,
            });
        }
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

            if (fieldKeyType === 'columnKey') {
                // Upon selecting a new attribute, the operator and value fields should be reset.
                updatedCondition.operatorKey = 0;
                updatedCondition.operatorDisplayText = '';
                updatedCondition.valueDisplayText = null;
                updatedCondition.valueKey = null;
            }

            const updatedConditions = conditions.slice(0);
            const conditionIndex = conditions.findIndex(
                currentCondition => currentCondition.id === updatedCondition.id,
            );
            updatedConditions[conditionIndex] = updatedCondition;

            this.setState({
                conditions: updatedConditions,
            });
        }
    };

    updateSelectedPrefix = (option: SelectOptionType) => {
        const prefix = option.displayText;

        this.setState({
            selectedPrefix: prefix,
        });

        this.updateConditionsPrefixes(prefix);
    };

    updateConditionsPrefixes = (prefix: string) => {
        const { conditions } = this.state;
        const conditionsAfterUpdate = conditions.map((condition, index) => {
            if (index !== 0) {
                const updatedCondition = Object.assign({}, condition);
                updatedCondition.prefix = prefix;
                return updatedCondition;
            }
            return condition;
        });

        // The first condition must always have a prefix of WHERE.
        const firstCondition = Object.assign({}, conditionsAfterUpdate[0]);
        firstCondition.prefix = WHERE;

        const updatedConditions = [firstCondition, ...conditionsAfterUpdate.slice(1)];

        this.setState({
            conditions: updatedConditions,
        });
    };

    deleteCondition = (index: number) => {
        const { conditions } = this.state;

        const conditionsAfterDeletion = conditions.filter((condition, conditionIndex) => {
            return conditionIndex !== index;
        });

        if (conditionsAfterDeletion.length === 0) {
            this.setState({
                conditions: [],
            });
        } else {
            // The first condition must always have a prefix of WHERE.
            const firstCondition = Object.assign({}, conditionsAfterDeletion[0]);
            firstCondition.prefix = WHERE;

            const updatedConditions = [firstCondition, ...conditionsAfterDeletion.slice(1)];

            this.setState({
                conditions: updatedConditions,
            });
        }
    };

    areAllValid = () => {
        const { conditions } = this.state;
        let areAllValid = true;
        conditions.forEach(condition => {
            if (condition.valueDisplayText === null || condition.valueDisplayText === '') {
                areAllValid = false;
            }
        });
        return areAllValid;
    };

    // Should close when all the conditions have a value set and the apply button is pressed.
    shouldClose = (event?: SyntheticEvent<>) => {
        // The current approach assumes that the Apply button contains at most one child element.
        const areAllValid = this.areAllValid();

        if (event && event.target && areAllValid) {
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
        const { columns } = this.props;
        const { appliedConditions, conditions, areErrorsEnabled, isMenuOpen } = this.state;

        const numberOfAppliedConditions = appliedConditions.length;

        const buttonClasses = classNames('query-bar-button', numberOfAppliedConditions !== 0 ? 'is-active' : '');

        const isFilterDisabled = columns === undefined;

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
                                        <Condition
                                            key={`metadata-view-filter-item-${condition.id}`}
                                            condition={condition}
                                            deleteCondition={this.deleteCondition}
                                            areErrorsEnabled={areErrorsEnabled}
                                            index={index}
                                            columns={columns}
                                            update={this.update}
                                            updateSelectedPrefix={this.updateSelectedPrefix}
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
