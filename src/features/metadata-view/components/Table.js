import React from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

import MetadataViewTable from './MetadataViewTable';

const Table = props => (
    <AutoSizer>{({ height, width }) => <MetadataViewTable height={height} width={width} {...props} />}</AutoSizer>
);

export default Table;
