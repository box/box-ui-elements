/**
 * @flow
 * @file Clickable breadcrumb component
 * @author Box
 */

import * as React from 'react';
import { PointerChevronRight } from '@box/blueprint-web-assets/icons/Fill';
import { Size3 } from '@box/blueprint-web-assets/tokens/tokens';
import type { Delimiter } from '../../../common/types/core';
import { DELIMITER_CARET, COLOR_999 } from '../../../constants';

type Props = {
    delimiter?: Delimiter,
};

const BreadcrumbDelimiter = ({ delimiter }: Props) =>
    delimiter === DELIMITER_CARET ? (
        <PointerChevronRight
            className="be-breadcrumb-seperator"
            color={COLOR_999}
            height={Size3}
            role="presentation"
            width={Size3}
        />
    ) : (
        <span>/</span>
    );

export default BreadcrumbDelimiter;
