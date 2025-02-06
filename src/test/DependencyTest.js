// @flow
import * as React from 'react';
import { StrictMode } from 'react';
import { IntlProvider } from 'react-intl';
import { renderElement } from '../utils/react-root-utils';
import VirtualizedTable from '../features/virtualized-table/VirtualizedTable';
import Tooltip from '../components/tooltip/Tooltip';

const data = Array(100)
    .fill(null)
    .map((_, index) => ({
        id: index,
        name: `Item ${index}`,
        size: Math.floor(Math.random() * 1000),
    }));

const columns = [
    {
        dataKey: 'name',
        label: 'Name',
        width: 200,
    },
    {
        dataKey: 'size',
        label: 'Size',
        width: 100,
    },
];

function DependencyTest() {
    return (
        <StrictMode>
            <IntlProvider messages={{}} locale="en">
                <div style={{ height: '100vh', padding: 20 }}>
                    <h1>Dependency Test</h1>

                    <div style={{ marginBottom: 20 }}>
                        <Tooltip text="This is a tooltip test">
                            <button type="button">Hover me for tooltip</button>
                        </Tooltip>
                    </div>

                    <div style={{ height: 400 }}>
                        <VirtualizedTable columns={columns} data={data} height={400} rowData={data} width={800} />
                    </div>
                </div>
            </IntlProvider>
        </StrictMode>
    );
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('root');
    if (container) {
        renderElement(<DependencyTest />, container);
    }
});
