// @flow
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import AnnotationThreadCreate from '../AnnotationThreadCreate';

jest.mock('react-intl', () => jest.requireActual('react-intl'));
jest.mock('../../comment-form', () => props => {
    return (
        <div>
            {props.isOpen && (
                <div>
                    <button type="button" onClick={props.onCancel}>
                        Cancel
                    </button>
                    <button type="button" onClick={() => props.createComment({ text: 'example message' })}>
                        Post
                    </button>
                </div>
            )}
        </div>
    );
});

describe('elements/content-sidebar/activity-feed/annotation-thread/AnnotationThreadCreate', () => {
    const getDefaultProps = () => ({
        currentUser: { id: 'user_id' },
        onFormCancel: jest.fn(),
        onFormSubmit: jest.fn(),
    });

    const IntlWrapper = ({ children }: { children?: React.ReactNode }) => {
        return <IntlProvider locale="en">{children}</IntlProvider>;
    };
    const getWrapper = props =>
        render(<AnnotationThreadCreate {...getDefaultProps()} {...props} />, {
            wrapper: IntlWrapper,
        });

    test('Should render correctly', () => {
        const { container, getByText } = getWrapper();

        expect(getByText('Cancel')).toBeInTheDocument();
        expect(container.getElementsByClassName('AnnotationThreadCreate-is-pending')).toHaveLength(0);
    });

    test('Should render correctly with pending state', () => {
        const { getByTestId } = getWrapper({ isPending: true });

        expect(getByTestId('annotation-create')).toHaveClass('is-pending');
    });

    test('Should call onFormSubmit on create', () => {
        const onFormSubmit = jest.fn();

        const { getByText } = getWrapper({ onFormSubmit });

        fireEvent.click(getByText('Post'));

        expect(onFormSubmit).toBeCalledWith('example message');
    });

    test('Should call onFormCancel on cancel', () => {
        const onFormCancel = jest.fn();

        const { getByText } = getWrapper({ onFormCancel });

        fireEvent.click(getByText('Cancel'));

        expect(onFormCancel).toBeCalled();
    });
});
