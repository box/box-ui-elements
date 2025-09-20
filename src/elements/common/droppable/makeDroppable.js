/**
 * @flow
 * @file HOC for drag drop
 * @author Box
 */

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import type { ClassComponent } from '../../../common/types/core';

type PropsShape = {
    className: string,
};

type State = {
    canDrop: boolean,
    isDragging: boolean,
    isOver: boolean,
};

/* eslint-disable no-plusplus */
const makeDroppable =
    ({ dropValidator, onDrop }: { dropValidator?: Function, onDrop?: Function }) =>
    <Props: PropsShape>(Wrapped: Function): ClassComponent<any, any> =>
        class DroppableComponent extends PureComponent<Props, State> {
            props: Props;

            state: State;

            enterLeaveCounter: number;

            droppableEl: Element | null;

            static defaultProps = {
                className: '',
            };

            /**
             * [constructor]
             *
             * @param {*} props
             * @return {DroppableComponent}
             */
            constructor(props: Props) {
                super(props);
                this.enterLeaveCounter = 0;
                this.state = {
                    canDrop: false,
                    isDragging: false,
                    isOver: false,
                };
            }

            /**
             * Removes event listeners when the component is going to unmount
             * @inheritdoc
             */
            componentWillUnmount() {
                this.removeEventListeners(this.droppableEl);
            }

            /**
             * Ref callback to store the DOM element reference
             * @param {Element | null} element - The DOM element or null
             */
            setDroppableRef = (element: Element | null) => {
                this.removeEventListeners(this.droppableEl);

                this.droppableEl = element;

                this.bindDragDropHandlers(element);
            };

            /**
             * Function that binds drag and drop related event listeners to the input element
             * @param {Element | null} element - The DOM element to attach listeners to
             */
            bindDragDropHandlers = (element: Element | null) => {
                if (!element) {
                    return;
                }
                element.addEventListener('dragenter', this.handleDragEnter);
                element.addEventListener('dragover', this.handleDragOver);
                element.addEventListener('dragleave', this.handleDragLeave);
                element.addEventListener('drop', this.handleDrop);
            };

            /**
             * Function that removes the drag and drop related event listeners on the input element
             * @param {Element | null} element - The DOM element to remove listeners from
             */
            removeEventListeners = (element: Element | null) => {
                if (!element) {
                    return;
                }
                element.removeEventListener('dragenter', this.handleDragEnter);
                element.removeEventListener('dragover', this.handleDragOver);
                element.removeEventListener('dragleave', this.handleDragLeave);
                element.removeEventListener('drop', this.handleDrop);
            };

            /**
             * Function that gets called when an item is dragged into the drop zone
             *
             * @param {SyntheticEvent} event - The dragenter event
             * @return {void}
             */
            handleDragEnter = (event: DragEvent) => {
                // This allows onDrop to be fired
                event.preventDefault();

                // Use this to track the number of drag enters and leaves.
                // This is used to normalize enters/leaves between parent/child elements

                // we only want to do things in dragenter when the counter === 1
                if (++this.enterLeaveCounter === 1) {
                    const { dataTransfer } = event;

                    // if we don't have a dropValidator, we just default canDrop to true
                    const canDrop = dropValidator ? dropValidator(this.props, dataTransfer) : true;

                    this.setState({
                        isOver: true,
                        canDrop,
                    });
                }
            };

            /**
             * Function that gets called when an item is dragged over the drop zone
             *
             * @param {DragEvent} event - The dragover event
             * @return {void}
             */
            handleDragOver = (event: DragEvent) => {
                // This allows onDrop to be fired
                event.preventDefault();

                const { canDrop } = this.state;
                const { dataTransfer } = event;

                if (!dataTransfer) {
                    return;
                }

                if (!canDrop) {
                    dataTransfer.dropEffect = 'none';
                } else if (dataTransfer.effectAllowed) {
                    // Set the drop effect if it was defined
                    dataTransfer.dropEffect = dataTransfer.effectAllowed;
                }
            };

            /**
             * Function that gets called when an item is drop onto the drop zone
             *
             * @param {DragEvent} event - The drop event
             * @return {void}
             */
            handleDrop = (event: DragEvent) => {
                event.preventDefault();

                // reset enterLeaveCounter
                this.enterLeaveCounter = 0;

                const { canDrop } = this.state;

                this.setState({
                    canDrop: false,
                    isDragging: false,
                    isOver: false,
                });

                if (canDrop && onDrop) {
                    onDrop(event, this.props);
                }
            };

            /**
             * Function that gets called when an item is dragged out of the drop zone
             *
             * @param {DragEvent} event - The dragleave event
             * @return {void}
             */
            handleDragLeave = (event: DragEvent) => {
                event.preventDefault();

                // if enterLeaveCounter is zero, it means that we're actually leaving the item
                if (--this.enterLeaveCounter > 0) {
                    return;
                }

                this.setState({
                    canDrop: false,
                    isDragging: false,
                    isOver: false,
                });
            };

            /**
             * Renders the HOC
             *
             * @private
             * @inheritdoc
             * @return {Element}
             */
            render() {
                const { className, ...rest } = this.props;
                const { canDrop, isOver } = this.state;

                const classes = classNames(className, {
                    'is-droppable': canDrop,
                    'is-over': isOver,
                });

                const mergedProps = {
                    ...rest,
                    ...this.state,
                    className: classes,
                    ref: this.setDroppableRef,
                };

                return <Wrapped {...mergedProps} />;
            }
        };

export default makeDroppable;
