import PropTypes from 'prop-types';
import React from 'react';

import AccessibleSVG from '../../../icons/accessible-svg';

const IconActivityFeedEmptyState = ({ className = '', width = 90, height = 90 }) => (
    <AccessibleSVG
        className={`box-ui-activity-feed-empty-state-illustration ${className}`}
        width={width}
        height={height}
        viewBox='0 0 90 90'
    >
        <g fill='none' fillRule='evenodd'>
            <g className='themed-fill' fill='#1891D3'>
                <path d='M12.063 40.71v-.403c0-.17-.145-.307-.313-.307-.173 0-.313.134-.313.307v.402c-.094.054-.173.133-.228.227h-.403c-.17 0-.307.145-.307.313 0 .173.134.313.307.313h.402c.054.094.133.173.227.228v.403c0 .17.145.307.313.307.173 0 .313-.144.313-.303v-.406c.094-.054.173-.133.228-.227h.403c.17 0 .307-.145.307-.313 0-.173-.134-.313-.307-.313h-.402c-.054-.094-.133-.173-.227-.228zM86.063 65.71v-.403c0-.17-.145-.307-.313-.307-.173 0-.313.134-.313.307v.402c-.094.054-.173.133-.228.228h-.403c-.17 0-.307.144-.307.312 0 .173.134.313.307.313h.402c.054.094.133.173.227.228v.403c0 .17.145.307.313.307.173 0 .313-.144.313-.303v-.406c.094-.054.173-.133.228-.228h.403c.17 0 .307-.144.307-.312 0-.173-.134-.313-.307-.313h-.402c-.054-.094-.133-.173-.228-.228zM82.063 58.71v-.403c0-.17-.145-.307-.313-.307-.173 0-.313.134-.313.307v.402c-.094.054-.173.133-.228.227h-.403c-.17 0-.307.145-.307.313 0 .173.134.313.307.313h.402c.054.094.133.173.228.228v.403c0 .17.144.307.312.307.173 0 .313-.144.313-.303v-.406c.094-.054.173-.133.228-.227h.403c.17 0 .307-.145.307-.313 0-.173-.134-.313-.307-.313h-.402c-.054-.094-.133-.173-.228-.228zM5.5 48.134v-.642C5.5 47.22 5.268 47 5 47c-.276 0-.5.215-.5.49v.644c-.152.088-.278.214-.366.366H3.49c-.27 0-.49.232-.49.5 0 .276.215.5.49.5h.644c.088.152.214.278.366.366v.644c0 .27.232.49.5.49.276 0 .5-.23.5-.505v-.63c.152-.087.278-.213.366-.365h.644c.27 0 .49-.232.49-.5 0-.276-.215-.5-.49-.5h-.644c-.088-.152-.214-.278-.366-.366zM72.5 80.134v-.642c0-.272-.232-.492-.5-.492-.276 0-.5.215-.5.49v.644c-.152.088-.278.214-.366.366h-.644c-.27 0-.49.232-.49.5 0 .276.215.5.49.5h.644c.088.152.214.278.366.366v.644c0 .27.232.49.5.49.276 0 .5-.23.5-.505v-.63c.152-.087.278-.213.366-.365h.644c.27 0 .49-.232.49-.5 0-.276-.215-.5-.49-.5h-.644c-.088-.152-.214-.278-.366-.366zM9.5 24.134v-.642C9.5 23.22 9.268 23 9 23c-.276 0-.5.215-.5.49v.644c-.152.088-.278.214-.366.366H7.49c-.27 0-.49.232-.49.5 0 .276.215.5.49.5h.644c.088.152.214.278.366.366v.644c0 .27.232.49.5.49.276 0 .5-.23.5-.505v-.63c.152-.087.278-.213.366-.365h.644c.27 0 .49-.232.49-.5 0-.276-.215-.5-.49-.5h-.644c-.088-.152-.214-.278-.366-.366zM25.5 4.134v-.642C25.5 3.22 25.268 3 25 3c-.276 0-.5.215-.5.49v.644c-.152.088-.278.214-.366.366h-.644c-.27 0-.49.232-.49.5 0 .276.215.5.49.5h.644c.088.152.214.278.366.366v.644c0 .27.232.49.5.49.276 0 .5-.23.5-.505v-.63c.152-.087.278-.213.366-.365h.644c.27 0 .49-.232.49-.5 0-.276-.215-.5-.49-.5h-.644c-.088-.152-.214-.278-.366-.366z' />
            </g>
            <g transform='translate(31.482 4.398)'>
                <path
                    className='themed-stroke'
                    d='M24.1 37.948c1.336 1.475-1.102 3.144-1.132 5.456-.02 1.52 8.14-4.42 8.71-6.216 5.084-.824 14.258-5.722 14.258-17.522C45.936 7.866 36.036 0 22.968 0 9.898 0 0 7.866 0 19.666S10.013 40.05 24.1 37.948z'
                    stroke='#1891D3'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    fill='#FFF'
                />
                <path
                    className='themed-stroke'
                    d='M12.974 21.807c1.162 0 2.104-.945 2.104-2.11 0-1.166-.942-2.11-2.104-2.11-1.162 0-2.104.944-2.104 2.11 0 1.165.942 2.11 2.104 2.11z'
                    stroke='#1891D3'
                    strokeWidth='2'
                    fill='#FFF'
                />
                <ellipse
                    className='themed-stroke'
                    stroke='#1891D3'
                    strokeWidth='2'
                    fill='#FFF'
                    cx='22.793'
                    cy='19.696'
                    rx='2.104'
                    ry='2.11'
                />
                <ellipse
                    className='themed-stroke'
                    stroke='#1891D3'
                    strokeWidth='2'
                    fill='#FFF'
                    cx='32.611'
                    cy='19.696'
                    rx='2.104'
                    ry='2.11'
                />
                <path
                    className='themed-fill'
                    d='M29.27 34.837c8.045 0 14.566-6.918 14.566-15.452 0-8.534-6.52-15.452-14.565-15.452-1.35 0 9.78 5.064 9.27 15.452-.694 14.103-14.178 15.452-9.27 15.452z'
                    fillOpacity='.1'
                    fill='#1891D3'
                />
            </g>
            <g transform='translate(12.398 27.472)'>
                <path
                    className='themed-stroke'
                    d='M32.44 20.89v12.887c0 5.89-4.78 10.665-10.662 10.665H13.77c-5.886 0-10.66-4.773-10.66-10.665V20.89'
                    stroke='#1891D3'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
                <rect
                    className='themed-stroke'
                    stroke='#1891D3'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    fill='#FFF'
                    x='7.11'
                    width='21.33'
                    height='40'
                    rx='7.144'
                />
                <path
                    className='themed-fill'
                    d='M9.332 31.536v-.71s2.503 2.462 5.344 1.686c1.562-.427 4.228 2.16 6.83 1.905 2.128-.208 4.712-2.694 4.712-2.694v-.19 2.233c0 2.207-1.792 3.996-4.002 3.996h-8.883c-2.21 0-4-1.78-4-3.996v-2.23z'
                    fillOpacity='.1'
                    fill='#1891D3'
                />
                <path
                    className='themed-stroke'
                    d='M3.11 27.11v-6.22C1.394 20.89 0 22.28 0 24s1.393 3.11 3.11 3.11z'
                    stroke='#1891D3'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    fill='#FFF'
                />
                <path
                    className='themed-stroke'
                    d='M3.555 24H7.11M7.11 7h7.11M21.33 7h7.11M7.11 12h7.11M21.33 12h7.11M7.11 17h7.11M21.33 17h7.11M28.884 24h3.555'
                    stroke='#1891D3'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
                <path
                    className='themed-stroke'
                    d='M32.44 27.11v-6.22c1.717 0 3.11 1.392 3.11 3.11s-1.393 3.11-3.11 3.11zM6.665 21.778h22.218v4.444H6.665zM15.997 44.444h3.555V55.11h-3.555z'
                    stroke='#1891D3'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    fill='#FFF'
                />
                <path
                    className='themed-stroke'
                    stroke='#1891D3'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    fill='#FFF'
                    d='M10.665 53.778h14.22v4.444h-14.22z'
                />
            </g>
        </g>
    </AccessibleSVG>
);

IconActivityFeedEmptyState.displayName = 'IconActivityFeedEmptyState';

IconActivityFeedEmptyState.propTypes = {
    className: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number
};

export default IconActivityFeedEmptyState;
