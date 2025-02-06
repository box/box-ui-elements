/**
 * @flow
 * @file HOC for drag drop
 * @author Box
 */

const React = require('react');

const { PureComponent } = React;
const classNames = require('classnames');

type Props = {|
    className: string,
|};

type State = {|
    canDrop: boolean,
    isDragging: boolean,
    isOver: boolean,
|};

type MakeDroppableConfig = {|
    dropValidator?: (props: Props, dataTransfer: DataTransfer) => boolean,
    onDrop?: (event: DragEvent, props: Props) => void,
|};

type DroppableProps = {|
    ...Props,
    forwardedRef?: React$Ref<HTMLElement>,
    className?: string,
|};
function makeDroppable(config: MakeDroppableConfig): (React$ComponentType<any>) => React$ComponentType<Props> {
    const { dropValidator, onDrop } = config;

    return function wrapComponent(WrappedComponent: React$ComponentType<any>): React$ComponentType<Props> {
        type ComponentProps = {|
            ...Props,
            forwardedRef?: React$Ref<HTMLElement>,
        |};
        class DroppableComponent extends PureComponent<Props, State> {
            props: Props & { forwardedRef?: React$Ref<HTMLElement> };

            state: State;

            enterLeaveCounter: number;

            droppableEl: HTMLElement;

            droppableRef: { current: null | HTMLElement };

            handleDragEnter: (event: React$SyntheticDragEvent<HTMLElement>) => void;

            handleDragOver: (event: React$SyntheticDragEvent<HTMLElement>) => void;

            handleDrop: (event: React$SyntheticDragEvent<HTMLElement>) => void;

            handleDragLeave: (event: React$SyntheticDragEvent<HTMLElement>) => void;

            bindDragDropHandlers: () => void;

            removeEventListeners: () => void;

            render: () => React$Element<any>;

            static defaultProps = {
                className: '',
            };

            constructor(props: Props & { forwardedRef?: React$Ref<HTMLElement> }) {
                super(props);
                this.droppableRef = React.createRef();
                this.enterLeaveCounter = 0;
                this.state = {
                    canDrop: false,
                    isDragging: false,
                    isOver: false,
                };

                // Bind event handlers
                this.handleDragEnter = this.handleDragEnter.bind(this);
                this.handleDragOver = this.handleDragOver.bind(this);
                this.handleDragLeave = this.handleDragLeave.bind(this);
                this.handleDrop = this.handleDrop.bind(this);
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
                if (this.droppableRef.current !== this.droppableEl) {
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
            removeEventListeners = () => {
                // No need to manually remove handlers - React will handle cleanup
            };

            /**
             * Bind drag and drop event handlers to the droppableEl, when the wrapped element
             * is changed, remove the event listeners on the previous droppableEl and add
             * event listeners on the new droppableEl
             */
            bindDragDropHandlers = () => {
                // No need to manually bind handlers - we'll use React's event system
                const droppableEl = this.droppableRef.current;
                if (droppableEl) {
                    this.droppableEl = droppableEl;
                }
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
            // Flow type declared at class level
            handleDragEnter = (event: React$SyntheticDragEvent<HTMLElement>): void => {
                // This allows onDrop to be fired
                event.preventDefault();
                event.stopPropagation();

                // Use this to track the number of drag enters and leaves.
                // This is used to normalize enters/leaves between parent/child elements
                this.enterLeaveCounter += 1;

                if (this.enterLeaveCounter === 1) {
                    const { dataTransfer } = event;
                    let canDrop = true;

                    // Only proceed if we have dataTransfer
                    if (!dataTransfer) {
                        canDrop = false;
                    } else if (dropValidator) {
                        try {
                            // Pass props to validator with canDrop enabled for validation
                            const validatorProps: Props = {
                                ...this.props,
                                canDrop: true, // Always allow validation on dragenter
                                allowedTypes: this.props.allowedTypes || ['Files'], // Default to accepting all files
                                event, // Pass the event for type checking
                            };

                            // Run validation and ensure strict boolean result
                            const validationResult = dropValidator(validatorProps, dataTransfer);
                            canDrop = validationResult === true;

                            // Validation result logged for debugging if needed
                            if (process.env.NODE_ENV === 'development') {
                                // eslint-disable-next-line no-console
                                console.log('Drag validation:', {
                                    props: validatorProps,
                                    dataTransfer: {
                                        types: Array.from(dataTransfer.types || []),
                                        files: Array.from(dataTransfer.files || []),
                                        items: Array.from(dataTransfer.items || []),
                                    },
                                    result: canDrop,
                                });
                            }
                        } catch (error) {
                            // eslint-disable-next-line no-console
                            console.error('Validation error:', error);
                            canDrop = false;
                        }
                    }

                    // Check props.canDrop after validation
                    if (this.props.canDrop === false) {
                        // Drop disabled by props
                        canDrop = false;
                    }

                    // Log final validation state
                    // Drag validation complete

                    // State will be updated based on validation result
                    const newState: State = {
                        isOver: true,
                        canDrop,
                        isDragging: true,
                    };
                    this.setState(newState);
                }
            };

            /**
             * Function that gets called when an item is dragged over the drop zone
             *
             * @param {DragEvent} event - The dragover event
             * @return {void}
             */
            // Flow type declared at class level
            handleDragOver = (event: React$SyntheticDragEvent<HTMLElement>): void => {
                // This allows onDrop to be fired
                event.preventDefault();
                event.stopPropagation();

                const { dataTransfer } = event;

                if (!dataTransfer) {
                    return;
                }

                // Re-validate on dragover to ensure we still accept the drop
                let isValid = this.state.canDrop;

                if (dropValidator && this.props.canDrop !== false) {
                    try {
                        const validatorProps: Props = {
                            ...this.props,
                            canDrop: true,
                            allowedTypes: this.props.allowedTypes || ['Files'], // Default to accepting all files
                            event, // Pass the full event for validation context
                        };

                        // Ensure strict boolean result from validator
                        isValid = dropValidator(validatorProps, dataTransfer) === true;

                        if (process.env.NODE_ENV === 'development') {
                            // eslint-disable-next-line no-console
                            console.debug('Dragover validation:', {
                                isValid,
                                currentState: this.state,
                                props: validatorProps,
                                dataTransfer: {
                                    types: Array.from(dataTransfer.types || []),
                                    files: Array.from(dataTransfer.files || []),
                                    items: Array.from(dataTransfer.items || []),
                                },
                            });
                        }
                    } catch (error) {
                        console.error('Validation error:', error);
                        isValid = false;
                    }
                }

                // Update dropEffect based on validation
                if (!isValid) {
                    dataTransfer.dropEffect = 'none';
                } else if (dataTransfer.effectAllowed) {
                    dataTransfer.dropEffect =
                        dataTransfer.effectAllowed === 'all' ? 'copy' : dataTransfer.effectAllowed;
                }

                // Always maintain state during dragover
                this.setState({
                    canDrop: isValid,
                    isOver: true,
                    isDragging: true,
                });
            };

            /**
             * Function that gets called when an item is drop onto the drop zone
             *
             * @param {DragEvent} event - The drop event
             * @return {void}
             */
            // Flow type declared at class level
            handleDrop = (event: React$SyntheticDragEvent<HTMLElement>): void => {
                event.preventDefault();
                event.stopPropagation();

                // reset enterLeaveCounter
                this.enterLeaveCounter = 0;

                const { dataTransfer } = event;
                if (!dataTransfer) {
                    this.setState({ canDrop: false, isDragging: false, isOver: false });
                    return;
                }

                // Always call onDrop with current props and state
                if (onDrop) {
                    // Create a new event object with the dataTransfer
                    const dropEvent = {
                        ...event,
                        preventDefault: event.preventDefault.bind(event),
                        stopPropagation: event.stopPropagation.bind(event),
                        type: 'drop',
                        dataTransfer,
                    };

                    // Create props with correct data attributes
                    const dropProps = {
                        ...this.props,
                        className: classNames(this.props.className, {
                            'is-droppable': false,
                            'is-over': false,
                            'is-dragging': false,
                        }),
                        'data-candrop': 'false',
                        'data-isdragging': 'false',
                        'data-isover': 'false',
                    };

                    onDrop(dropEvent, dropProps);
                }

                // Reset state after drop
                this.setState({
                    canDrop: false,
                    isDragging: false,
                    isOver: false,
                });
            };

            /**
             * Function that gets called when an item is dragged out of the drop zone
             *
             * @param {DragEvent} event - The dragleave event
             * @return {void}
             */
            // Flow type declared at class level
            handleDragLeave = (event: React$SyntheticDragEvent<HTMLElement>): void => {
                event.preventDefault();

                // if enterLeaveCounter is zero, it means that we're actually leaving the item
                this.enterLeaveCounter -= 1;
                if (this.enterLeaveCounter > 0) {
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
                const { canDrop, isDragging, isOver } = this.state;

                // Split props into DOM-specific and component-specific props
                const { forwardedRef, ...restProps } = rest;

                // Event handlers that are always needed
                const eventHandlers = {
                    onDragEnter: this.handleDragEnter,
                    onDragOver: this.handleDragOver,
                    onDragLeave: this.handleDragLeave,
                    onDrop: this.handleDrop,
                };

                // Filter out non-DOM props and state props
                const filterDOMProps = props => {
                    const {
                        canDrop: _canDrop,
                        isDragging: _isDragging,
                        isOver: _isOver,
                        forwardedRef: _forwardedRef,
                        allowedTypes: _allowedTypes,
                        ...domProps
                    } = props;

                    // List of valid DOM props
                    const validDOMProps = [
                        'className',
                        'style',
                        'id',
                        'role',
                        'tabIndex',
                        'title',
                        'lang',
                        'dir',
                        'hidden',
                    ];

                    // Only include valid DOM props and data attributes
                    return Object.entries(domProps).reduce((acc, [key, value]) => {
                        // Keep data attributes, aria attributes, event handlers, and standard DOM props
                        if (
                            key.startsWith('data-') ||
                            key.startsWith('on') ||
                            key.startsWith('aria-') ||
                            validDOMProps.includes(key)
                        ) {
                            acc[key] = value;
                        }
                        return acc;
                    }, {});
                };

                // Base props that are safe for both HTML and React components
                const baseProps = {
                    ...filterDOMProps(restProps),
                    ref: node => {
                        this.droppableRef.current = node;
                        if (forwardedRef) {
                            if (typeof forwardedRef === 'function') {
                                forwardedRef(node);
                            } else {
                                forwardedRef.current = node;
                            }
                        }
                    },
                    className: classNames(className, {
                        'is-droppable': canDrop,
                        'is-over': isOver,
                        'is-dragging': isDragging,
                    }),
                    onDragEnter: this.handleDragEnter,
                    onDragOver: this.handleDragOver,
                    onDragLeave: this.handleDragLeave,
                    onDrop: this.handleDrop,
                    'data-candrop': String(canDrop),
                    'data-isdragging': String(isDragging),
                    'data-isover': String(isOver),
                    'data-testid': 'droppable',
                };

                return <WrappedComponent {...baseProps} />;
            }
        }

        return React.forwardRef((props: Props, ref: React$Ref<HTMLElement>) => (
            <DroppableComponent {...props} forwardedRef={ref} />
        ));
    };
}

module.exports = makeDroppable;
