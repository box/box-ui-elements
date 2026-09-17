/* eslint-disable no-script-url -- javascript: payloads assert URL sanitization */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import ExecuteForm from '../ExecuteForm';

describe('elements/content-open-with/ExecuteForm', () => {
    const executePostData = {
        url: 'http://example.com',
        params: [
            { key: 'user', value: 'john_doe' },
            { key: 'token', value: 'abcd1234' },
        ],
    };
    const onSubmitMock = jest.fn();

    beforeEach(() => {
        onSubmitMock.mockClear();
    });

    test('submits the form on mount', () => {
        render(<ExecuteForm executePostData={executePostData} id="testForm" onSubmit={onSubmitMock} />);
        expect(onSubmitMock).toHaveBeenCalled();
    });

    test('renders an input for each param', () => {
        render(<ExecuteForm executePostData={executePostData} id="testForm" onSubmit={onSubmitMock} />);
        executePostData.params.forEach(({ key, value }) => {
            const input = screen.getByDisplayValue(value);
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('name', key);
        });
    });

    test('does not submit javascript: form actions', () => {
        render(
            <ExecuteForm
                executePostData={{ url: 'javascript:alert(1)', params: [] }}
                id="unsafeForm"
                onSubmit={onSubmitMock}
            />,
        );

        expect(onSubmitMock).not.toHaveBeenCalled();
        expect(document.getElementById('bcow-execute-form-unsafeForm')).not.toHaveAttribute('action');
    });
});
