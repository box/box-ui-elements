// @flow
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import { FormattedMessage } from 'react-intl';

import QueryBar from './components/QueryBar';
import Table from './components/Table';
import Message from './components/Message';
import type { ColumnType } from './flowTypes';

import messages from './messages';

import './styles/MetadataView.scss';

type Props = {
    columnWidths: Object, // TODO: Replace Object with type.
    currentMessage?: string, // TODO: Rename to messageKeyPrefix.
    filesList: Array<Object>, // TODO: Replace Object with type.
    instances: Array<MetadataInstance>,
    onFilterChange?: Function,
    shouldDisableColumnButton: boolean,
    tableHeaderHeight: number,
    tableHeight: number,
    tableRowHeight: number,
    template: MetadataTemplate,
    templateName: string,
    templates: Array<MetadataTemplate>,
    totalWidth: number,
};

type State = {
    visibleColumns: Array<ColumnType>,
};

class MetadataView extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            visibleColumns: this.generateColumnsFromFields(props.template),
        };
    }

    onTemplateChange = () => {};

    generateColumnsFromFields = (template: MetadataTemplate): Array<ColumnType> => {
        const { fields } = template;
        let fieldColumns = [];
        if (fields) {
            fieldColumns = fields.map(field => ({
                displayName: field.displayName,
                key: field.key,
            }));
        }

        return fieldColumns.map(fieldColumn => {
            return {
                id: uniqueId('item_'),
                label: fieldColumn.displayName,
                isChecked: true,
                key: fieldColumn.key,
            };
        });
    };

    setColumnFilters = (unsavedVisibleColumns: Array<ColumnType>) => {
        this.setState({
            visibleColumns: unsavedVisibleColumns,
        });
    };

    render() {
        const {
            columnWidths,
            currentMessage,
            filesList,
            instances,
            onFilterChange,
            shouldDisableColumnButton,
            tableHeaderHeight,
            tableHeight,
            tableRowHeight,
            template,
            templates,
            templateName,
            totalWidth,
        } = this.props;
        const { visibleColumns } = this.state;
        const tableItems = instances.map(instance => instance.data);
        return (
            <section className="metadata-view">
                <section className="metadata-view-header">
                    <div className="metadata-view-title-container">
                        <div className="metadata-view-title">
                            <FormattedMessage
                                {...messages.metadataViewTitle}
                                values={{ filesNumber: filesList.length }}
                            />
                        </div>
                        <div className="metadata-view-template-name">
                            <p>{templateName}</p>
                        </div>
                    </div>

                    <div className="metadata-view-pagination" />
                </section>
                <QueryBar
                    activeTemplate={template}
                    onColumnChange={this.setColumnFilters}
                    onFilterChange={onFilterChange}
                    shouldDisableColumnButton={shouldDisableColumnButton}
                    templates={templates}
                    onTemplateChange={this.onTemplateChange}
                    visibleColumns={visibleColumns}
                />
                <section className="metadata-items-container">
                    {currentMessage ? (
                        <Message message={currentMessage} />
                    ) : (
                        <Table
                            columnWidths={columnWidths}
                            items={tableItems}
                            tableHeaderHeight={tableHeaderHeight}
                            tableHeight={tableHeight}
                            tableRowHeight={tableRowHeight}
                            template={template}
                            totalWidth={totalWidth}
                            columns={visibleColumns}
                        />
                    )}
                </section>
            </section>
        );
    }
}

export default MetadataView;
