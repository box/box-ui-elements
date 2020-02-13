import React from 'react';

import AvatarPill from '../AvatarPill';

describe('components/AvatarPill-selector-dropdown/AvatarPill', () => {
    const onRemoveStub = jest.fn();

    test('should render default component', () => {
        const wrapper = shallow(<AvatarPill onRemove={onRemoveStub} text="box" />);

        expect(wrapper).toMatchInlineSnapshot(`
            <LabelPill
              className="bdl-AvatarPill bdl-AvatarPill--noAvatar"
              size="large"
            >
              <LabelPillText
                className="bdl-AvatarPill-text"
              >
                box
              </LabelPillText>
              <LabelPillIcon
                Component={[Function]}
                className="bdl-AvatarPill-closeBtn"
                onClick={[MockFunction]}
              />
            </LabelPill>
        `);
    });

    test('should render avatar if showAvatar prop is true', () => {
        const wrapper = shallow(<AvatarPill onRemove={onRemoveStub} showAvatar text="box" />);

        expect(wrapper).toMatchInlineSnapshot(`
            <LabelPill
              className="bdl-AvatarPill"
              size="large"
            >
              <Avatar
                name="box"
                size="small"
              />
              <LabelPillText
                className="bdl-AvatarPill-text"
              >
                box
              </LabelPillText>
              <LabelPillIcon
                Component={[Function]}
                className="bdl-AvatarPill-closeBtn"
                onClick={[MockFunction]}
              />
            </LabelPill>
        `);

        expect(wrapper.find('Avatar')).toHaveLength(1);
    });

    test('should have the selected class when isSelected is true', () => {
        const wrapper = shallow(<AvatarPill isSelected isDisabled={false} onRemove={onRemoveStub} text="box" />);

        expect(wrapper.hasClass('bdl-AvatarPill-isSelected')).toBe(true);
    });

    test('should generate LabelPill with error type when isValid prop is false', () => {
        const wrapper = shallow(<AvatarPill isValid={false} onRemove={onRemoveStub} text="box" />);

        expect(wrapper.find('LabelPill').prop('type')).toBe('error');
    });

    test('should generate LabelPill with warning type when hasWarning prop is true', () => {
        const wrapper = shallow(<AvatarPill hasWarning onRemove={onRemoveStub} text="box" />);

        expect(wrapper.find('LabelPill').prop('type')).toBe('warning');
    });

    test('should disable click handler and add class when disabled', () => {
        const onRemoveMock = jest.fn();
        const wrapper = shallow(<AvatarPill isDisabled isValid onRemove={onRemoveMock} text="box" />);
        wrapper.simulate('click');
        expect(onRemoveMock).not.toBeCalled();
        expect(wrapper.childAt(0).hasClass('is-disabled'));
    });

    test('should not call click handler when isDisabled is true', () => {
        const wrapper = shallow(<AvatarPill onRemove={onRemoveStub} text="box" />);

        wrapper.setProps({ isDisabled: true });
        wrapper.find('LabelPillIcon').simulate('click');
        expect(onRemoveStub).toHaveBeenCalledTimes(0);

        wrapper.setProps({ isDisabled: false });
        wrapper.find('LabelPillIcon').simulate('click');
        expect(onRemoveStub).toHaveBeenCalledTimes(1);
    });
});
