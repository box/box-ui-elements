/**
 * @flow
 * @file Clickable breadcrumb component
 * @author Box
 */

import React from 'react';
import IconChevron from 'box-react-ui/lib/icons/general/IconChevron';
import { DELIMITER_CARET, COLOR_999 } from '../../constants';

type Props = {
    delimiter?: Delimiter,
};

const BreadcrumbDelimiter = ({ delimiter }: Props) =>
    delimiter === DELIMITER_CARET ? (
        <IconChevron
            className="be-breadcrumb-seperator"
            color={COLOR_999}
            direction="right"
            size="7px"
        />
    ) : (
        <span>/</span>
    );

export default BreadcrumbDelimiter;
