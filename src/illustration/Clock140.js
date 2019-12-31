// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import * as vars from '../styles/variables';
import AccessibleSVG from '../icons/accessible-svg';
import type { Icon } from '../icons/flowTypes';

const Clock140 = (props: Icon) => (
    <AccessibleSVG width={140} height={140} viewBox="0 0 140 140" {...props}>
        <g fill="none" fillRule="evenodd" transform="translate(0 4)">
            <rect
                width={38}
                height={24}
                x={79}
                y={32}
                fill={vars.white}
                stroke={vars.bdlBoxBlue}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                rx={2}
            />
            <circle cx={70} cy={64} r={26} fill={vars.white} stroke={vars.bdlBoxBlue} strokeWidth={1.857} />
            <path
                fill={vars.bdlBoxBlue}
                fillOpacity={0.07}
                d="M70.496 126c16.34.027 29.504 1.36 29.504 3 0 1.657-13.431 3-30 3-16.569 0-30-1.343-30-3s13.431-3 30-3zM46 64c9.717 12.638 13.035 9.83 17.958 7.337 4.922-2.493 7.12 3.67 13.35 6.69 8.336 4.043 16.223-9.668 15.664-7.633C90.182 80.545 80.916 88 69.915 88 56.707 88 46 77.255 46 64z"
            />
            <path
                fill={vars.white}
                stroke={vars.bdlBoxBlue}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M97.997 76c1.106 0 2.003.898 2.003 1.992v26.016A2 2 0 0197.997 106H64.003A2.001 2.001 0 0162 104.008V77.992A2 2 0 0164.003 76h33.994zm-39-32c1.106 0 2.003.897 2.003 2.005v19.99A2.007 2.007 0 0158.997 68H25.003A2.004 2.004 0 0123 65.995v-19.99c0-1.107.902-2.005 2.003-2.005h33.994z"
            />
            <path
                fill={vars.bdlBoxBlue}
                d="M82.208 96c.509 0 .928.383.985.883L83.2 97c0 .552-.44 1-.992 1H70.992A.994.994 0 0170 97c0-.552.44-1 .992-1h11.216zm6.154 0c.512 0 .934.383.991.883l.007.117c0 .552-.438 1-.998 1h-2.404a.997.997 0 01-.998-1c0-.552.438-1 .998-1h2.404zm2.636-6c.514 0 .937.383.995.883L92 91c0 .552-.44 1-1.002 1H71.002A.999.999 0 0170 91c0-.552.44-1 1.002-1h19.996zm46.988-5.906l.088.008c.23.042.415.244.415.487v.647c.153.088.28.216.37.369h.647c.277 0 .494.225.494.503l-.008.088a.503.503 0 01-.486.416h-.648c-.088.153-.216.28-.369.369v.633a.51.51 0 01-.503.508l-.089-.008a.503.503 0 01-.415-.486v-.647a1.012 1.012 0 01-.369-.37h-.647a.496.496 0 01-.494-.503l.008-.088a.503.503 0 01.486-.415h.647c.089-.153.216-.28.37-.37v-.647c0-.278.225-.494.503-.494zM90.998 84c.514 0 .937.383.995.883L92 85c0 .552-.44 1-1.002 1H71.002A.999.999 0 0170 85c0-.552.44-1 1.002-1h19.996zM2.014 79.058l.089.008c.23.042.415.244.415.488v.646c.152.088.28.216.368.368l.648.001c.278 0 .494.225.494.504l-.008.088a.503.503 0 01-.486.415l-.648.001c-.088.153-.216.28-.368.368v.633a.51.51 0 01-.504.509l-.088-.008a.503.503 0 01-.415-.486v-.648a1.012 1.012 0 01-.369-.368H.494A.496.496 0 010 81.072l.008-.089a.503.503 0 01.486-.415h.648a1.02 1.02 0 01.369-.369v-.648c0-.277.225-.494.503-.494zm124.138-5.539l.07.008a.315.315 0 01.245.302v.404a.633.633 0 01.23.23h.405a.31.31 0 01.31.315l-.01.07a.314.314 0 01-.3.245h-.405a.633.633 0 01-.23.23v.396a.318.318 0 01-.315.318l-.07-.008a.314.314 0 01-.245-.3v-.406a.633.633 0 01-.23-.23h-.405a.31.31 0 01-.309-.315l.008-.07a.314.314 0 01.301-.245h.405a.633.633 0 01.23-.23v-.405a.31.31 0 01.315-.309zM70 62a2 2 0 110 4 2 2 0 010-4zm22.007 1c.51 0 .929.383.986.883L93 64c0 .552-.445 1-.993 1H75.993A.994.994 0 0175 64c0-.552.445-1 .993-1h16.014zm-48.8-5c.51 0 .929.383.986.883L44.2 59c0 .552-.44 1-.992 1H31.992A.994.994 0 0131 59c0-.552.44-1 .992-1h11.216zm6.155 0c.512 0 .934.383.991.883l.007.117c0 .552-.438 1-.998 1h-2.404a.997.997 0 01-.998-1c0-.552.438-1 .998-1h2.404zM70 45c.552 0 1 .45 1 1.007v11.986c0 .517-.383.942-.883 1L70 59c-.552 0-1-.45-1-1.007V46.007c0-.517.383-.942.883-1L70 45zm-18.002 7c.514 0 .937.383.995.883L53 53c0 .552-.44 1-1.002 1H32.002A.999.999 0 0131 53c0-.552.44-1 1.002-1h19.996zM99.2 46c.513 0 .935.383.993.883l.007.117c0 .552-.438 1-1 1h-8.84c-.552 0-1-.444-1-1 0-.552.438-1 1-1h8.84zm6.162 0c.512 0 .934.383.991.883l.007.117c0 .552-.438 1-.998 1h-2.404a.997.997 0 01-.998-1c0-.552.438-1 .998-1h2.404zm23.244-3.73l.07.008a.315.315 0 01.245.302v.404a.633.633 0 01.23.23h.405a.31.31 0 01.309.315l-.008.07a.314.314 0 01-.3.245h-.406a.633.633 0 01-.23.23v.396a.318.318 0 01-.315.318l-.07-.008a.314.314 0 01-.245-.3v-.406a.633.633 0 01-.23-.23h-.405a.31.31 0 01-.309-.315l.008-.07a.314.314 0 01.3-.245h.406a.633.633 0 01.23-.23v-.405a.31.31 0 01.315-.309zM9.579 39.852l.088.008c.23.042.416.244.416.487v.647c.152.088.28.216.368.369h.648c.278 0 .494.225.494.503l-.008.089a.503.503 0 01-.486.415h-.648c-.088.153-.216.28-.369.369v.633a.51.51 0 01-.503.509l-.088-.008a.503.503 0 01-.416-.486v-.648a1.012 1.012 0 01-.369-.37H8.06a.496.496 0 01-.494-.503l.008-.088a.503.503 0 01.486-.415h.648c.088-.153.216-.28.369-.37v-.647c0-.277.225-.494.503-.494zm98.419.148c.514 0 .937.383.995.883L109 41c0 .552-.44 1-1.002 1H88.002A.999.999 0 0187 41c0-.552.44-1 1.002-1h19.996zM18.39 32.802l.07.008a.315.315 0 01.245.302v.404a.633.633 0 01.23.23h.405a.31.31 0 01.31.315l-.01.07a.314.314 0 01-.3.245h-.405a.633.633 0 01-.23.23v.396a.318.318 0 01-.315.318l-.07-.008a.314.314 0 01-.245-.3v-.406a.633.633 0 01-.23-.23h-.405a.31.31 0 01-.309-.315l.008-.07a.314.314 0 01.301-.245h.405a.633.633 0 01.23-.23v-.405a.31.31 0 01.315-.309zm102.39-14.128l.088.008c.23.042.415.244.415.488v.647c.153.088.28.215.368.367h.649c.277 0 .494.226.494.504l-.008.089a.503.503 0 01-.486.415h-.649c-.088.153-.215.28-.367.368v.634a.51.51 0 01-.504.509l-.089-.008a.503.503 0 01-.415-.486v-.649a1.012 1.012 0 01-.368-.367l-.649-.001a.496.496 0 01-.494-.504l.008-.088a.503.503 0 01.486-.415h.649c.088-.153.215-.28.367-.368l.001-.649c0-.277.225-.494.504-.494zM49.317 4.135l.089.008c.23.042.415.244.415.487v.647c.152.088.28.215.368.368h.648c.278 0 .494.226.494.504l-.008.089a.503.503 0 01-.486.415h-.647c-.089.153-.216.28-.37.369v.633a.51.51 0 01-.503.509l-.088-.008a.503.503 0 01-.415-.486v-.648a1.012 1.012 0 01-.37-.37h-.647a.496.496 0 01-.494-.503l.008-.088a.503.503 0 01.486-.415l.648-.001a1.01 1.01 0 01.369-.368v-.648c0-.277.225-.494.503-.494zM75.041 0l.089.008c.23.042.415.244.415.487v.647c.153.088.28.216.369.369h.648c.277 0 .493.225.493.503l-.007.089a.503.503 0 01-.486.415h-.648c-.089.153-.216.28-.37.369v.633a.51.51 0 01-.503.508l-.088-.008a.503.503 0 01-.415-.486v-.647a1.012 1.012 0 01-.37-.37h-.647a.496.496 0 01-.494-.503l.008-.088a.503.503 0 01.486-.415h.648c.088-.153.216-.28.369-.37V.495c0-.277.225-.494.503-.494z"
            />
        </g>
    </AccessibleSVG>
);

export default Clock140;
