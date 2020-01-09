/**
 * @flow
 * @file Clickable breadcrumb component
 * @author Box
 */

import React from 'react';
import PlainButton from '../../../components/plain-button/PlainButton';
import BreadcrumbDelimiter from './BreadcrumbDelimiter';
import type { Delimiter } from '../../../common/types/core';
import './Breadcrumb.scss';

type Props = {
    delimiter?: Delimiter,
    isLast?: boolean,
    name: string,
    onClick?: Function,
};

const Breadcrumb = ({ name = '', onClick, isLast, delimiter }: Props) => {
    const title = onClick ? (
        <PlainButton onClick={onClick} type="button" className="bdl-Breadcrumb-title">
            {name}
        </PlainButton>
    ) : (
        <div className="bdl-Breadcrumb-title">{name}</div>
    );
    return (
        <span className="be-breadcrumb">
            {title}
            {isLast ? null : <BreadcrumbDelimiter delimiter={delimiter} />}
        </span>
    );
};

export default Breadcrumb;
