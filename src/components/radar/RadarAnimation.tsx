import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import TetherComponent, { type TetherProps } from 'react-tether';

import TetherPosition from '../../common/tether-positions';

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
        attachment: TetherPosition.TOP_CENTER,
        targetAttachment: TetherPosition.BOTTOM_CENTER,
    },
    [RadarAnimationPosition.BOTTOM_LEFT]: {
        attachment: TetherPosition.TOP_LEFT,
        targetAttachment: TetherPosition.BOTTOM_LEFT,
    },
    [RadarAnimationPosition.BOTTOM_RIGHT]: {
        attachment: TetherPosition.TOP_RIGHT,
        targetAttachment: TetherPosition.BOTTOM_RIGHT,
    },
    [RadarAnimationPosition.MIDDLE_CENTER]: {
        attachment: TetherPosition.MIDDLE_CENTER,
        targetAttachment: TetherPosition.MIDDLE_CENTER,
    },
    [RadarAnimationPosition.MIDDLE_LEFT]: {
        attachment: TetherPosition.MIDDLE_RIGHT,
        targetAttachment: TetherPosition.MIDDLE_LEFT,
    },
    [RadarAnimationPosition.MIDDLE_RIGHT]: {
        attachment: TetherPosition.MIDDLE_LEFT,
        targetAttachment: TetherPosition.MIDDLE_RIGHT,
    },
    [RadarAnimationPosition.TOP_CENTER]: {
        attachment: TetherPosition.BOTTOM_CENTER,
        targetAttachment: TetherPosition.TOP_CENTER,
    },
    [RadarAnimationPosition.TOP_LEFT]: {
        attachment: TetherPosition.BOTTOM_LEFT,
        targetAttachment: TetherPosition.TOP_LEFT,
    },
    [RadarAnimationPosition.TOP_RIGHT]: {
        attachment: TetherPosition.BOTTOM_RIGHT,
        targetAttachment: TetherPosition.TOP_RIGHT,
    },
};

export interface RadarAnimationProps {
    /** A React element to put the radar on */
    children: React.ReactElement;
    /** A CSS class for the radar */
    className?: string;
    /** Optional class name for the target wrapper element */
    targetWrapperClassName?: string;
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
            targetWrapperClassName,
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
        const referenceElement = React.cloneElement(child as React.ReactElement, {
            'aria-describedby': this.radarAnimationID,
        });

        const tetherProps: Pick<
            TetherProps,
            'attachment' | 'targetAttachment' | 'constraints' | 'classPrefix' | 'enabled'
        > & {
            offset?: string;
            className?: string;
        } = {
            attachment,
            classPrefix: 'radar-animation',
            constraints,
            enabled: isShown,
            targetAttachment,
        };

        if (tetherElementClassName) {
            tetherProps.className = tetherElementClassName;
        }

        if (offset) {
            tetherProps.offset = offset;
        }

        return (
            <TetherComponent
                ref={this.tetherRef}
                {...tetherProps}
                renderTarget={ref => (
                    <div ref={ref} className={classNames('bdl-RadarAnimation-target', targetWrapperClassName)}>
                        {referenceElement}
                    </div>
                )}
                renderElement={ref => (
                    <div ref={ref} className={`radar ${className}`} id={this.radarAnimationID} {...rest}>
                        <div className="radar-dot" />
                        <div className="radar-circle" />
                    </div>
                )}
            />
        );
    }
}

export default RadarAnimation;
