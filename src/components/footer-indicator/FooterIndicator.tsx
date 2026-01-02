import * as React from 'react';
import { Focusable, Tooltip, TooltipProvider } from '@box/blueprint-web';
import IconPuzzlePiece from '../../icons/general/IconPuzzlePiece';

import './FooterIndicator.scss';

type Props = {
    indicatorText: string;
};

const FooterIndicator = ({ indicatorText }: Props) => {
    return (
        <div className="bdl-FooterIndicator">
            <TooltipProvider>
                <Tooltip side="top" align="end" content={indicatorText}>
                    <Focusable>
                        <div className="bdl-FooterIndicator-content">
                            <span className="bdl-FooterIndicator-iconWrapper">
                                <IconPuzzlePiece height={14} width={14} />
                            </span>
                            <span className="bdl-FooterIndicator-text">{indicatorText}</span>
                        </div>
                    </Focusable>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default FooterIndicator;
