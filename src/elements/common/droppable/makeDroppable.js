import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

const makeDroppable = ({ dropValidator, onDrop }) => {
    return Wrapped => {
        return props => {
            const [canDrop, setCanDrop] = useState(false);
            const [isOver, setIsOver] = useState(false);
            const [isDragging, setIsDragging] = useState(false);
            const enterLeaveCounter = useRef(0);
            const droppableEl = useRef(null);

            useEffect(() => {
                const handleDragEnter = event => {
                    event.preventDefault();
                    if (++enterLeaveCounter.current === 1) {
                        const { dataTransfer } = event;
                        const canDrop = dropValidator ? dropValidator(props, dataTransfer) : true;
                        setIsOver(true);
                        setCanDrop(canDrop);
                    }
                };

                const handleDragOver = event => {
                    event.preventDefault();
                    const { dataTransfer } = event;
                    if (!dataTransfer) {
                        return;
                    }
                    if (!canDrop) {
                        dataTransfer.dropEffect = 'none';
                    } else if (dataTransfer.effectAllowed) {
                        dataTransfer.dropEffect = dataTransfer.effectAllowed;
                    }
                };

                const handleDrop = event => {
                    event.preventDefault();
                    enterLeaveCounter.current = 0;
                    setIsOver(false);
                    setIsDragging(false);
                    setCanDrop(false);
                    if (canDrop && onDrop) {
                        onDrop(event, props);
                    }
                };

                const handleDragLeave = event => {
                    event.preventDefault();
                    if (--enterLeaveCounter.current > 0) {
                        return;
                    }
                    setIsOver(false);
                    setIsDragging(false);
                    setCanDrop(false);
                };

                const element = droppableEl.current;
                if (element) {
                    element.addEventListener('dragenter', handleDragEnter);
                    element.addEventListener('dragover', handleDragOver);
                    element.addEventListener('dragleave', handleDragLeave);
                    element.addEventListener('drop', handleDrop);
                }

                return () => {
                    if (element) {
                        element.removeEventListener('dragenter', handleDragEnter);
                        element.removeEventListener('dragover', handleDragOver);
                        element.removeEventListener('dragleave', handleDragLeave);
                        element.removeEventListener('drop', handleDrop);
                    }
                };
            }, [canDrop, props]);

            const classes = classNames(props.className, {
                'is-droppable': canDrop,
                'is-over': isOver,
            });

            return <Wrapped ref={droppableEl} {...props} canDrop={canDrop} isOver={isOver} className={classes} />;
        };
    };
};

export default makeDroppable;
