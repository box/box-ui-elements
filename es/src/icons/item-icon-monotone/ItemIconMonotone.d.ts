import * as React from 'react';
import { SVGProps } from '../../components/accessible-svg/AccessibleSVG';
declare const itemIconTable: {
    audio: (props: SVGProps) => React.JSX.Element;
    bookmark: (props: SVGProps) => React.JSX.Element;
    boxnote: (props: SVGProps) => React.JSX.Element;
    code: (props: SVGProps) => React.JSX.Element;
    default: (props: SVGProps) => React.JSX.Element;
    document: (props: SVGProps) => React.JSX.Element;
    dwg: (props: SVGProps) => React.JSX.Element;
    'excel-spreadsheet': (props: SVGProps) => React.JSX.Element;
    'folder-collab': (props: SVGProps) => React.JSX.Element;
    'folder-external': (props: SVGProps) => React.JSX.Element;
    'folder-plain': (props: SVGProps) => React.JSX.Element;
    'google-docs': (props: SVGProps) => React.JSX.Element;
    'google-sheets': (props: SVGProps) => React.JSX.Element;
    'google-slides': (props: SVGProps) => React.JSX.Element;
    illustrator: (props: SVGProps) => React.JSX.Element;
    image: (props: SVGProps) => React.JSX.Element;
    indesign: (props: SVGProps) => React.JSX.Element;
    keynote: (props: SVGProps) => React.JSX.Element;
    numbers: (props: SVGProps) => React.JSX.Element;
    pages: (props: SVGProps) => React.JSX.Element;
    pdf: (props: SVGProps) => React.JSX.Element;
    photoshop: (props: SVGProps) => React.JSX.Element;
    'powerpoint-presentation': (props: SVGProps) => React.JSX.Element;
    presentation: (props: SVGProps) => React.JSX.Element;
    spreadsheet: (props: SVGProps) => React.JSX.Element;
    text: (props: SVGProps) => React.JSX.Element;
    threed: (props: SVGProps) => React.JSX.Element;
    vector: (props: SVGProps) => React.JSX.Element;
    video: (props: SVGProps) => React.JSX.Element;
    'word-document': (props: SVGProps) => React.JSX.Element;
    zip: (props: SVGProps) => React.JSX.Element;
};
export interface ItemIconMonotoneProps {
    /** Additional class name */
    className?: string;
    /** Dimension of the icon. Defaults to 32x32 */
    dimension?: number;
    /** Type of item icon, defaults to the default icon if icon type is not recognized */
    iconType: keyof typeof itemIconTable | string;
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.ReactNode;
}
declare const ItemIconMonotone: ({ className, dimension, iconType, title }: ItemIconMonotoneProps) => React.JSX.Element;
export default ItemIconMonotone;
