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
        expect(propertiesList).toBeVisible();

        expect(screen.getByTestId('retention-policy')).toBeVisible();

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

        expect(screen.getByText('Description')).toBeVisible();
        expect(screen.getByText('Owner')).toBeVisible();
        expect(screen.getByText('Enterprise Owner')).toBeVisible();
        expect(screen.getByText('Uploader')).toBeVisible();
        expect(screen.getByText('Created')).toBeVisible();
        expect(screen.getByText('Modified')).toBeVisible();
        expect(screen.getByText('Archived')).toBeVisible();
        expect(screen.getByText('Size')).toBeVisible();
        expect(screen.getByText('Deleted')).toBeVisible();

        expect(screen.getByTestId('readonly-description')).toHaveTextContent('Hi testing this link http://box.com');
        expect(screen.getByText('Test Owner')).toBeVisible();
        expect(screen.getByText('Test Enterprise Owner')).toBeVisible();
        expect(screen.getByText('Test Uploader')).toBeVisible();
        expect(screen.getByText('3.3 KB')).toBeVisible();

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

            expect(screen.getByText('Description')).toBeVisible();
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

            expect(screen.getByText('Description')).toBeVisible();
            expect(screen.getByTestId('editable-description')).toHaveValue('');
            expect(screen.getByTestId('editable-description')).toHaveAttribute('data-resin-target', 'description');
        });

        test('should render readonly description when only description is provided', () => {
            renderComponent({
                description: 'readonly description',
            });

            expect(screen.getByText('Description')).toBeVisible();
            expect(screen.getByTestId('readonly-description')).toHaveTextContent('readonly description');
        });
    });

    describe('url field', () => {
        test('should render readonly url when only url is specified', () => {
            renderComponent({ url: 'box.com' });

            expect(screen.getByText('URL')).toBeVisible();
            expect(screen.getByText('box.com')).toBeVisible();
            expect(screen.queryByTestId('editable-url')).not.toBeInTheDocument();
        });

        test('should render editable url when url and onValidURLChange are specified', () => {
            const mockOnValidURLChange = jest.fn();
            renderComponent({
                onValidURLChange: mockOnValidURLChange,
                url: 'box.com',
            });

            expect(screen.getByText('URL')).toBeVisible();
            expect(screen.getByTestId('editable-url')).toHaveValue('box.com');
            expect(screen.queryByText('box.com')).not.toBeInTheDocument();
        });
    });

    describe('size field', () => {
        test('should render size when size is specified', () => {
            renderComponent({ size: '1.5 MB' });

            expect(screen.getByText('1.5 MB')).toBeVisible();
        });

        test('should render files count when filesCount is specified', () => {
            renderComponent({ size: '1.5 MB', filesCount: 10, type: ITEM_TYPE_FOLDER });

            expect(screen.getByText('10 Files')).toBeVisible();
        });

        test('should not render files count when size is not specified', () => {
            renderComponent({ filesCount: 10, type: ITEM_TYPE_FOLDER });

            expect(screen.queryByText('10 Files')).not.toBeInTheDocument();
        });

        test('should not render files count when type is not folder', () => {
            renderComponent({ filesCount: 10, type: ITEM_TYPE_FILE });

            expect(screen.queryByText('10 Files')).not.toBeInTheDocument();
        });

        test('should not render files count when filesCount is null', () => {
            renderComponent({ size: '1.5 MB', filesCount: null, type: ITEM_TYPE_FOLDER });
            expect(screen.queryByText(/Files$/)).not.toBeInTheDocument();
        });

        test('should render proper text for singular files count', () => {
            renderComponent({ size: '1.5 MB', filesCount: 1, type: ITEM_TYPE_FOLDER });

            expect(screen.getByText('1 File')).toBeVisible();
        });

        test('should work properly for zero values', () => {
            renderComponent({ size: '0 B', filesCount: 0, type: ITEM_TYPE_FOLDER });

            expect(screen.getByText('0 B')).toBeVisible();
            expect(screen.getByText('0 Files')).toBeVisible();
        });
    });
});
