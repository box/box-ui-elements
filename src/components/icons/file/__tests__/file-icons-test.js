import React from 'react';
import { shallow } from 'enzyme';

import {
    IconFileAudio,
    IconFileBookmark,
    IconFileBoxNote,
    IconFileCode,
    IconFileDefault,
    IconFileDocument,
    IconFileIllustrator,
    IconFileImage,
    IconFileIndesign,
    IconFilePDF,
    IconFilePhotoshop,
    IconFilePresentation,
    IconFileSpreadsheet,
    IconFileText,
    IconFileThreeD,
    IconFileVector,
    IconFileVideo,
    IconFileZip
} from '../';

const sandbox = sinon.sandbox.create();
const icons = {
    audio: IconFileAudio,
    bookmark: IconFileBookmark,
    boxnote: IconFileBoxNote,
    code: IconFileCode,
    default: IconFileDefault,
    document: IconFileDocument,
    illustrator: IconFileIllustrator,
    image: IconFileImage,
    indesign: IconFileIndesign,
    pdf: IconFilePDF,
    photoshop: IconFilePhotoshop,
    presentation: IconFilePresentation,
    spreadsheet: IconFileSpreadsheet,
    text: IconFileText,
    threed: IconFileThreeD,
    vector: IconFileVector,
    video: IconFileVideo,
    zip: IconFileZip
};

describe('icons/file/*', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    Object.keys(icons).forEach((key) => {
        const IconComponent = icons[key];
        it('should correctly render icon', () => {
            const component = shallow(<IconComponent className='test' width={42} height={42} />);

            assert.equal(component.find('svg').length, 1);
            assert.equal(component.find('.test').length, 1);
            assert.equal(component.find('svg').prop('height'), 42);
            assert.equal(component.find('svg').prop('width'), 42);
        });
    });
});
