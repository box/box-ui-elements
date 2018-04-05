/**
 * @flow
 * @file Clickable breadcrumb component
 * @author Box
 */

import React from 'react';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import BreadcrumbDelimiter from './BreadcrumbDelimiter';
import type { Delimiter } from '../../flowTypes';
import './Breadcrumb.scss';

type Props = {
    name: string,
    onClick?: Function,
    isLast?: boolean,
    delimiter?: Delimiter
};

const Breadcrumb = ({ name = '', onClick, isLast, delimiter }: Props) => {
    const title = onClick ? (
        <PlainButton type='button' onClick={onClick}>
            {name}
        </PlainButton>
    ) : (
        <span>{name}</span>
    );
    return (
        <span className='be-breadcrumb'>
            {title}
            {isLast ? null : <BreadcrumbDelimiter delimiter={delimiter} />}
        </span>
    );
};

export default Breadcrumb;
