/**
 * @flow
 * @file Clickable breadcrumb component
 * @author Box
 */

import React from 'react';
import { DELIMITER_CARET } from '../../constants';
import IconRightArrow from '../icons/IconRightArrow';
import type { Delimiter } from '../../flowTypes';

type Props = {
    delimiter?: Delimiter
};

const BreadcrumbDelimiter = ({ delimiter }: Props) =>
    delimiter === DELIMITER_CARET
        ? <span className='buik-breadcrumb-seperator'><IconRightArrow /></span>
        : <span>/</span>;

export default BreadcrumbDelimiter;
