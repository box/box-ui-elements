import React, { Children } from 'react';
import { Notification, TooltipProvider } from '@box/blueprint-web';

export interface ProvideProps {
    children: React.ReactNode;
    shouldProvide?: boolean;
}

const Provide = ({ children, shouldProvide = true }: ProvideProps) => {
    if (shouldProvide) {
        return (
            <Notification.Provider>
                <Notification.Viewport />
                <TooltipProvider>{children}</TooltipProvider>
            </Notification.Provider>
        );
    }

    return Children.only(children);
};

export default Provide;
