/**
 * @flow
 * @file Footer component
 * @author Box
 */

import * as React from 'react';
import './Footer.scss';

type Props = {
    children: React.Node,
};

const Footer = ({ children }: Props) => <footer className="bce-footer">{children}</footer>;

export default Footer;
