import React from 'react';

import RoundPill from '../RoundPill';

describe('components/RoundPill-selector-dropdown/RoundPill', () => {
    const onRemoveStub = jest.fn();

    test('should render default component', () => {
        const wrapper = shallow(<RoundPill onRemove={onRemoveStub} text="box" />);

        expect(wrapper).toMatchInlineSnapshot(`
            <LabelPill
              className="bdl-RoundPill"
              size="large"
            >
              <LabelPillText
                className="bdl-RoundPill-text"
              >
                box
              </LabelPillText>
              <LabelPillIcon
                Component={[Function]}
                className="bdl-RoundPill-closeBtn"
                onClick={[MockFunction]}
              />
            </LabelPill>
        `);
    });

    test('should render avatar if showAvatar prop is true', () => {
        const wrapper = shallow(<RoundPill onRemove={onRemoveStub} showAvatar text="box" />);

        expect(wrapper).toMatchInlineSnapshot(`
            <LabelPill
              className="bdl-RoundPill"
              size="large"
            >
              <LabelPillIcon
                Component={[Function]}
                name="box"
                shouldShowExternal={true}
                size="small"
              />
              <LabelPillText
                className="bdl-RoundPill-text"
              >
                box
              </LabelPillText>
              <LabelPillIcon
                Component={[Function]}
                className="bdl-RoundPill-closeBtn"
                onClick={[MockFunction]}
              />
            </LabelPill>
        `);

        expect(wrapper.find('LabelPillIcon')).toHaveLength(2);
    });

    test('should have the selected class when isSelected is true', () => {
        const wrapper = shallow(<RoundPill isSelected isDisabled={false} onRemove={onRemoveStub} text="box" />);

        expect(wrapper.hasClass('bdl-RoundPill--selected')).toBe(true);
    });

    test('should generate LabelPill with error type when isValid prop is false', () => {
        const wrapper = shallow(<RoundPill isValid={false} onRemove={onRemoveStub} text="box" />);

        expect(wrapper.find('LabelPill').prop('type')).toBe('error');
        expect(wrapper.hasClass('bdl-RoundPill--error')).toBe(true);
    });

    test('should generate LabelPill with warning type when hasWarning prop is true', () => {
        const wrapper = shallow(<RoundPill hasWarning onRemove={onRemoveStub} text="box" />);

        expect(wrapper.find('LabelPill').prop('type')).toBe('warning');
        expect(wrapper.hasClass('bdl-RoundPill--warning')).toBe(true);
    });

    test('should generate LabelPill with error type when isValid is false and hasWarning is true', () => {
        const wrapper = shallow(<RoundPill isValid={false} hasWarning onRemove={onRemoveStub} text="box" />);

        expect(wrapper.find('LabelPill').prop('type')).toBe('error');
        expect(wrapper.hasClass('bdl-RoundPill--error')).toBe(true);
    });

    test('should disable click handler and add class when disabled', () => {
        const onRemoveMock = jest.fn();
        const wrapper = shallow(<RoundPill isDisabled isValid onRemove={onRemoveMock} text="box" />);
        wrapper.simulate('click');
        expect(onRemoveMock).not.toBeCalled();
        expect(wrapper.childAt(0).hasClass('is-disabled'));
        expect(wrapper.hasClass('bdl-RoundPill--disabled')).toBe(true);
    });

    test('should not call click handler when isDisabled is true', () => {
        const wrapper = shallow(<RoundPill onRemove={onRemoveStub} text="box" />);

        wrapper.setProps({ isDisabled: true });
        wrapper.find('LabelPillIcon').simulate('click');
        expect(onRemoveStub).toHaveBeenCalledTimes(0);

        wrapper.setProps({ isDisabled: false });
        wrapper.find('LabelPillIcon').simulate('click');
        expect(onRemoveStub).toHaveBeenCalledTimes(1);
    });
});
