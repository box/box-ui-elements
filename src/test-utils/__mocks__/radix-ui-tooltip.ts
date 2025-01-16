// Mock for @radix-ui/react-tooltip
const noop = (): void => {
    /* intentionally empty */
};

const createContext = () => {
    const context = {
        open: false,
        onOpenChange: noop,
        modal: false,
        onModalChange: noop,
        positioning: {
            arrow: { width: 10, height: 5 },
            autoUpdate: true,
            placement: 'top',
            strategy: 'absolute',
        },
    };

    return {
        Provider: ({ children }) => children,
        Root: ({ children }) => children,
        Trigger: ({ children }) => children,
        Portal: ({ children }) => children,
        Content: ({ children }) => children,
        context,
    };
};

const TooltipPrimitive = createContext();

module.exports = {
    Provider: TooltipPrimitive.Provider,
    Root: TooltipPrimitive.Root,
    Trigger: TooltipPrimitive.Trigger,
    Portal: TooltipPrimitive.Portal,
    Content: TooltipPrimitive.Content,
};
