// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it is not purely decorative for accessibility */
    title?: string,
    width?: number,
};

const IconTaskGeneral = ({ className = '', color = '#26C281', height = 30, title, width = 30 }: Props) => (
    <AccessibleSVG className={className} height={height} title={title} viewBox="0 0 20 20" width={width}>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(0.909091, 0.909091)" fillRule="nonzero">
                <circle
                    stroke="#FFFFFF"
                    strokeWidth="0.909090909"
                    fill={color}
                    cx="9.09090909"
                    cy="9.09090909"
                    r="9.45454545"
                />
                <g transform="translate(5.000000, 4.375000)" fill="#FFFFFF">
                    <path d="M1.59090909,0.215909091 L1.59090909,0.715909091 C1.59090909,1.54433622 2.15055315,2.21590909 2.84090909,2.21590909 L5.34090909,2.21590909 C6.03126503,2.21590909 6.59090909,1.54433622 6.59090909,0.715909091 L6.59090909,0.215909091 L7.31168831,0.215909091 C7.74204006,0.215909091 8.09090909,0.564778117 8.09090909,0.99512987 L8.09090909,8.43668831 C8.09090909,8.86704006 7.74204006,9.21590909 7.31168831,9.21590909 L0.87012987,9.21590909 C0.439778117,9.21590909 0.0909090909,8.86704006 0.0909090909,8.43668831 L0.0909090909,0.99512987 C0.0909090909,0.564778117 0.439778117,0.215909091 0.87012987,0.215909091 L1.59090909,0.215909091 Z M5.22614049,3.87393853 L3.68416384,5.51871362 L2.92309101,4.84220443 C2.71669963,4.65874542 2.40066344,4.67733579 2.21720443,4.88372717 C2.03374542,5.09011856 2.05233579,5.40615474 2.25872717,5.58961375 L3.38372717,6.58961375 C3.58626036,6.76964325 3.89534314,6.75556985 4.08067769,6.55787966 L5.95567769,4.55787966 C6.14454282,4.35642352 6.13433579,4.04000562 5.93287966,3.85114049 C5.73142352,3.66227536 5.41500562,3.67248239 5.22614049,3.87393853 Z M2.42424242,0.215909091 L5.75757576,0.215909091 L5.75757576,0.715909091 C5.75757576,0.992051466 5.57102774,1.21590909 5.34090909,1.21590909 L2.84090909,1.21590909 C2.61079045,1.21590909 2.42424242,0.992051466 2.42424242,0.715909091 L2.42424242,0.215909091 Z" />
                </g>
            </g>
        </g>
    </AccessibleSVG>
);

export default IconTaskGeneral;
