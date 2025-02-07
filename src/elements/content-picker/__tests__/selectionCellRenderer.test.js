import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import selectionCellRenderer from '../selectionCellRenderer';

const rowData = {
    name: 'test',
    selected: true,
    type: 'file',
};

describe('selectionCellRenderer', () => {
    test.each([
        [true, 'radio'],
        [false, 'checkbox'],
    ])('should render %s when isRadio is %s', (isRadio, expectedRole) => {
        const Element = selectionCellRenderer(() => {}, 'file, web_link', [], false, isRadio);

        render(<Element rowData={rowData} />);
        expect(screen.getByRole(expectedRole)).toBeInTheDocument();
    });

    test.each([
        [true, 'radio'],
        [false, 'checkbox'],
    ])('should render %s with correct checked state when isRadio is %s', (isRadio, expectedRole) => {
        const Element = selectionCellRenderer(() => {}, 'file, web_link', [], false, isRadio);

        render(<Element rowData={rowData} />);
        const input = screen.getByRole(expectedRole);
        expect(input).toBeInTheDocument();
        expect(input).toBeChecked();
    });
});
