// @flow
import * as React from 'react';

import Tooltip from '../tooltip';

import IconPuzzlePiece from '../../icons/general/IconPuzzlePiece';

import './FooterIndicator.scss';

type Props = {
    indicatorText: string,
};

const FooterIndicator = ({ indicatorText }: Props) => {
    return (
        <div className="bdl-FooterIndicator">
            <Tooltip position="top-right" text={indicatorText}>
                <div className="bdl-FooterIndicator-content">
                    <span className="bdl-FooterIndicator-iconWrapper">
                        <IconPuzzlePiece height={14} width={14} />
                    </span>
                    <span className="bdl-FooterIndicator-text">{indicatorText}</span>
                </div>
            </Tooltip>
        </div>
    );
};

export default FooterIndicator;
