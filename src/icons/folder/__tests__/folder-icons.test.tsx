import React from 'react';
import { shallow } from 'enzyme';

import IconFolderCollab from '../IconFolderCollab';
import IconFolderExternal from '../IconFolderExternal';
import IconFolderPersonal from '../IconFolderPersonal';
import IconSmallFolder from '../IconSmallFolder';

describe('icons/folder/*', () => {
    [
        {
            IconComponent: IconFolderPersonal,
        },
        {
            IconComponent: IconFolderExternal,
        },
        {
            IconComponent: IconFolderCollab,
        },
        {
            IconComponent: IconSmallFolder,
        },
    ].forEach(({ IconComponent }) => {
        test('should correctly render icon', () => {
            const component = shallow(<IconComponent />);

            expect(component.find('AccessibleSVG').length).toEqual(1);
        });

        test('should correctly render icon with props', () => {
            const component = shallow(<IconComponent className="test" height={42} title="awesome title" width={42} />);

            expect(component.find('AccessibleSVG').length).toEqual(1);
            expect(component.find('.test').length).toEqual(1);
            expect(component.find('AccessibleSVG').prop('height')).toEqual(42);
            expect(component.find('AccessibleSVG').prop('width')).toEqual(42);
            expect(component.find('AccessibleSVG').prop('title')).toEqual('awesome title');
        });

        describe('title prop can accept a string type or an element type', () => {
            test('should render icon with title prop being a string type', () => {
                const component = shallow(<IconComponent title="hello" />);

                expect(component.find('AccessibleSVG').prop('title')).toEqual('hello');
            });

            test('should render icon with title prop being element type', () => {
                const TestElement = <div>Funny Title</div>;
                const component = shallow(<IconComponent title={TestElement} />);

                expect(component.find('AccessibleSVG').prop('title')).toEqual(TestElement);
            });
        });
    });
});
