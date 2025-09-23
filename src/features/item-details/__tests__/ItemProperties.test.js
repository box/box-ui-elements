import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import { ITEM_TYPE_FOLDER, ITEM_TYPE_FILE } from '../../../common/constants';

import ItemProperties from '../ItemProperties';

jest.mock('../EditableDescription', () => {
    return function MockEditableDescription({ value, textAreaProps }) {
        return <textarea data-testid="editable-description" value={value} {...textAreaProps} readOnly />;
    };
});

jest.mock('../EditableURL', () => {
    return function MockEditableURL({ value }) {
        return <input data-testid="editable-url" value={value} readOnly />;
    };
});

jest.mock('../ReadonlyDescription', () => {
    return function MockReadonlyDescription({ value }) {
        return <div data-testid="readonly-description">{value}</div>;
    };
});

jest.mock('../RetentionPolicy', () => {
    return function MockRetentionPolicy(props) {
        return <div data-testid="retention-policy" {...props} />;
    };
});

describe('features/item-details/ItemProperties', () => {
    const renderComponent = (props = {}) => {
        return render(<ItemProperties {...props} />);
    };

    test('should render empty properties list and RetentionPolicy when no properties are specified', () => {
        renderComponent();

        const propertiesList = document.querySelector('.item-properties');
        expect(propertiesList).toBeInTheDocument();

        expect(screen.getByTestId('retention-policy')).toBeInTheDocument();

        expect(screen.queryByText('Description')).not.toBeInTheDocument();
        expect(screen.queryByText('URL')).not.toBeInTheDocument();
        expect(screen.queryByText('Owner')).not.toBeInTheDocument();
        expect(screen.queryByText('Size')).not.toBeInTheDocument();
    });

    test('should render all properties when specified', () => {
        renderComponent({
            archivedAt: 1726832355000,
            createdAt: '2012-12-12T11:04:26-08:00',
            description: 'Hi\ntesting this link http://box.com',
            enterpriseOwner: 'Test Enterprise Owner',
            modifiedAt: 1459832991883,
            owner: 'Test Owner',
            size: '3.3 KB',
            trashedAt: '2013-02-07T10:49:34-08:00',
            uploader: 'Test Uploader',
        });

        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Owner')).toBeInTheDocument();
        expect(screen.getByText('Enterprise Owner')).toBeInTheDocument();
        expect(screen.getByText('Uploader')).toBeInTheDocument();
        expect(screen.getByText('Created')).toBeInTheDocument();
        expect(screen.getByText('Modified')).toBeInTheDocument();
        expect(screen.getByText('Archived')).toBeInTheDocument();
        expect(screen.getByText('Size')).toBeInTheDocument();
        expect(screen.getByText('Deleted')).toBeInTheDocument();

        expect(screen.getByTestId('readonly-description')).toHaveTextContent('Hi testing this link http://box.com');
        expect(screen.getByText('Test Owner')).toBeInTheDocument();
        expect(screen.getByText('Test Enterprise Owner')).toBeInTheDocument();
        expect(screen.getByText('Test Uploader')).toBeInTheDocument();
        expect(screen.getByText('3.3 KB')).toBeInTheDocument();

        const createdLabel = screen.getByText('Created');
        expect(createdLabel.nextElementSibling).toHaveTextContent(/Dec 12, 2012/);

        const modifiedLabel = screen.getByText('Modified');
        expect(modifiedLabel.nextElementSibling).toHaveTextContent(/Apr 4, 2016/);

        const archivedLabel = screen.getByText('Archived');
        expect(archivedLabel.nextElementSibling).toHaveTextContent(/Sep 20, 2024/);

        const deletedLabel = screen.getByText('Deleted');
        expect(deletedLabel.nextElementSibling).toHaveTextContent(/Feb 7, 2013/);
    });

    describe('description field', () => {
        test('should render editable description when onDescriptionChange is specified with description', () => {
            const mockOnDescriptionChange = jest.fn();
            renderComponent({
                description: 'test description',
                descriptionTextareaProps: {
                    'data-resin-target': 'description',
                },
                onDescriptionChange: mockOnDescriptionChange,
            });

            expect(screen.getByText('Description')).toBeInTheDocument();
            expect(screen.getByTestId('editable-description')).toHaveValue('test description');
            expect(screen.getByTestId('editable-description')).toHaveAttribute('data-resin-target', 'description');
        });

        test('should render editable description when onDescriptionChange is specified with empty description', () => {
            const mockOnDescriptionChange = jest.fn();
            renderComponent({
                description: '',
                descriptionTextareaProps: {
                    'data-resin-target': 'description',
                },
                onDescriptionChange: mockOnDescriptionChange,
            });

            expect(screen.getByText('Description')).toBeInTheDocument();
            expect(screen.getByTestId('editable-description')).toHaveValue('');
            expect(screen.getByTestId('editable-description')).toHaveAttribute('data-resin-target', 'description');
        });

        test('should render readonly description when only description is provided', () => {
            renderComponent({
                description: 'readonly description',
            });

            expect(screen.getByText('Description')).toBeInTheDocument();
            expect(screen.getByTestId('readonly-description')).toHaveTextContent('readonly description');
        });
    });

    describe('url field', () => {
        test('should render readonly url when only url is specified', () => {
            renderComponent({ url: 'box.com' });

            expect(screen.getByText('URL')).toBeInTheDocument();
            expect(screen.getByText('box.com')).toBeInTheDocument();
            expect(screen.queryByTestId('editable-url')).not.toBeInTheDocument();
        });

        test('should render editable url when url and onValidURLChange are specified', () => {
            const mockOnValidURLChange = jest.fn();
            renderComponent({
                onValidURLChange: mockOnValidURLChange,
                url: 'box.com',
            });

            expect(screen.getByText('URL')).toBeInTheDocument();
            expect(screen.getByTestId('editable-url')).toHaveValue('box.com');
            expect(screen.queryByText('box.com')).not.toBeInTheDocument();
        });
    });

    describe('size field', () => {
        test('should render size when size is specified', () => {
            renderComponent({ size: '1.5 MB' });

            expect(screen.getByText('1.5 MB')).toBeInTheDocument();
        });

        test('should render files count when filesCount is specified', () => {
            renderComponent({ size: '1.5 MB', filesCount: 10, type: ITEM_TYPE_FOLDER });

            expect(screen.getByText('10 Files')).toBeInTheDocument();
        });

        test('should not render files count when size is not specified', () => {
            renderComponent({ filesCount: 10, type: ITEM_TYPE_FOLDER });

            expect(screen.queryByText('10 Files')).not.toBeInTheDocument();
        });

        test('should not render files count when type is not folder', () => {
            renderComponent({ filesCount: 10, type: ITEM_TYPE_FILE });

            expect(screen.queryByText('10 Files')).not.toBeInTheDocument();
        });

        test('should render proper text for singular files count', () => {
            renderComponent({ size: '1.5 MB', filesCount: 1, type: ITEM_TYPE_FOLDER });

            expect(screen.getByText('1 File')).toBeInTheDocument();
        });

        test('should work properly for zero values', () => {
            renderComponent({ size: '0 B', filesCount: 0, type: ITEM_TYPE_FOLDER });

            expect(screen.getByText('0 B')).toBeInTheDocument();
            expect(screen.getByText('0 Files')).toBeInTheDocument();
        });
    });
});
