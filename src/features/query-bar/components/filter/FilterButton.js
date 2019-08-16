// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import cloneDeep from 'lodash/cloneDeep';

import IconMetadataFilter from '../../../../icons/metadata-view/IconMetadataFilter';
import Condition from './Condition';
import Button from '../../../../components/button/Button';
import PrimaryButton from '../../../../components/primary-button/PrimaryButton';
import MenuToggle from '../../../../components/dropdown-menu/MenuToggle';
import { Flyout, Overlay } from '../../../../components/flyout';
import { AND, OR, COLUMN_OPERATORS } from '../../constants';

import messages from '../../messages';

import type {
    ColumnType,
    ConditionType,
    ConditionValueType,
    ConnectorType,
    OperatorType,
    OptionType,
} from '../../flowTypes';

type State = {
    hasUserSubmitted: boolean,
    isMenuOpen: boolean,
    selectedConnector: ConnectorType,
    transientConditions: Array<Object>,
};

type Props = {
    columns?: Array<ColumnType>,
    conditions: Array<ConditionType>,
    onFilterChange?: Function,
};

class FilterButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            hasUserSubmitted: false,
            isMenuOpen: false,
            selectedConnector: AND,
            transientConditions: cloneDeep(this.props.conditions),
        };
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        const { columns, conditions } = this.props;
        const { isMenuOpen, transientConditions } = this.state;
        const { isMenuOpen: prevIsMenuOpen } = prevState;
        const wasFlyoutOpened = isMenuOpen && !prevIsMenuOpen;
        if (wasFlyoutOpened) {
            const hasUnsavedConditions = transientConditions.length > 0;
            const shouldSetInitialCondition = conditions.length === 0;

            if (!hasUnsavedConditions) {
                if (shouldSetInitialCondition) {
                    const newConditions = columns && columns.length === 0 ? [] : [this.createCondition()];
                    this.setState({
                        transientConditions: newConditions,
                    });
                } else {
                    this.setState({
                        transientConditions: cloneDeep(this.props.conditions),
                    });
                }
            }
        }
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
        if (columns && columns.length > 0) {
            const firstColumn = columns[0];
            const operator = COLUMN_OPERATORS[firstColumn.type][0].key;

            return {
                columnId: firstColumn.id,
                id: conditionID,
                operator,
                values: [],
            };
        }
        throw new Error('Columns Required');
    };

    addFilter = () => {
        const newCondition = this.createCondition();
        this.setState({
            transientConditions: [...this.state.transientConditions, newCondition],
            hasUserSubmitted: false,
        });
    };

    applyFilters = () => {
        const { onFilterChange } = this.props;
        const { transientConditions } = this.state;

        const areAllValid = this.areAllValid();

        if (areAllValid) {
            if (onFilterChange) {
                onFilterChange(transientConditions);
            }
            this.setState({
                isMenuOpen: false,
                transientConditions: [],
                hasUserSubmitted: false,
            });
        } else {
            this.setState({
                hasUserSubmitted: true,
            });
        }
    };

    updateConditionState = (conditionId: string, updateCondition: Function) => {
        const { transientConditions } = this.state;
        let newConditionIndex = 0;
        const conditionToUpdate = transientConditions.find((currentCondition, index) => {
            newConditionIndex = index;
            return currentCondition.id === conditionId;
        });

        let newCondition = { ...conditionToUpdate };
        newCondition = updateCondition(newCondition);

        const newConditions = cloneDeep(transientConditions);
        newConditions[newConditionIndex] = newCondition;

        this.setState({
            transientConditions: newConditions,
        });
    };

    handleColumnChange = (condition: ConditionType, columnId: string) => {
        const { columns } = this.props;
        const { transientConditions } = this.state;
        let newConditionIndex = 0;
        const conditionToUpdate = transientConditions.find((currentCondition, index) => {
            newConditionIndex = index;
            return currentCondition.id === condition.id;
        });

        const column = columns && columns.find(c => c.id === columnId);
        if (!column) {
            throw new Error('Invalid Column.id');
        }

        const type = column && column.type;

        const operator = COLUMN_OPERATORS[type][0].key;

        const newCondition = {
            ...conditionToUpdate,
            columnId,
            operator,
            values: [],
        };

        const newConditions = cloneDeep(transientConditions);
        newConditions[newConditionIndex] = newCondition;

        this.setState({
            transientConditions: newConditions,
        });
    };

    handleOperatorChange = (conditionId: string, value: OperatorType) => {
        this.updateConditionState(conditionId, condition => {
            condition.operator = value;
            return condition;
        });
    };

    handleValueChange = (conditionId: string, values: Array<ConditionValueType>) => {
        this.updateConditionState(conditionId, condition => {
            condition.values = values;
            return condition;
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
        const { transientConditions } = this.state;

        const conditionsAfterDeletion = transientConditions.filter((condition, conditionIndex) => {
            return conditionIndex !== index;
        });

        this.setState({
            transientConditions: conditionsAfterDeletion,
        });
    };

    areAllValid = () => {
        const { transientConditions } = this.state;
        let areAllValid = true;
        transientConditions.forEach(condition => {
            if (condition.values.length === 0) {
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
        const { columns, conditions } = this.props;
        const { transientConditions, hasUserSubmitted, isMenuOpen, selectedConnector } = this.state;

        const numberOfConditions = conditions.length;
        const areAllValid = this.areAllValid();

        const buttonClasses = classNames(
            'query-bar-button',
            numberOfConditions !== 0 && areAllValid ? 'is-active' : '',
        );

        const isFilterDisabled = !columns || columns.length === 0;

        return (
            <Flyout
                className="query-bar-filter-dropdown-flyout"
                closeOnClick
                closeOnClickOutside
                closeOnClickPredicate={this.shouldClose}
                onClose={this.onClose}
                onOpen={this.onOpen}
                overlayIsVisible={isMenuOpen}
                portaledClasses={['pika-single']} /* Element in DatePicker package  */
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
                            {numberOfConditions === 0 ? (
                                <FormattedMessage {...messages.filtersButtonText} />
                            ) : (
                                <FormattedMessage
                                    {...messages.multipleFiltersButtonText}
                                    values={{
                                        number: numberOfConditions,
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
                                {transientConditions.length === 0 ? (
                                    <FormattedMessage {...messages.noFiltersAppliedText} />
                                ) : null}
                                {transientConditions.map((condition, index) => {
                                    return (
                                        <Condition
                                            key={`metadata-view-filter-item-${condition.id}`}
                                            hasUserSubmitted={hasUserSubmitted}
                                            columns={columns}
                                            condition={condition}
                                            deleteCondition={this.deleteCondition}
                                            index={index}
                                            onColumnChange={this.handleColumnChange}
                                            onConnectorChange={this.handleConnectorChange}
                                            onOperatorChange={this.handleOperatorChange}
                                            onValueChange={this.handleValueChange}
                                            selectedConnector={selectedConnector}
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
