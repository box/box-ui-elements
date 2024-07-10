/**
 * @flow
 * @file HOC for drag drop
 * @author Box
 */

import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
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
const makeDroppable = ({ dropValidator, onDrop }: { dropValidator?: Function, onDrop?: Function }) => <
    Props: PropsShape,
>(
    Wrapped: Function,
): ClassComponent<any, any> =>
    class DroppableComponent extends PureComponent<Props, State> {
        props: Props;

        state: State;

        enterLeaveCounter: number;

        droppableEl: Element;

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
         * Adds event listeners once the component mounts
         * @inheritdoc
         */
        componentDidMount() {
            this.bindDragDropHandlers();
        }

        componentDidUpdate() {
            if (!this.droppableEl) {
                this.bindDragDropHandlers();
                return;
            }
            // eslint-disable-next-line react/no-find-dom-node
            if (findDOMNode(this) !== this.droppableEl) {
                this.removeEventListeners(this.droppableEl);
                this.bindDragDropHandlers();
            }
        }

        /**
         * Function that removes the drag and drop related event listeners on the input element
         *
         * @param {Element} element
         * @return {void}
         */
        removeEventListeners = (element: Element) => {
            element.removeEventListener('dragenter', this.handleDragEnter);
            element.removeEventListener('dragover', this.handleDragOver);
            element.removeEventListener('dragleave', this.handleDragLeave);
            element.removeEventListener('drop', this.handleDrop);
        };

        /**
         * Bind drag and drop event handlers to the droppableEl, when the wrapped element
         * is changed, remove the event listeners on the previous droppableEl and add
         * event listeners on the new droppableEl
         */
        bindDragDropHandlers = () => {
            const droppableEl = findDOMNode(this); // eslint-disable-line react/no-find-dom-node
            if (!droppableEl || !(droppableEl instanceof Element)) {
                return;
            }

            // add event listeners directly on the element
            droppableEl.addEventListener('dragenter', this.handleDragEnter);
            droppableEl.addEventListener('dragover', this.handleDragOver);
            droppableEl.addEventListener('dragleave', this.handleDragLeave);
            droppableEl.addEventListener('drop', this.handleDrop);

            this.droppableEl = droppableEl;
        };

        /**
         * Removes event listeners when the component is going to unmount
         * @inheritdoc
         */
        componentWillUnmount() {
            if (!this.droppableEl || !(this.droppableEl instanceof Element)) {
                return;
            }

            this.removeEventListeners(this.droppableEl);
        }

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
            };

            return <Wrapped {...mergedProps} />;
        }
    };

export default makeDroppable;
