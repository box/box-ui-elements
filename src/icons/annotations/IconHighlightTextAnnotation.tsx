import * as React from 'react';
import classNames from 'classnames';
import AccessibleSVG from '../accessible-svg';
import { Icon } from '../iconTypes';
import { white } from '../../styles/variables';

const IconHighlightTextAnnotation = ({
    className,
    color = white,
    height = 16,
    title,
    width = 16,
}: Icon): React.ReactElement => (
    <AccessibleSVG
        className={classNames('bdl-IconHighlightText', className)}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <path
            d="M5.75 1a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25H4v12h1.75a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-4.5a.25.25 0 0 1-.25-.25v-.5a.25.25 0 0 1 .25-.25H3V2H1.25A.25.25 0 0 1 1 1.75v-.5A.25.25 0 0 1 1.25 1h4.5zM13 4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5.75a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1H13zm-2.78 1.5a2.83 2.83 0 0 0-1.991.763l.206.372a.53.53 0 0 0 .136.148.33.33 0 0 0 .206.064.5.5 0 0 0 .255-.066l.255-.148c.093-.055.202-.104.325-.148s.278-.066.465-.066c.26 0 .456.078.593.233s.206.395.206.72v.283c-.548.013-1.006.066-1.374.16s-.662.213-.883.356-.38.303-.474.48S8 9.008 8 9.2c0 .217.034.407.103.57a1.11 1.11 0 0 0 .29.41 1.23 1.23 0 0 0 .444.247c.17.055.358.082.56.082.17 0 .328-.014.47-.042a1.83 1.83 0 0 0 .4-.127c.125-.057.245-.126.36-.2a4.18 4.18 0 0 0 .355-.29l.103.344c.034.1.08.167.14.2s.143.05.252.05H12V7.37a2.29 2.29 0 0 0-.119-.754c-.08-.23-.195-.426-.348-.59a1.59 1.59 0 0 0-.561-.386 1.93 1.93 0 0 0-.752-.139zm.654 2.86v.815c-.165.176-.334.307-.507.393a1.36 1.36 0 0 1-.614.13c-.193 0-.35-.044-.47-.132s-.18-.234-.18-.438c0-.104.03-.2.09-.287a.72.72 0 0 1 .294-.231c.137-.066.32-.12.544-.163a6.27 6.27 0 0 1 .843-.087z"
            fill={color}
            fillRule="evenodd"
        />
    </AccessibleSVG>
);

export default IconHighlightTextAnnotation;
