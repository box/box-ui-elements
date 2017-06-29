import React from 'react';
import { shallow } from 'enzyme';
import { IconFolderCollab, IconFolderExternal, IconFolderPersonal } from '../';

const sandbox = sinon.sandbox.create();

describe('icons/folder/*', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    it('should correctly render icon for personal folder', () => {
        const component = shallow(<IconFolderPersonal className='test' width={42} height={42} />);

        assert.equal(component.find('svg').length, 1);
        assert.equal(component.find('.test').length, 1);
        assert.equal(component.find('svg').prop('height'), 42);
        assert.equal(component.find('svg').prop('width'), 42);
    });

    it('should correctly render icon for external folder', () => {
        const component = shallow(<IconFolderExternal className='test' width={42} height={42} />);

        assert.equal(component.find('svg').length, 1);
        assert.equal(component.find('.test').length, 1);
        assert.equal(component.find('svg').prop('height'), 42);
        assert.equal(component.find('svg').prop('width'), 42);
    });

    it('should correctly render icon for collab folder', () => {
        const component = shallow(<IconFolderCollab className='test' width={42} height={42} />);

        assert.equal(component.find('svg').length, 1);
        assert.equal(component.find('.test').length, 1);
        assert.equal(component.find('svg').prop('height'), 42);
        assert.equal(component.find('svg').prop('width'), 42);
    });
});
