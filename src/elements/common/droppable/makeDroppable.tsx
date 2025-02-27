/**
 * @file HOC for drag drop
 * @author Box
 */

import * as React from 'react';
import { PureComponent, ComponentType, ReactElement } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import type { DOMStringList } from '../../../common/types/core';

export interface State {
    canDrop: boolean;
    isDragging: boolean;
    isOver: boolean;
}

// This interface is intentionally loose to allow for flexibility in the HOC
export interface DropValidatorProps {
    allowedTypes?: Array<string>;
    [key: string]: unknown;
}

export interface DropOptions {
    dropValidator?: (
        props: DropValidatorProps,
        dataTransfer: { types: Array<string> | DOMStringList } | DataTransfer,
    ) => boolean;
    onDrop?: (event: DragEvent, props: DropValidatorProps) => void;
}

/* eslint-disable no-plusplus */
// Define a base interface for props that includes className
export interface BaseProps {
    className?: string;
    [key: string]: unknown;
}

function makeDroppable({
    dropValidator,
    onDrop,
}: DropOptions): <P extends BaseProps>(WrappedComponent: ComponentType<P & State>) => ComponentType<P> {
    return function makeDroppableHOC<P extends BaseProps>(
        WrappedComponent: ComponentType<P & State>,
    ): ComponentType<P> {
        return class DroppableComponent extends PureComponent<P, State> {
            static displayName = `Droppable(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

            static defaultProps = {
                className: '',
            } as Partial<P>;

            enterLeaveCounter: number = 0;

            droppableEl: Element | null = null;

            constructor(props: P) {
                super(props);
                this.state = {
                    canDrop: false,
                    isDragging: false,
                    isOver: false,
                };
            }

            componentDidMount(): void {
                this.bindDragDropHandlers();
            }

            componentDidUpdate(): void {
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

            componentWillUnmount(): void {
                if (this.droppableEl) {
                    this.removeEventListeners(this.droppableEl);
                }
            }

            removeEventListeners = (element: Element): void => {
                element.removeEventListener('dragenter', this.handleDragEnter);
                element.removeEventListener('dragover', this.handleDragOver);
                element.removeEventListener('dragleave', this.handleDragLeave);
                element.removeEventListener('drop', this.handleDrop);
            };

            bindDragDropHandlers = (): void => {
                const droppableEl = findDOMNode(this); // eslint-disable-line react/no-find-dom-node
                if (!droppableEl || !(droppableEl instanceof Element)) {
                    return;
                }

                droppableEl.addEventListener('dragenter', this.handleDragEnter);
                droppableEl.addEventListener('dragover', this.handleDragOver);
                droppableEl.addEventListener('dragleave', this.handleDragLeave);
                droppableEl.addEventListener('drop', this.handleDrop);

                this.droppableEl = droppableEl;
            };

            handleDragEnter = (event: DragEvent): void => {
                event.preventDefault();

                if (++this.enterLeaveCounter === 1) {
                    const { dataTransfer } = event;

                    if (!dataTransfer) {
                        return;
                    }

                    const canDrop = dropValidator ? dropValidator(this.props, dataTransfer) : true;

                    this.setState({
                        isOver: true,
                        canDrop,
                    });
                }
            };

            handleDragOver = (event: DragEvent): void => {
                event.preventDefault();

                const { canDrop } = this.state;
                const { dataTransfer } = event;

                if (!dataTransfer) {
                    return;
                }

                if (!canDrop) {
                    dataTransfer.dropEffect = 'none';
                } else if (dataTransfer.effectAllowed) {
                    dataTransfer.dropEffect = dataTransfer.effectAllowed as 'none' | 'copy' | 'link' | 'move';
                }
            };

            handleDrop = (event: DragEvent): void => {
                event.preventDefault();

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

            handleDragLeave = (event: DragEvent): void => {
                event.preventDefault();

                if (--this.enterLeaveCounter > 0) {
                    return;
                }

                this.setState({
                    canDrop: false,
                    isDragging: false,
                    isOver: false,
                });
            };

            render(): ReactElement {
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
                } as unknown as P & State;

                return React.createElement(WrappedComponent, mergedProps);
            }
        };
    };
}

export default makeDroppable;
