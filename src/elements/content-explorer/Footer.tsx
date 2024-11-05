import * as React from 'react';
import './Footer.scss';

export interface FooterProps {
    children: React.ReactNode;
}

const Footer = ({ children }: FooterProps) => <footer className="bce-Footer">{children}</footer>;

export default Footer;
