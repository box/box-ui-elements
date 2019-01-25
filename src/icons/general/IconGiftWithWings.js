// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconGiftWithWings = ({ className = '', color = '#0061D5', height = 109, title, width = 130 }: Props) => (
    <AccessibleSVG
        className={`icon-gift-with-wings ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 130 109"
    >
        <g fill="none" fillRule="evenodd">
            <path
                d="M77 1.134V.492a.501.501 0 0 1 1-.002v.644c.152.088.278.214.366.366h.644a.5.5 0 0 1 .49.5c0 .276-.215.5-.49.5h-.644a1.005 1.005 0 0 1-.366.366v.644a.5.5 0 0 1-.5.49.506.506 0 0 1-.5-.505v-.629a1.005 1.005 0 0 1-.366-.366h-.644a.5.5 0 0 1-.49-.5c0-.276.215-.5.49-.5h.644c.088-.152.214-.278.366-.366zm-75.5 83.5v-.642a.501.501 0 0 1 1-.002v.644c.152.088.278.214.366.366h.644a.5.5 0 0 1 .49.5c0 .276-.215.5-.49.5h-.644a1.005 1.005 0 0 1-.366.366v.644a.5.5 0 0 1-.5.49.506.506 0 0 1-.5-.505v-.629A1.005 1.005 0 0 1 1.134 86H.49a.5.5 0 0 1-.49-.5c0-.276.215-.5.49-.5h.644c.088-.152.214-.278.366-.366zm126 15v-.642a.501.501 0 0 1 1-.002v.644c.152.088.278.214.366.366h.644a.5.5 0 0 1 .49.5c0 .276-.215.5-.49.5h-.644a1.005 1.005 0 0 1-.366.366v.644a.5.5 0 0 1-.5.49.506.506 0 0 1-.5-.505v-.629a1.005 1.005 0 0 1-.366-.366h-.644a.5.5 0 0 1-.49-.5c0-.276.215-.5.49-.5h.644c.088-.152.214-.278.366-.366zm-19-56.5v-.642a.501.501 0 0 1 1-.002v.644c.152.088.278.214.366.366h.644a.5.5 0 0 1 .49.5c0 .276-.215.5-.49.5h-.644a1.005 1.005 0 0 1-.366.366v.644a.5.5 0 0 1-.5.49.506.506 0 0 1-.5-.505v-.629a1.005 1.005 0 0 1-.366-.366h-.644a.5.5 0 0 1-.49-.5c0-.276.215-.5.49-.5h.644c.088-.152.214-.278.366-.366zm-85-27.5v-.642a.501.501 0 0 1 1-.002v.644c.152.088.278.214.366.366h.644a.5.5 0 0 1 .49.5c0 .276-.215.5-.49.5h-.644a1.005 1.005 0 0 1-.366.366v.644a.5.5 0 0 1-.5.49.506.506 0 0 1-.5-.505v-.629a1.005 1.005 0 0 1-.366-.366h-.644a.5.5 0 0 1-.49-.5c0-.276.215-.5.49-.5h.644c.088-.152.214-.278.366-.366zm99 18v-.642a.501.501 0 0 1 1-.002v.644c.152.088.278.214.366.366h.644a.5.5 0 0 1 .49.5c0 .276-.215.5-.49.5h-.644a1.005 1.005 0 0 1-.366.366v.644a.5.5 0 0 1-.5.49.506.506 0 0 1-.5-.505v-.629a1.005 1.005 0 0 1-.366-.366h-.644a.5.5 0 0 1-.49-.5c0-.276.215-.5.49-.5h.644c.088-.152.214-.278.366-.366zM17.937 23.709v-.402a.313.313 0 0 1 .625 0v.402a.628.628 0 0 1 .23.229h.401c.17 0 .307.144.307.312a.308.308 0 0 1-.307.313h-.402a.628.628 0 0 1-.229.228v.402a.313.313 0 0 1-.625.004v-.406a.628.628 0 0 1-.228-.229h-.402A.313.313 0 0 1 17 24.25c0-.173.134-.313.307-.313h.402a.628.628 0 0 1 .229-.228zm-11.5 75v-.402a.313.313 0 0 1 .625 0v.402a.628.628 0 0 1 .23.228h.401c.17 0 .307.145.307.313a.308.308 0 0 1-.307.313h-.402a.628.628 0 0 1-.229.228v.402a.313.313 0 0 1-.625.004v-.406a.628.628 0 0 1-.228-.228h-.402a.313.313 0 0 1-.307-.313c0-.173.134-.313.307-.313h.402a.628.628 0 0 1 .229-.228zm107 8.5v-.402a.313.313 0 0 1 .626 0v.402a.628.628 0 0 1 .228.228h.402c.17 0 .307.145.307.313a.308.308 0 0 1-.307.313h-.402a.628.628 0 0 1-.228.228v.402a.313.313 0 0 1-.626.004v-.406a.628.628 0 0 1-.228-.228h-.402a.313.313 0 0 1-.307-.313c0-.173.134-.313.307-.313h.402a.628.628 0 0 1 .228-.228z"
                fill={color}
                className="fill-color"
            />
            <path
                d="M97.749 73.802c5.351-.234 9.246.634 9.555 2.384.423 2.398-6.058 5.546-14.475 7.03-8.417 1.485-15.583.743-16.006-1.656-.273-1.544 2.316-3.399 6.44-4.92-1.347-.178-2.237-.62-2.499-1.34-.548-1.506 1.791-3.851 5.744-6.112-2.1.355-3.592.144-4.096-.729-1.218-2.11 3.795-7.284 11.197-11.557 7.401-4.274 14.39-6.028 15.607-3.919 1.214 2.104-3.765 7.254-11.13 11.52 6.16-1.658 11.082-1.66 11.763.21.8 2.2-4.555 6.187-12.1 9.089zM43.217 76.64c4.125 1.521 6.713 3.376 6.44 4.92-.422 2.4-7.588 3.14-16.006 1.656-8.417-1.484-14.897-4.632-14.474-7.03.308-1.75 4.203-2.618 9.554-2.384-7.544-2.902-12.9-6.889-12.1-9.088.681-1.87 5.604-1.87 11.764-.211-7.366-4.266-12.345-9.416-11.13-11.52 1.217-2.11 8.205-.355 15.607 3.919 7.402 4.273 12.415 9.447 11.197 11.557-.504.873-1.996 1.084-4.096.73 3.952 2.26 6.291 4.605 5.743 6.11-.262.72-1.152 1.163-2.499 1.34zM83.94 43.62c.582 0 1.897.675 2.956 1.51l5.373 4.022c1.171.834 1.457 1.51.626 1.51H33.587c-.833 0-.547-.675.626-1.51l5.373-4.021c1.058-.835 2.375-1.511 2.956-1.511H83.94z"
                stroke={color}
                className="stroke-color"
                strokeWidth="2"
                fill="#FFF"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M83.25 45.632c.563 0 1.833.675 2.858 1.51l5.193 4.022c1.133.834 1.408 1.51.605 1.51h-57.33c-.806 0-.53-.674.605-1.51l5.193-4.021c1.023-.835 2.297-1.511 2.858-1.511H83.25z"
                fillOpacity=".1"
                fill={color}
            />
            <rect
                stroke={color}
                className="stroke-color"
                strokeWidth="2"
                fill="#FFF"
                x="33.109"
                y="49.656"
                width="60.262"
                height="50.307"
                rx="1.5"
            />
            <rect
                fillOpacity=".1"
                fill={color}
                className="fill-color"
                x="51.188"
                y="50.663"
                width="24.105"
                height="48.294"
                rx="1"
            />
            <rect
                stroke={color}
                className="stroke-color"
                strokeWidth="2"
                fill="#FFF"
                x="53.699"
                y="48.65"
                width="19.083"
                height="52.319"
                rx="1.5"
            />
            <path
                d="M53.39 83.853s2.376-2.65 5.076-4.915c2.699-2.264 5.721-4.144 5.721-4.144.528-.443 1.315-.169 1.759.612l7.492 13.18c.444.78.548 1.627.231 1.893l-6.478 5.436c-.316.265-1.133.017-1.825-.556L53.688 85.69c-.692-.572-.826-1.394-.297-1.838zm44.115 0c.528.444.394 1.266-.298 1.838L85.53 95.36c-.692.573-1.51.821-1.826.556l-6.477-5.436c-.318-.266-.214-1.113.23-1.894l7.493-13.179c.444-.78 1.231-1.055 1.758-.612 0 0 3.023 1.88 5.722 4.144 2.7 2.265 5.075 4.915 5.075 4.915z"
                stroke={color}
                className="stroke-color"
                strokeWidth="2"
                fill="#FFF"
            />
            <rect
                stroke={color}
                className="stroke-color"
                strokeWidth="2"
                fill="#FFF"
                x="42.148"
                y="90.908"
                width="65.284"
                height="15.092"
                rx="1.5"
            />
            <path
                d="M61.335 85.044a.995.995 0 0 1 .126-1.406 1.004 1.004 0 0 1 1.406.12l5.148 6.136a.995.995 0 0 1-.126 1.405 1.004 1.004 0 0 1-1.406-.12l-5.148-6.135zm28.68 0l-5.148 6.135a1.004 1.004 0 0 1-1.406.12.995.995 0 0 1-.126-1.405l5.148-6.136a1.004 1.004 0 0 1 1.406-.12c.426.358.48.985.126 1.406zm-27.277 7.875a.998.998 0 0 1 1.005-1.005h22.095c.555 0 1.005.45 1.005 1.005v11.07a.998.998 0 0 1-1.005 1.005H63.743c-.555 0-1.005-.45-1.005-1.005V92.92z"
                fillOpacity=".1"
                fill={color}
                className="fill-color"
            />
            <path
                d="M62.238 30.527a1.002 1.002 0 0 1 2.002 0v4.026a1.002 1.002 0 0 1-2.002 0v-4.026zm9.787 2.332a1.002 1.002 0 0 1 1.534 1.287l-2.588 3.085a1.002 1.002 0 0 1-1.534-1.287l2.588-3.085zm-17.573 0l2.589 3.085a1.002 1.002 0 0 1-1.534 1.287l-2.588-3.085a1.002 1.002 0 0 1 1.533-1.287zm7.385 50.785a.995.995 0 0 1 .126-1.406 1.004 1.004 0 0 1 1.406.12l5.148 6.136a.995.995 0 0 1-.126 1.405 1.004 1.004 0 0 1-1.406-.12l-5.148-6.135zm27.68 0l-5.148 6.135a1.004 1.004 0 0 1-1.406.12.995.995 0 0 1-.126-1.405l5.148-6.136a1.004 1.004 0 0 1 1.406-.12c.426.358.48.985.126 1.406z"
                fill={color}
                className="fill-color"
            />
            <rect
                stroke={color}
                className="stroke-color"
                strokeWidth="2"
                fill="#FFF"
                x="65.249"
                y="88.896"
                width="19.083"
                height="17.104"
                rx="1.5"
            />
        </g>
    </AccessibleSVG>
);

export default IconGiftWithWings;
