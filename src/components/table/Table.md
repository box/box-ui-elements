### Examples

```
const Table = require('box-ui-elements/es/components/table').Table;
const TableBody = require('box-ui-elements/es/components/table').TableBody;
const TableCell = require('box-ui-elements/es/components/table').TableCell;
const TableHeader = require('box-ui-elements/es/components/table').TableHeader;
const TableHeaderCell = require('box-ui-elements/es/components/table').TableHeaderCell;
const TableRow = require('box-ui-elements/es/components/table').TableRow;

const columnHeaders = ['First Name', 'Last Name', 'Email'];

const data = [
    ['Phil', 'Sheffield', 'phil@box.com'],
    ['Jake', 'Thomas', 'jake@box.com'],
    ['Janette', 'Heininger', 'jheininger@box.com'],
];

<Table>
    <TableHeader>
        {columnHeaders.map(header => (
            <TableHeaderCell key={ header }>
                {header}
            </TableHeaderCell>
        ))}
    </TableHeader>
    <TableBody>
        {data.map((row, index) => (
            <TableRow key={ index }>
                {row.map(cell => (
                    <TableCell key={ cell }>
                        {cell}
                    </TableCell>
                ))}
            </TableRow>
        ))}
    </TableBody>
</Table>
```

## Selectable Table

Note that the `makeSelectable` HOC used here requires a `HotkeyLayer` somewhere above it in its component tree.

```
const SelectableTableExamples = require('examples').SelectableTableExamples;

<SelectableTableExamples />
```
