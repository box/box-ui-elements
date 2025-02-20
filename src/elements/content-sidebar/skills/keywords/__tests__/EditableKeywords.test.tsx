import * as React from 'react';
import { render, screen, fireEvent } from '../../../../../test-utils/testing-library';
import EditableKeywords from '../EditableKeywords';
import type { SkillCardEntry } from '../../../../../common/types/skills';

describe('elements/content-sidebar/skills/keywords/EditableKeywords', () => {
    const defaultProps = {
        keywords: [{ text: 'foo' }, { text: 'bar' }] as SkillCardEntry[],
        onAdd: jest.fn(),
        onDelete: jest.fn(),
        onSave: jest.fn(),
        onCancel: jest.fn(),
    };

    const renderComponent = (props = {}) => render(<EditableKeywords {...defaultProps} {...props} />);

    test('renders component correctly', () => {
        renderComponent();

        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    test('handles enter key press when not in composition mode', () => {
        const { container } = renderComponent();
        const textarea = container.querySelector('textarea');
        expect(textarea).toBeInTheDocument();

        fireEvent.input(textarea as HTMLElement, { target: { value: 'test' } });
        fireEvent.keyDown(textarea as HTMLElement, { key: 'Enter' });
        expect(defaultProps.onAdd).toHaveBeenCalledWith({
            type: 'text',
            text: 'test',
        });
    });

    test('does not handle enter key press when in composition mode', () => {
        const { container } = renderComponent();
        const input = container.querySelector('textarea');
        expect(input).toBeInTheDocument();

        fireEvent.compositionStart(input as HTMLElement);
        fireEvent.keyDown(input as HTMLElement, { key: 'Enter' });
        expect(defaultProps.onAdd).not.toHaveBeenCalled();
    });

    test('updates when new keywords are provided', () => {
        const { rerender } = renderComponent();
        const newKeywords = [{ text: 'test' }] as SkillCardEntry[];

        rerender(<EditableKeywords {...defaultProps} keywords={newKeywords} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('');
    });
});
