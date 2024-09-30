import React, { Children } from 'react';
import { Notification, TooltipProvider } from '@box/blueprint-web';

export interface ProvideProps {
    children: React.ReactNode;
    hasProviders?: boolean;
}

const Provide = ({ children, hasProviders = true }: ProvideProps) => {
    if (hasProviders) {
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
