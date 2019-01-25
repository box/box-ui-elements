// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import { BOX_BLUE } from '../../common/variables';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const UploadFilePaywallState = ({ className = '', color = BOX_BLUE, height = 129, title, width = 133 }: Props) => (
    <AccessibleSVG
        className={`upload-file-paywall-state ${className}`}
        title={title}
        height={height}
        viewBox="0 0 133 129"
        width={width}
    >
        <g fill="none" fillRule="evenodd">
            <path
                d="M121.482 111.945c-.153-.09-.28-.216-.37-.37h-.646c-.273 0-.494-.232-.494-.502 0-.28.216-.504.494-.504h.647c.09-.154.216-.28.37-.37v-.646c0-.274.233-.496.503-.496.278 0 .503.217.503.494v.648c.152.09.28.216.368.37h.648c.273 0 .494.233.494.503 0 .278-.217.503-.494.503h-.648c-.088.153-.216.28-.37.37v.647c0 .273-.232.494-.502.494-.278 0-.504-.233-.504-.51v-.632zM64.455 1.142V.495c0-.273.234-.495.504-.495.277 0 .502.217.502.494v.648c.153.088.28.216.37.37h.647c.272 0 .493.232.493.502 0 .278-.217.504-.494.504h-.65c-.087.153-.215.28-.368.37v.646c0 .273-.233.494-.503.494-.28 0-.505-.232-.505-.508v-.633c-.153-.09-.28-.216-.37-.37h-.647c-.272 0-.493-.233-.493-.503 0-.278.216-.503.493-.503h.648c.09-.152.216-.28.37-.368zM1.51 85.236v-.647c0-.274.234-.496.504-.496.278 0 .504.216.504.494v.648c.153.088.28.216.37.37h.646c.273 0 .494.232.494.502 0 .278-.216.504-.494.504h-.647c-.09.153-.216.28-.37.368v.648c0 .273-.233.494-.503.494-.278 0-.503-.232-.503-.508v-.634c-.152-.088-.28-.215-.368-.368H.494c-.273 0-.494-.234-.494-.504 0-.278.217-.503.494-.503h.648c.088-.153.216-.28.37-.37zm98.67-70.96v-.646c0-.273.233-.495.503-.495.278 0 .503.217.503.494v.647c.153.088.28.216.37.37h.647c.273 0 .494.232.494.502 0 .277-.217.503-.494.503h-.648c-.088.153-.216.28-.37.37v.647c0 .272-.232.494-.502.494-.278 0-.504-.233-.504-.51v-.632c-.154-.09-.28-.216-.37-.37h-.647c-.273 0-.494-.233-.494-.503 0-.28.215-.504.493-.504h.647c.09-.153.216-.28.37-.37zm-79.463 15.54v-.646c0-.274.234-.496.503-.496.28 0 .504.217.504.494v.648c.153.09.28.216.37.37h.647c.274 0 .495.233.495.502 0 .28-.217.504-.494.504h-.647c-.09.153-.216.28-.37.37v.647c0 .272-.233.493-.503.493-.278 0-.503-.233-.503-.51v-.632c-.153-.088-.28-.215-.37-.368H19.7c-.273 0-.494-.234-.494-.504 0-.278.217-.503.494-.503h.648c.09-.153.216-.28.37-.37zm109.2 31.178v-.647c0-.273.234-.495.504-.495.28 0 .505.217.505.494v.648c.153.088.28.216.368.37h.648c.274 0 .495.232.495.502 0 .278-.216.504-.494.504h-.647c-.088.153-.215.28-.368.37v.647c0 .272-.234.494-.504.494-.277 0-.503-.232-.503-.508v-.633c-.152-.09-.28-.217-.368-.37h-.65c-.272 0-.493-.234-.493-.504 0-.278.216-.503.494-.503h.65c.087-.153.215-.28.367-.37zM10.08 42.984v-.404c0-.17.145-.31.314-.31.174 0 .315.136.315.31v.404c.094.055.174.135.23.23h.404c.17 0 .31.146.31.315 0 .173-.136.314-.31.314h-.405c-.056.095-.136.175-.23.23v.405c0 .17-.147.308-.316.308-.174 0-.315-.145-.315-.318v-.396c-.096-.055-.176-.135-.23-.23h-.406c-.17 0-.31-.146-.31-.315 0-.175.137-.316.31-.316h.405c.054-.095.134-.175.23-.23zm3.453 31.25v-.405c0-.172.146-.31.315-.31.174 0 .315.135.315.308v.405c.095.055.175.135.23.23h.405c.17 0 .31.146.31.315 0 .174-.137.315-.31.315h-.405c-.055.095-.135.175-.23.23v.405c0 .17-.146.31-.315.31-.174 0-.315-.146-.315-.32v-.395c-.095-.055-.175-.135-.23-.23h-.405c-.17 0-.31-.146-.31-.315 0-.174.136-.315.31-.315h.405c.055-.095.135-.175.23-.23zm107.76-30.718v-.404c0-.17.147-.31.316-.31.173 0 .314.136.314.31v.404c.095.055.175.135.23.23h.405c.17 0 .308.146.308.315 0 .175-.136.316-.31.316h-.404c-.055.095-.135.175-.23.23v.405c0 .172-.146.31-.315.31-.175 0-.316-.145-.316-.318v-.396c-.095-.055-.175-.135-.23-.23h-.405c-.172 0-.31-.146-.31-.315 0-.173.135-.314.31-.314h.404c.055-.095.135-.175.23-.23z"
                className="fill-color"
                fill={color}
            />
            <g transform="rotate(10 -109.02 216.52)">
                <path
                    d="M4.144 1.438C4.396.644 5.262 0 6.106 0h61.788c.832 0 1.71.643 1.962 1.438l2.688 8.476c.252.794.456 2.11.456 2.938V82.5c0 .828-.667 1.5-1.504 1.5H2.504C1.674 84 1 83.327 1 82.5V12.85c0-.83.204-2.143.456-2.938l2.688-8.476z"
                    className="stroke-color"
                    stroke={color}
                    strokeWidth="2"
                    fill="#FFF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M2 11h14M58 11h14"
                    className="stroke-color"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle fillOpacity=".1" className="fill-color" fill={color} cx="37" cy="41" r="34" />
                <circle className="stroke-color" stroke={color} strokeWidth="2" fill="#FFF" cx="37" cy="41" r="31" />
                <path
                    d="M47.943 14.576c1.85.77 3.604 1.73 5.235 2.853l-10.02 13.49c-.502-.306-1.03-.576-1.578-.805l6.363-15.54zM28.227 13.776C30.992 12.882 33.94 12.4 37 12.4c3.06 0 6.008.482 8.773 1.376l-4.84 16.09C39.7 29.437 38.378 29.2 37 29.2c-1.378 0-2.7.235-3.933.667l-4.84-16.09zM2 41.005C2 39.898 2.894 39 4 39h17.914s0 16.4 15.086 16.4S52.086 39 52.086 39H70c1.104 0 2 .897 2 2.005v19.99C72 62.102 71.102 63 70 63H4c-1.104 0-2-.897-2-2.005v-19.99z"
                    fillOpacity=".1"
                    className="fill-color"
                    fill={color}
                />
                <path
                    d="M1 41.496C1 40.67 1.68 40 2.496 40h16.407s1.194 18 17.903 18c16.71 0 17.904-18 17.904-18h16.407c.826 0 1.496.677 1.496 1.496v41.22c0 .827-.663 1.497-1.496 1.497H2.497C1.67 84.213 1 83.536 1 82.717v-41.22z"
                    className="stroke-color"
                    stroke={color}
                    strokeWidth="2"
                    fill="#FFF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M0 45.396C0 43.74 1.342 42.4 3.003 42.4h7.994c1.658 0 3.003 1.342 3.003 2.996v33.008c0 1.655-1.342 2.996-3.003 2.996H3.003C1.345 81.4 0 80.058 0 78.404V45.396zm60 0c0-1.655 1.342-2.996 3.003-2.996h7.994c1.658 0 3.003 1.342 3.003 2.996v33.008c0 1.655-1.342 2.996-3.003 2.996h-7.994C61.345 81.4 60 80.058 60 78.404V45.396z"
                    fillOpacity=".1"
                    className="fill-color"
                    fill={color}
                />
                <path
                    d="M37 52c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-9c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM1 47c0-1.105.887-2 2-2h6c1.105 0 2 .892 2 2v30c0 1.105-.887 2-2 2H3c-1.105 0-2-.892-2-2V47zm62 0c0-1.105.887-2 2-2h6c1.105 0 2 .892 2 2v30c0 1.105-.887 2-2 2h-6c-1.105 0-2-.892-2-2V47z"
                    className="stroke-color"
                    stroke={color}
                    strokeWidth="2"
                    fill="#FFF"
                />
            </g>
            <path
                d="M99.372 110.038c8.283-21.738 23.423-20.844 23.423-20.844"
                className="stroke-color"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M35.753 109.924c-.336-.754.064-1.413.89-1.47l69.597-4.868c.828-.058 1.316.537 1.088 1.333l-3.867 13.49c-.227.795-1.076 1.485-1.904 1.543l-57.995 4.055c-.824.058-1.763-.505-2.1-1.262l-5.707-12.822z"
                className="stroke-color"
                stroke={color}
                strokeWidth="2"
                fill="#FFF"
            />
            <path
                d="M39.528 113.096c-.21-.506.075-.96.614-1.01 0 0 14.445-1.487 21.824-.06 4.927.954 12.646 2.648 23.52 1.888 10.873-.76 17.98-5.755 17.98-5.755.463-.297.72-.098.58.425l-2.243 8.295c-.144.53-.713.993-1.25 1.03l-56.403 3.944c-.547.038-1.162-.35-1.367-.847l-3.255-7.91z"
                fillOpacity=".1"
                className="fill-color"
                fill={color}
            />
            <path
                d="M51.597 128h-7.84s4.893-.887 4.368-1.324c-1.327-1.103-2.174-2.78-2.174-4.662 0-3.32 2.644-6.014 5.904-6.014s5.903 2.693 5.903 6.014c0 1.76-.74 3.342-1.923 4.442-.16.15 1.61 1.544 1.61 1.544h-5.847zm40.16 0c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6zm27.69-43.423c.456-.32 1.223-.37 1.71-.114l6.958 3.645c.49.256.528.744.105 1.076l-2.804 2.203c-.43.34-1.138.345-1.582.012l-6.03-4.514c-.445-.33-.44-.854.022-1.177l1.62-1.133z"
                className="stroke-color"
                stroke={color}
                strokeWidth="2"
                fill="#FFF"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
    </AccessibleSVG>
);

export default UploadFilePaywallState;
