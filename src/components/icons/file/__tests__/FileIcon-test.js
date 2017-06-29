import React from 'react';
import { shallow } from 'enzyme';
import FileIcon from '../FileIcon';
import IconFileDefault from '../IconFileDefault';
import IconFileZip from '../IconFileZip';

const sandbox = sinon.sandbox.create();

describe('icons/file/FileIcon', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    it('should render default 32 icon when no extension and dimension is defined', () => {
        const component = shallow(<FileIcon />);
        assert.ok(component.contains(<IconFileDefault height={32} width={32} />));
    });

    it('should render zip icon when extension is defined', () => {
        const component = shallow(<FileIcon extension='zip' />);

        assert.ok(component.contains(<IconFileZip height={32} width={32} />));
    });

    it('should render 64 icon when dimension is defined', () => {
        const component = shallow(<FileIcon dimension={64} />);

        assert.ok(component.contains(<IconFileDefault height={64} width={64} />));
    });
});
