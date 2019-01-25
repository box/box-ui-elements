// @flow
import * as React from 'react';

import './Section.scss';

type Props = {
    id?: string,
    children: React.Node,
    className?: string,
    /** Section title */
    title: React.Node,
    /** Section description */
    description?: React.Node,
};

const Section = ({ children, id, className = '', description, title }: Props) => (
    <section className={`section ${className}`} id={id}>
        <div>
            <h5 className="section-title">{title}</h5>
            <div className="section-description">{description}</div>
        </div>
        <div className="section-content">{children}</div>
    </section>
);

export default Section;
