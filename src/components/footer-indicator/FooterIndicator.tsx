import * as React from 'react';
import Tooltip, { TooltipPosition } from '../tooltip';
import IconPuzzlePiece from '../../icons/general/IconPuzzlePiece';

import './FooterIndicator.scss';

type Props = {
    indicatorText: string;
};

const FooterIndicator = ({ indicatorText }: Props) => {
    return (
        <div className="bdl-FooterIndicator">
            <Tooltip
                targetWrapperClassName="bdl-FooterIndicator-tooltipTarget"
                position={TooltipPosition.TOP_RIGHT}
                text={indicatorText}
            >
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
