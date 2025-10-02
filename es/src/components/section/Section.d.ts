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
declare const Section: ({ children, id, className, description, title, ...rest }: SectionProps) => React.JSX.Element;
export default Section;
