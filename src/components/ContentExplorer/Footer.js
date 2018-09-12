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

const Footer = ({ children }: Props) => (
    <div className="bce-footer">{children}</div>
);

export default Footer;
