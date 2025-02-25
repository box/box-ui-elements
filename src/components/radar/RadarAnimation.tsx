import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import TetherComponent from 'react-tether';

import './RadarAnimation.scss';

export enum RadarAnimationPosition {
    BOTTOM_CENTER = 'bottom-center',
    BOTTOM_LEFT = 'bottom-left',
    BOTTOM_RIGHT = 'bottom-right',
    MIDDLE_CENTER = 'middle-center',
    MIDDLE_LEFT = 'middle-left',
    MIDDLE_RIGHT = 'middle-right',
    TOP_CENTER = 'top-center',
    TOP_LEFT = 'top-left',
    TOP_RIGHT = 'top-right',
}

const positions = {
    [RadarAnimationPosition.BOTTOM_CENTER]: {
        attachment: 'top center',
        targetAttachment: 'bottom center',
    },
    [RadarAnimationPosition.BOTTOM_LEFT]: {
        attachment: 'top left',
        targetAttachment: 'bottom left',
    },
    [RadarAnimationPosition.BOTTOM_RIGHT]: {
        attachment: 'top right',
        targetAttachment: 'bottom right',
    },
    [RadarAnimationPosition.MIDDLE_CENTER]: {
        attachment: 'middle center',
        targetAttachment: 'middle center',
    },
    [RadarAnimationPosition.MIDDLE_LEFT]: {
        attachment: 'middle right',
        targetAttachment: 'middle left',
    },
    [RadarAnimationPosition.MIDDLE_RIGHT]: {
        attachment: 'middle left',
        targetAttachment: 'middle right',
    },
    [RadarAnimationPosition.TOP_CENTER]: {
        attachment: 'bottom center',
        targetAttachment: 'top center',
    },
    [RadarAnimationPosition.TOP_LEFT]: {
        attachment: 'bottom left',
        targetAttachment: 'top left',
    },
    [RadarAnimationPosition.TOP_RIGHT]: {
        attachment: 'bottom right',
        targetAttachment: 'top right',
    },
};

export interface RadarAnimationProps {
    /** A React element to put the radar on */
    children: React.ReactElement;
    /** A CSS class for the radar */
    className?: string;
    /** Whether to constrain the radar to the element's scroll parent. Defaults to `false` */
    constrainToScrollParent: boolean;
    /** Whether to constrain the radar to window. Defaults to `true` */
    constrainToWindow: boolean;
    /** Forces the radar to be shown or hidden - defaults to true */
    isShown: boolean;
    /** A string of the form 'vert-offset horiz-offset' which controls positioning */
    offset?: string;
    /** Where to position the radar relative to the wrapped component */
    position: RadarAnimationPosition;
    /** A CSS class for the tether element component */
    tetherElementClassName?: string;
}

class RadarAnimation extends React.Component<RadarAnimationProps> {
    tetherRef = React.createRef<TetherComponent>();

    radarAnimationID = uniqueId('radarAnimation');

    static defaultProps = {
        constrainToScrollParent: false,
        constrainToWindow: true,
        isShown: true,
        position: RadarAnimationPosition.MIDDLE_RIGHT,
    };

    // Instance API: Forces the radar to be repositioned
    position = () => {
        const { isShown } = this.props;
        if (this.tetherRef.current && isShown) {
            this.tetherRef.current.position();
        }
    };

    render() {
        const {
            children,
            className = '',
            constrainToScrollParent,
            constrainToWindow,
            position,
            isShown,
            offset,
            tetherElementClassName,
            ...rest
        } = this.props;

        const constraints = [];
        if (constrainToScrollParent) {
            constraints.push({
                to: 'scrollParent',
                attachment: 'together',
            });
        }
        if (constrainToWindow) {
            constraints.push({
                to: 'window',
                attachment: 'together',
            });
        }

        const { attachment, targetAttachment } = positions[position];
        const child = React.Children.only(children);
        const referenceElement = React.cloneElement(
            child as React.ReactElement,
            {
                'aria-describedby': this.radarAnimationID,
            } as React.HTMLAttributes<HTMLElement>,
        );

        // Typescript defs seem busted for older versions of react-tether
        const tetherProps: {
            attachment: string;
            className?: string;
            classPrefix: string;
            constraints: {};
            targetAttachment: string;
            offset?: string;
        } = {
            attachment,
            classPrefix: 'radar-animation',
            constraints,
            targetAttachment,
        };

        if (tetherElementClassName) {
            tetherProps.className = tetherElementClassName;
        }

        if (offset) {
            tetherProps.offset = offset;
        }

        return (
            <TetherComponent ref={this.tetherRef} {...tetherProps}>
                {referenceElement}
                {isShown && (
                    <div className={`radar ${className}`} id={this.radarAnimationID} {...rest}>
                        <div className="radar-dot" />
                        <div className="radar-circle" />
                    </div>
                )}
            </TetherComponent>
        );
    }
}

export default RadarAnimation;
