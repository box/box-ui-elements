import React from 'react';
import { mount } from 'enzyme';

import LabelPill, { LabelPillStatus } from '..';

describe('components/label-pill/LabelPill', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const FormattedMessage = (msgObject: any) => <span>{msgObject.defaultMessage}</span>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MockIcon = (props: any) => (
        <svg {...props}>
            <g />
        </svg>
    );

    test('should render default DOM with message', () => {
        const fullComponent = mount(
            <LabelPill.Pill>
                <LabelPill.Text>
                    <FormattedMessage
                        {...{
                            id: 'id.test',
                            defaultMessage: 'test message',
                            description: 'test message description',
                        }}
                    />
                </LabelPill.Text>
            </LabelPill.Pill>,
        );

        expect(fullComponent).toMatchSnapshot();
    });

    test('should render default DOM with icon component', () => {
        const fullComponent = mount(
            <LabelPill.Pill>
                <LabelPill.Icon Component={MockIcon} />
            </LabelPill.Pill>,
        );

        expect(fullComponent).toMatchSnapshot();
    });

    test('should include DOM for tooltip if specified', () => {
        const fullComponent = mount(
            <LabelPill.Pill>
                <LabelPill.Text>
                    <FormattedMessage
                        {...{
                            id: 'id.test',
                            defaultMessage: 'test message',
                            description: 'test message description',
                        }}
                    />
                </LabelPill.Text>
            </LabelPill.Pill>,
        );

        expect(fullComponent).toMatchSnapshot();
    });

    test('should spread props on the proper DOM element', () => {
        const expectedText = 'Sample ARIA text';
        const labelType = 'warning';
        const componentWithAria = mount(
            <LabelPill.Pill aria-label={expectedText} type={LabelPillStatus.WARNING}>
                <LabelPill.Text>
                    <FormattedMessage
                        {...{
                            id: 'id.test',
                            defaultMessage: 'test message',
                            description: 'test message description',
                        }}
                    />
                </LabelPill.Text>
            </LabelPill.Pill>,
        );

        expect(componentWithAria.find('.bdl-LabelPill').prop('aria-label')).toBe(expectedText);
        expect(componentWithAria.find(`.bdl-LabelPill--${labelType}`)).toHaveLength(1);
    });
});
