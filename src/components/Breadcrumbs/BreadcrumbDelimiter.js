/**
 * @flow
 * @file Clickable breadcrumb component
 * @author Box
 */

import React from 'react';
import IconChevron from 'box-react-ui/lib/icons/general/IconChevron';
import { DELIMITER_CARET, COLOR_DOWNTOWN_GREY } from '../../constants';
import type { Delimiter } from '../../flowTypes';

type Props = {
    delimiter?: Delimiter
};

const BreadcrumbDelimiter = ({ delimiter }: Props) =>
    delimiter === DELIMITER_CARET ? (
        <IconChevron className='be-breadcrumb-seperator' color={COLOR_DOWNTOWN_GREY} direction='right' size='7px' />
    ) : (
        <span>/</span>
    );

export default BreadcrumbDelimiter;
