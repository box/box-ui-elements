import React from 'react';
export interface ProvideProps {
    children: React.ReactNode;
    hasProviders?: boolean;
}
declare const Providers: ({ children, hasProviders }: ProvideProps) => string | number | boolean | Iterable<React.ReactNode> | React.JSX.Element;
export default Providers;
