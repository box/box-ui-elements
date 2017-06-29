import React from 'react';
import { shallow } from 'enzyme';
import FolderIcon from '../FolderIcon';
import IconFolderCollab from '../IconFolderCollab';
import IconFolderExternal from '../IconFolderExternal';
import IconFolderPersonal from '../IconFolderPersonal';

const sandbox = sinon.sandbox.create();

describe('icons/folder/FolderIcon', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    it('should render default 32 icon when no props are defined', () => {
        const component = shallow(<FolderIcon />);

        assert.ok(component.contains(<IconFolderPersonal height={32} width={32} />));
    });

    it('should render and external icon when isExternal is true', () => {
        const component = shallow(<FolderIcon isExternal />);

        assert.ok(component.contains(<IconFolderExternal height={32} width={32} />));
    });

    it('should render and collab icon when isCollab is true', () => {
        const component = shallow(<FolderIcon isCollab />);

        assert.ok(component.contains(<IconFolderCollab height={32} width={32} />));
    });

    it('should render and external icon when isExternal and isCollab is true', () => {
        const component = shallow(<FolderIcon isCollab isExternal />);

        assert.ok(component.contains(<IconFolderExternal height={32} width={32} />));
    });

    it('should render 64 icon when dimension is defined', () => {
        const component = shallow(<FolderIcon dimension={64} />);

        assert.ok(component.contains(<IconFolderPersonal height={64} width={64} />));
    });
});
