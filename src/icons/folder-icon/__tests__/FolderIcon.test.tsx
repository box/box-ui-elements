import * as React from 'react';
import { shallow } from 'enzyme';

import FolderIcon from '../FolderIcon';

describe('icons/folder-icon/FolderIcon', () => {
    const getWrapper = (props = {}) => shallow(<FolderIcon {...props} />);

    test('should render default 32 icon when no props are defined', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should render and external icon when isExternal is true', () => {
        const wrapper = getWrapper({ isExternal: true });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render and collab icon when isCollab is true', () => {
        const wrapper = getWrapper({ isCollab: true });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render archive icon when isArchive is true', () => {
        const wrapper = getWrapper({ isArchive: true });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render archived folder icon when isArchivedFolder is true', () => {
        const wrapper = getWrapper({ isArchivedFolder: true });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render and external icon when isExternal and isCollab is true', () => {
        const wrapper = getWrapper({
            isCollab: true,
            isExternal: true,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render 64 icon when dimension is defined', () => {
        const wrapper = getWrapper({ dimension: 64 });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render title when title is defined', () => {
        const wrapper = getWrapper({ title: 'title' });

        expect(wrapper).toMatchSnapshot();
    });
});
