import * as React from 'react';

import './Section.scss';

export interface SectionProps {
    /** Contents of the section */
    children: React.ReactNode;
    /** Custom class for the section */
    className?: string;
    /** Description of the section */
    description?: React.ReactNode;
    /** Custom id for the section */
    id?: string;
    /** Title of the section */
    title: React.ReactNode;
}

const Section = ({ children, id = '', className = '', description = '', title = '', ...rest }: SectionProps) => {
    return (
        <section className={`section ${className}`} id={id} {...rest}>
            <div>
                <h5 className="section-title">{title}</h5>
                <div className="section-description">{description}</div>
            </div>
            <div className="section-content">{children}</div>
        </section>
    );
};

export default Section;
