import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import List from 'react-virtualized/dist/commonjs/List';

import 'react-virtualized/styles.css';

import FileVersionListItem from './FileVersionListItem';
import { VersionsPropType } from './prop-types';

import './FileVersionList.scss';

const DEFAULT_HEIGHT_PX = 96;
const LIST_HEIGHT_PX = 300;
const LIST_WIDTH_PX = 400;

class FileVersionList extends Component {
    /* eslint-disable no-underscore-dangle */
    static propTypes = {
        canDelete: PropTypes.bool,
        canUpload: PropTypes.bool,
        className: PropTypes.string,
        isProcessing: PropTypes.bool,
        onDelete: PropTypes.func.isRequired,
        onDownload: PropTypes.func.isRequired,
        onMakeCurrent: PropTypes.func.isRequired,
        onRestore: PropTypes.func.isRequired,
        scrollToVersionNumber: PropTypes.number,
        versions: VersionsPropType.isRequired,
        versionLimit: PropTypes.number,
    };

    constructor(props) {
        super(props);

        this._cache = new CellMeasurerCache({
            defaultHeight: DEFAULT_HEIGHT_PX,
            fixedWidth: true,
        });
    }

    componentDidMount() {
        this.recalculateRowHeights();
        this.jumpToVersionNumber();
    }

    componentDidUpdate(prevProps) {
        this.recalculateRowHeights();
        if (prevProps.scrollToVersionNumber !== this.props.scrollToVersionNumber) {
            this.jumpToVersionNumber();
        }
    }

    _cache = null;

    _list = null;

    recalculateRowHeights() {
        if (!this._list) {
            return;
        }

        this._cache.clearAll();
        this._list.recomputeRowHeights();
    }

    jumpToVersionNumber() {
        const { scrollToVersionNumber, versions } = this.props;

        if (!this._list || !scrollToVersionNumber || !versions) {
            return;
        }

        const scrollToIndex = versions.findIndex(version => version.versionNumber === scrollToVersionNumber);

        if (scrollToIndex >= 0) {
            this._list.scrollToRow(scrollToIndex);
        }
    }

    rowRenderer = ({ index, style, parent }) => {
        const {
            canDelete,
            canUpload,
            isProcessing,
            onDelete,
            onDownload,
            onMakeCurrent,
            onRestore,
            versions,
            versionLimit,
        } = this.props;

        const version = versions[index];
        const isOverVersionLimit = !!(versionLimit && index >= versionLimit);
        const key = version.id;

        return (
            <CellMeasurer key={key} cache={this._cache} columnIndex={0} parent={parent} rowIndex={index}>
                <FileVersionListItem
                    canDelete={canDelete}
                    canUpload={canUpload}
                    isOverVersionLimit={isOverVersionLimit}
                    isProcessing={isProcessing}
                    onDelete={onDelete}
                    onDownload={onDownload}
                    onMakeCurrent={onMakeCurrent}
                    onRestore={onRestore}
                    style={style}
                    version={version}
                    versionLimit={versionLimit}
                />
            </CellMeasurer>
        );
    };

    _setListRef = ref => {
        this._list = ref;
    };

    render() {
        const { className, versions } = this.props;

        return (
            <div className={classNames('file-version-list', className)}>
                <List
                    ref={this._setListRef}
                    deferredMeasurementCache={this._cache}
                    height={LIST_HEIGHT_PX}
                    rowCount={versions.length}
                    rowHeight={this._cache.rowHeight}
                    rowRenderer={this.rowRenderer}
                    scrollToAlignment="start"
                    width={LIST_WIDTH_PX}
                />
            </div>
        );
    }
}

export default FileVersionList;
