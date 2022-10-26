import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { render, fireEvent, createEvent } from '@testing-library/react';
import AnnotationActivityLink from '../AnnotationActivityLink';
import messages from '../messages';

jest.mock('react-intl', () => jest.requireActual('react-intl'));
jest.requireActual('../../../../../components/plain-button/PlainButton');

describe('elements/content-sidebar/ActivityFeed/annotations/AnnotationActivityLink', () => {
    const wrapperProps = {
        id: '123',
        fileVersion: 'file_version',
        isCurrentVersion: true,
        isFileVersionUnavailable: false,
        locationValue: 1,
        shouldHideLink: false,
    };

    const getWrapper = props =>
        render(
            <IntlProvider locale="en">
                <AnnotationActivityLink {...wrapperProps} {...props} />
            </IntlProvider>,
        );

    test('should correctly render annotation activity link', () => {
        const { getByTestId } = getWrapper();

        expect(getByTestId('bcs-AnnotationActivity-link')).toBeInTheDocument();
    });

    test('should return null id shouldHideLink is true', () => {
        const { container } = getWrapper({ shouldHideLink: true });

        expect(container).toBeEmptyDOMElement(); // to be null?
    });

    test('should fire onClick when the button is clicked', () => {
        const onClickFn = jest.fn();
        const { getByTestId } = getWrapper({ onClick: onClickFn });

        const button = getByTestId('bcs-AnnotationActivity-link');
        const buttonClick = createEvent.click(button);
        Object.assign(buttonClick, { preventDefault: jest.fn(), stopPropagation: jest.fn() });

        fireEvent(button, buttonClick);

        expect(onClickFn).toHaveBeenCalledWith('123');
        expect(button).toHaveFocus();
        expect(buttonClick.stopPropagation).toBeCalled();
        expect(buttonClick.preventDefault).toBeCalled();
    });

    test.each`
        fileVersion       | isCurrentVersion | expectedMessage
        ${'file_version'} | ${false}         | ${'Version file_version'}
        ${'file_version'} | ${true}          | ${'Page 1'}
        ${null}           | ${false}         | ${messages.annotationActivityVersionUnavailable.defaultMessage}
        ${null}           | ${true}          | ${messages.annotationActivityVersionUnavailable.defaultMessage}
    `(
        'should render message $expectedMessage if isFileVersionUnavailable is $isFileVersionUnavailable and isCurrentVersion is $isCurrentVersion',
        ({ expectedMessage, fileVersion, isCurrentVersion }) => {
            const { getByText } = getWrapper({ fileVersion, isCurrentVersion });

            expect(getByText(expectedMessage)).toBeInTheDocument();
        },
    );

    test.each`
        fileVersion       | expected
        ${'file_version'} | ${1}
        ${null}           | ${0}
    `('should handle the mousedown event if fileVersion is $fileVersion', ({ expected, fileVersion }) => {
        const { getByTestId } = getWrapper({ fileVersion });

        const button = getByTestId('bcs-AnnotationActivity-link');
        const onMouseDown = createEvent.mouseDown(button);
        Object.assign(onMouseDown, {
            stopImmediatePropagation: jest.fn(),
        });

        fireEvent(button, onMouseDown);

        expect(onMouseDown.stopImmediatePropagation).toBeCalledTimes(expected);
    });
});
