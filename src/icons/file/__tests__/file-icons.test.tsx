import React from 'react';
import { shallow } from 'enzyme';

import IconFileAudio from '../IconFileAudio';
import IconFileBoxNote from '../IconFileBoxNote';
import IconFileCode from '../IconFileCode';
import IconFileDefault from '../IconFileDefault';
import IconFileDwg from '../IconFileDwg';
import IconFileDocument from '../IconFileDocument';
import IconFileExcelSpreadsheet from '../IconFileExcelSpreadsheet';
import IconFileGoogleDocs from '../IconFileGoogleDocs';
import IconFileGoogleSheets from '../IconFileGoogleSheets';
import IconFileGoogleSlides from '../IconFileGoogleSlides';
import IconFileIllustrator from '../IconFileIllustrator';
import IconFileImage from '../IconFileImage';
import IconFileIndesign from '../IconFileIndesign';
import IconFileKeynote from '../IconFileKeynote';
import IconFileNumbers from '../IconFileNumbers';
import IconFilePages from '../IconFilePages';
import IconFilePDF from '../IconFilePDF';
import IconFilePhotoshop from '../IconFilePhotoshop';
import IconFilePowerpointPresentation from '../IconFilePowerpointPresentation';
import IconFilePresentation from '../IconFilePresentation';
import IconFileSpreadsheet from '../IconFileSpreadsheet';
import IconFileText from '../IconFileText';
import IconFileThreeD from '../IconFileThreeD';
import IconFileVector from '../IconFileVector';
import IconFileVideo from '../IconFileVideo';
import IconFileWordDocument from '../IconFileWordDocument';
import IconFileZip from '../IconFileZip';

describe('icons/file/*', () => {
    const icons = [
        {
            IconComponent: IconFileAudio,
        },
        {
            IconComponent: IconFileBoxNote,
        },
        {
            IconComponent: IconFileCode,
        },
        {
            IconComponent: IconFileDefault,
        },
        {
            IconComponent: IconFileDocument,
        },
        {
            IconComponent: IconFileDwg,
        },
        {
            IconComponent: IconFileExcelSpreadsheet,
        },
        {
            IconComponent: IconFileGoogleDocs,
        },
        {
            IconComponent: IconFileGoogleSheets,
        },
        {
            IconComponent: IconFileGoogleSlides,
        },
        {
            IconComponent: IconFileIllustrator,
        },
        {
            IconComponent: IconFileImage,
        },
        {
            IconComponent: IconFileIndesign,
        },
        {
            IconComponent: IconFileKeynote,
        },
        {
            IconComponent: IconFileNumbers,
        },
        {
            IconComponent: IconFilePages,
        },
        {
            IconComponent: IconFilePDF,
        },
        {
            IconComponent: IconFilePhotoshop,
        },
        {
            IconComponent: IconFilePowerpointPresentation,
        },
        {
            IconComponent: IconFilePresentation,
        },
        {
            IconComponent: IconFileSpreadsheet,
        },
        {
            IconComponent: IconFileText,
        },
        {
            IconComponent: IconFileThreeD,
        },
        {
            IconComponent: IconFileVector,
        },
        {
            IconComponent: IconFileVideo,
        },
        {
            IconComponent: IconFileWordDocument,
        },
        {
            IconComponent: IconFileZip,
        },
    ];

    icons.forEach(({ IconComponent }) => {
        test('should correctly render icon', () => {
            const component = shallow(<IconComponent />);
            expect(component).toMatchSnapshot();
        });
    });

    icons.forEach(({ IconComponent }) => {
        test('should correctly render icon with props', () => {
            const component = shallow(<IconComponent className="test" height={42} title="cool title" width={42} />);
            expect(component).toMatchSnapshot();
        });
    });

    icons.forEach(({ IconComponent }) => {
        describe('title prop can accept a string type or an element type', () => {
            test('should render icon with title prop being a string type', () => {
                const component = shallow(<IconComponent title="hello" />);

                expect(component.find('IconFileBase').prop('title')).toEqual('hello');
            });

            test('should render icon with title prop being element type', () => {
                const TestElement = <div>Even Funnier Title</div>;
                const component = shallow(<IconComponent title={TestElement} />);

                expect(component.find('IconFileBase').prop('title')).toEqual(TestElement);
            });
        });
    });
});
