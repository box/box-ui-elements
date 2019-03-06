// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { Flyout, Overlay } from '../../../components/flyout';
import Button from '../../../components/button/Button';
import MenuToggle from '../../../components/dropdown-menu/MenuToggle';
import IconMetadataColumns from '../../../icons/metadata-view/IconMetadataColumns';
import ColumnButtonOverlay from './ColumnButtonOverlay';

import type { ColumnType } from '../flowTypes';

import messages from '../messages';

type State = {
    isColumnMenuOpen: boolean,
};

type Props = {
    columns: Array<ColumnType>,
    onColumnChange?: (columnTypes: Array<ColumnType>) => void,
    template?: MetadataTemplate,
};

class ColumnButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isColumnMenuOpen: false,
        };
    }

    onClose = () => {
        this.setState({
            isColumnMenuOpen: false,
        });
    };

    onOpen = () => {
        this.setState({
            isColumnMenuOpen: true,
        });
    };

    toggleColumnButton = () => {
        this.setState({ isColumnMenuOpen: !this.state.isColumnMenuOpen });
    };

    getNumberOfHiddenColumns = () => {
        const { columns } = this.props;

        return columns.reduce((total, column) => {
            if (!column.isShown) {
                return total + 1;
            }
            return total;
        }, 0);
    };

    render() {
        const { template, columns, onColumnChange } = this.props;
        const { isColumnMenuOpen } = this.state;
        const numberOfHiddenColumns = this.getNumberOfHiddenColumns();

        const buttonClasses = classNames('query-bar-button', numberOfHiddenColumns !== 0 ? 'is-active' : '');

        return (
            <Flyout
                className="query-bar-column-dropdown-flyout"
                closeOnClick
                closeOnClickOutside
                onClose={this.onClose}
                onOpen={this.onOpen}
                position="bottom-right"
            >
                <Button
                    className={buttonClasses}
                    isDisabled={template === undefined}
                    onClick={this.toggleColumnButton}
                    type="button"
                >
                    <MenuToggle>
                        <IconMetadataColumns />
                        <span className="button-label">
                            {numberOfHiddenColumns === 0 ? (
                                <FormattedMessage {...messages.columnsButtonText} />
                            ) : (
                                <FormattedMessage
                                    {...messages.columnsHiddenButtonText}
                                    values={{
                                        number: numberOfHiddenColumns,
                                    }}
                                />
                            )}
                        </span>
                    </MenuToggle>
                </Button>

                <Overlay>
                    {isColumnMenuOpen ? (
                        <ColumnButtonOverlay columns={columns} onColumnChange={onColumnChange} />
                    ) : (
                        <div />
                    )}
                </Overlay>
            </Flyout>
        );
    }
}

export default ColumnButton;
