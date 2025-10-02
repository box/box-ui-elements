import * as React from 'react';
import './LabelPill.scss';
export declare enum LabelPillStatus {
    DEFAULT = "default",
    INFO = "info",
    FTUX = "ftux",
    HIGHLIGHT = "highlight",
    SUCCESS = "success",
    WARNING = "warning",
    ALERT = "alert",
    ERROR = "error"
}
export declare enum LabelPillSize {
    REGULAR = "regular",
    LARGE = "large"
}
export interface LabelPillProps {
    /** Content, wrapped in either LabelPill.Text or LabelPill.Icon */
    children: Array<React.ReactChild> | React.ReactChild;
    /** Type of pill */
    type?: LabelPillStatus;
    /** Size of pill */
    size?: LabelPillSize;
    /** Additional CSS classname(s) */
    className?: string;
}
declare const LabelPill: {
    Pill: React.ForwardRefExoticComponent<LabelPillProps & React.RefAttributes<HTMLSpanElement>>;
    Text: ({ children, className, ...rest }: import("./LabelPillText").LabelPillTextProps) => React.JSX.Element;
    Icon: ({ Component, className, ...rest }: import("./LabelPillIcon").LabelPillIconProps) => React.JSX.Element;
};
export default LabelPill;
