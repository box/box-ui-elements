import classNames from 'classnames';
import * as React from 'react';

export interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Content displayed within the slide */
    children?: React.ReactNode;
    /** Custom class name for the slide */
    className?: string;
}

const Slide = ({ children, className, ...rest }: SlideProps) => (
    <div className={classNames('slide-content', className)} {...rest}>
        {children}
    </div>
);

export default Slide;
