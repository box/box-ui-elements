/**
 * @flow
 * @file Clickable breadcrumb component
 * @author Box
 */

import React from 'react';
import BreadcrumbDelimiter from './BreadcrumbDelimiter';
import { PlainButton } from '../Button';
import type { Delimiter } from '../../flowTypes';
import './Breadcrumb.scss';

type Props = {
    name: string,
    onClick?: Function,
    isLast?: boolean,
    delimiter?: Delimiter
};

const Breadcrumb = ({ name = '', onClick, isLast, delimiter }: Props) => {
    const title = onClick
        ? <PlainButton onClick={onClick}>
            {name}
        </PlainButton>
        : <span>
            {name}
        </span>;
    return (
        <span className='buik-breadcrumb'>
            {title}
            {isLast ? null : <BreadcrumbDelimiter delimiter={delimiter} />}
        </span>
    );
};

export default Breadcrumb;
