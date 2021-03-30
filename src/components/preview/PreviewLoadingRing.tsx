import React from 'react';
import classNames from 'classnames';
import './PreviewLoadingRing.scss';

export type Props = React.PropsWithChildren<{
    className?: string;
    color?: string;
    theme?: 'light' | 'dark';
}>;

export default function PreviewLoadingRing({ children, className, color, theme }: Props): React.ReactElement {
    return (
        <div className={classNames('bdl-PreviewLoadingRing', `bdl-PreviewLoadingRing--${theme}`, className)}>
            <div className="bdl-PreviewLoadingRing-border" style={{ backgroundColor: color }} />
            <div className="bdl-PreviewLoadingRing-content">{children}</div>
        </div>
    );
}
