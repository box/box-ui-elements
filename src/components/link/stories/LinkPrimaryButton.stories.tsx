import * as React from 'react';
import { BrowserRouter as Router, Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

import LinkPrimaryButton from '../LinkPrimaryButton';
import notes from './LinkPrimaryButton.stories.md';

export const basic = () => (
    <LinkPrimaryButton href="https://www.box.com/platform">A link that looks like a PrimaryButton</LinkPrimaryButton>
);

export const withCustomComponent = () => {
    // You can pass a custom component to be used instead of the default "a" tag, like a React Router link:
    // import { BrowserRouter as Router, Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

    const CustomRouterLink = ({ href, children, ...rest }: RouterLinkProps) => (
        <RouterLink to={href} {...rest}>
            {children}
        </RouterLink>
    );

    return (
        <Router>
            <LinkPrimaryButton href="/" component={CustomRouterLink}>
                A link
            </LinkPrimaryButton>
        </Router>
    );
};

export default {
    title: 'Components|Links/LinkPrimaryButton',
    component: LinkPrimaryButton,
    parameters: {
        notes,
    },
};
