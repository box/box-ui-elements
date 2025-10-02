/// <reference types="react" />
import { SVGProps } from '../accessible-svg/AccessibleSVG';
type Config = {
    color: string;
    icon: Icon;
};
type Icon = (props: SVGProps) => JSX.Element;
export declare const getColor: (extension?: string) => Config['color'];
export declare const getIcon: (extension?: string) => Config['icon'];
export {};
