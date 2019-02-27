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
import { AND, OR } from '../../constants';

import messages from '../../messages';

import type { ColumnType, OptionType, ConnectorType } from '../../flowTypes';

type State = {
    appliedConditions: Array<Object>,
    areErrorsEnabled: boolean,
    conditions: Array<Object>,
    isMenuOpen: boolean,
    selectedConnector: ConnectorType,
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
            selectedConnector: AND,
            areErrorsEnabled: false,
            isMenuOpen: false,
        };
    }

    componentDidMount() {
        const initialCondition = this.createCondition();

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

    createCondition = () => {
        const conditionID = uniqueId();
        const { columns } = this.props;
        if (columns) {
            const firstColumn = columns[0];

            return {
                columnId: firstColumn.id,
                id: conditionID,
                operatorDisplayText: '',
                operatorKey: 0,
                valueDisplayText: null,
                valueKey: null,
                valueType: firstColumn.type,
            };
        }
        return {};
    };

    addFilter = () => {
        const newCondition = this.createCondition();
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

    handleColumnChange = (condition: Object, columnId: string) => {
        const { columns } = this.props;
        const { conditions } = this.state;
        let newConditionIndex = 0;
        const conditionToUpdate = conditions.find((currentCondition, index) => {
            newConditionIndex = index;
            return currentCondition.id === condition.id;
        });

        const column = columns && columns.find(c => c.id === columnId);
        const valueType = column && column.type;

        const newCondition = {
            ...conditionToUpdate,
            columnId,
            operatorDisplayText: '',
            operatorKey: 0,
            valueDisplayText: null,
            valueKey: null,
            valueType,
        };

        const newConditions = conditions.slice(0);
        newConditions[newConditionIndex] = newCondition;

        this.setState({
            conditions: newConditions,
        });
    };

    handleFieldChange = (
        condition: Object,
        fieldDisplayText: string | Date,
        fieldDisplayTextType: string,
        fieldKey: string | Date,
        fieldKeyType: string,
        valueType: string,
    ) => {
        const { conditions } = this.state;
        let newConditionIndex = 0;
        const conditionToUpdate = conditions.find((currentCondition, index) => {
            newConditionIndex = index;
            return currentCondition.id === condition.id;
        });

        const newCondition = {
            ...conditionToUpdate,
            [fieldDisplayTextType]: fieldDisplayText,
            [fieldKeyType]: fieldKey,
            valueType,
        };

        const newConditions = conditions.slice(0);
        newConditions[newConditionIndex] = newCondition;

        this.setState({
            conditions: newConditions,
        });
    };

    handleConnectorChange = (option: OptionType) => {
        const convert = str => {
            switch (str) {
                case AND:
                    return AND;
                case OR:
                    return OR;
                default:
                    throw new Error('Invalid connector');
            }
        };

        this.setState({
            selectedConnector: convert(option.value),
        });
    };

    deleteCondition = (index: number) => {
        const { conditions } = this.state;

        const conditionsAfterDeletion = conditions.filter((condition, conditionIndex) => {
            return conditionIndex !== index;
        });

        this.setState({
            conditions: conditionsAfterDeletion,
        });
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
        const { appliedConditions, conditions, areErrorsEnabled, isMenuOpen, selectedConnector } = this.state;

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
                                            selectedConnector={selectedConnector}
                                            onFieldChange={this.handleFieldChange}
                                            onColumnChange={this.handleColumnChange}
                                            onConnectorChange={this.handleConnectorChange}
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
