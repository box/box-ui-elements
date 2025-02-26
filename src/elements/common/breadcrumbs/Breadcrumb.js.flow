/**
 * @flow
 * @file Clickable breadcrumb component
 * @author Box
 */

import * as React from 'react';
import { TextButton } from '@box/blueprint-web';
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
        <TextButton className="bdl-Breadcrumb-title" inheritFont onClick={onClick}>
            {name}
        </TextButton>
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
