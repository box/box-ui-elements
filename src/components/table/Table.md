### Examples

```
const columnHeaders = ['First Name', 'Last Name', 'Email'];

const data = [
    ['Phil', 'User', 'phil@example.com'],
    ['Jake', 'User', 'jake@example.com'],
    ['Janette', 'User', 'jheininger@example.com'],
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
