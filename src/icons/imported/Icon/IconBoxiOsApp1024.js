// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../accessible-svg';

type SvgProps = {
    height?: number,
    title?: string | React.Element<any>,
    width?: number,
};

const IconBoxiOsApp1024 = (props: SvgProps) => (
    <AccessibleSVG width={32} height={32} viewBox="0 0 1024 1024" {...props}>
        <g fillRule="nonzero" fill="none">
            <path fill="#0061D5" d="M0 0h1024v1024H0z" />
            <path
                d="M189.866 310.459c14.153 0 25.654 11.29 25.91 25.392v109.142c21.714-16.275 48.625-25.91 77.753-25.91 49.608 0 92.726 27.884 114.458 68.824 21.726-40.94 64.865-68.824 114.438-68.824 71.523 0 129.543 57.984 129.543 129.526 0 71.575-58.02 129.573-129.543 129.573-49.573 0-92.712-27.91-114.438-68.81-21.732 40.9-64.85 68.81-114.458 68.81-70.855 0-128.36-56.846-129.5-127.414H164V335.851c.324-14.102 11.714-25.392 25.866-25.392zM807.982 430.8c9.534-11.077 26.819-13.266 39.14-4.726 12.305 8.47 14.86 24.41 5.947 35.826l-70.502 86.54 70.416 86.371c8.93 11.448 6.364 27.342-5.943 35.845-12.32 8.506-29.601 6.34-39.144-4.753L747.33 591.67l-60.602 74.234c-9.434 11.094-26.828 13.259-39.11 4.753-12.284-8.503-14.85-24.397-5.893-35.845h-.024l70.374-86.372L641.7 461.9h.024c-8.957-11.416-6.39-27.347 5.892-35.825 12.283-8.54 29.677-6.35 39.11 4.726v-.018l60.603 74.337 60.653-74.337v.018zm-285.557 40.146c-42.93 0-77.737 34.769-77.737 77.662 0 42.93 34.808 77.706 77.737 77.706 42.912 0 77.702-34.776 77.702-77.706 0-42.893-34.79-77.662-77.702-77.662zm-228.896 0c-42.92 0-77.753 34.769-77.753 77.679 0 42.922 34.833 77.69 77.753 77.69 42.916 0 77.676-34.777 77.676-77.707 0-42.893-34.76-77.662-77.676-77.662z"
                fill="#FFFFFE"
            />
        </g>
    </AccessibleSVG>
);

export default IconBoxiOsApp1024;
