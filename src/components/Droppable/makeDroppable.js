import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';

/* eslint-disable no-plusplus */
function makeDroppable(definition = {}) {
    const { dropValidator, onDragEnter, onDragLeave, onDragOver, onDrop } = definition;

    return function WrappedComponent(BaseComponent) {
        const displayName = BaseComponent.displayName || BaseComponent.name || 'DroppableComponent';

        class DroppableComponent extends Component {
            static propTypes = {
                className: PropTypes.string
            };

            static contextTypes = {
                dragDrop: PropTypes.shape({
                    getDragItem: PropTypes.func
                })
            };

            static defaultProps = {
                className: ''
            };

            constructor(props) {
                super(props);
                this.enterLeaveCounter = 0;
                this.state = {
                    canDrop: false,
                    isDragging: false,
                    isOver: false
                };
            }

            /**
             * Adds event listeners once the component mounts
             */
            componentDidMount() {
                const droppableEl = findDOMNode(this);
                const { handleDragEnter, handleDragOver, handleDragLeave, handleDrop } = this;

                // add event listeners directly on the element
                droppableEl.addEventListener('dragenter', handleDragEnter);
                droppableEl.addEventListener('dragover', handleDragOver);
                droppableEl.addEventListener('dragleave', handleDragLeave);
                droppableEl.addEventListener('drop', handleDrop);

                this.droppableEl = droppableEl;
            }

            /**
             * Removes event listeners when the component is going to unmount
             */
            componentWillUnmount() {
                const { droppableEl } = this;
                const { handleDragEnter, handleDragOver, handleDragLeave, handleDrop } = this;

                // remove event listeners
                droppableEl.removeEventListener('dragenter', handleDragEnter);
                droppableEl.removeEventListener('dragover', handleDragOver);
                droppableEl.removeEventListener('dragleave', handleDragLeave);
                droppableEl.removeEventListener('drop', handleDrop);
            }

            /**
             * If currently inside a DragDrop context, returns the current drag item.
             * Otherwise, return null
             * @returns {object}
             */
            getDragItem() {
                const { dragDrop } = this.context;
                if (!dragDrop) {
                    return null;
                }

                return dragDrop.getDragItem();
            }

            /**
             * Sets a ref to the instance of BaseComponent
             * Note: This will return null if BaseComponent is a stateless, functional component
             * because stateless, functional components have no instances
             * @param {Component} ref - Ref to the component instance of BaseComponent
             */
            setWrappedRef = (ref) => {
                this.wrappedRef = ref;
            };

            /**
             * Function that gets called when an item is dragged into the drop zone
             * @param {SyntheticEvent} event - The dragenter event
             * @returns {void}
             */
            handleDragEnter = (event) => {
                // This allows onDrop to be fired
                event.preventDefault();

                // Use this to track the number of drag enters and leaves.
                // This is used to normalize enters/leaves between parent/child elements

                // we only want to do things in dragenter when the counter === 1
                if (++this.enterLeaveCounter === 1) {
                    const { props, wrappedRef } = this;
                    const { dataTransfer } = event;

                    const dragItem = this.getDragItem();
                    // if we don't have a dropValidator, we just default canDrop to true
                    const canDrop = dropValidator ? dropValidator(props, dataTransfer, dragItem) : true;

                    this.setState({
                        isOver: true,
                        canDrop
                    });

                    if (onDragEnter) {
                        // if onDragEnter was passed in, call it
                        onDragEnter(event, props, dragItem, wrappedRef);
                    }
                }
            };

            /**
             * Function that gets called when an item is dragged over the drop zone
             * @param {SyntheticEvent} event - The dragover event
             * @returns {void}
             */
            handleDragOver = (event) => {
                // This allows onDrop to be fired
                event.preventDefault();

                const { props, state, wrappedRef } = this;
                const { canDrop } = state;
                const { dataTransfer } = event;

                if (!canDrop) {
                    dataTransfer.dropEffect = 'none';
                } else if (dataTransfer.effectAllowed) {
                    // Set the drop effect if it was defined
                    dataTransfer.dropEffect = dataTransfer.effectAllowed;
                }

                if (onDragOver) {
                    const dragItem = this.getDragItem();
                    // if onDragOver was passed in, call it
                    onDragOver(event, props, dragItem, wrappedRef);
                }
            };

            /**
             * Function that gets called when an item is drop onto the drop zone
             * @param {SyntheticEvent} event - The drop event
             * @returns {void}
             */
            handleDrop = (event) => {
                event.preventDefault();

                // reset enterLeaveCounter
                this.enterLeaveCounter = 0;

                const { canDrop } = this.state;
                const { props, wrappedRef } = this;

                this.setState({
                    canDrop: false,
                    isDragging: false,
                    isOver: false
                });

                if (canDrop && onDrop) {
                    const dragItem = this.getDragItem();
                    // if onDrop was passed in, call it
                    onDrop(event, props, dragItem, wrappedRef);
                }
            };

            /**
             * Function that gets called when an item is dragged out of the drop zone
             * @param {SyntheticEvent} event - The dragleave event
             * @returns {void}
             */
            handleDragLeave = (event) => {
                event.preventDefault();

                // if enterLeaveCounter is zero, it means that we're actually leaving the item
                if (--this.enterLeaveCounter > 0) {
                    return;
                }

                const { props, wrappedRef } = this;

                this.setState({
                    canDrop: false,
                    isDragging: false,
                    isOver: false
                });

                if (onDragLeave) {
                    const dragItem = this.getDragItem();
                    // if onDragLeave was passed in, call it
                    onDragLeave(event, props, dragItem, wrappedRef);
                }
            };

            render() {
                const { props, state, setWrappedRef } = this;
                const { className, ...rest } = props;
                const { canDrop, isOver } = state;

                const classes = classNames(className, {
                    'is-droppable': canDrop,
                    'is-over': isOver
                });

                const mergedProps = {
                    ...rest,
                    ...state,
                    className: classes
                };

                return <BaseComponent {...mergedProps} ref={setWrappedRef} />;
            }
        }

        DroppableComponent.displayName = displayName;

        return DroppableComponent;
    };
}

export default makeDroppable;
