import * as React from 'react';
import { BrowserRouter as Router, Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

import LinkButton from '../LinkButton';
import notes from './LinkButton.stories.md';

export const basic = () => <LinkButton href="https://www.box.com/platform">A link that looks like a Button</LinkButton>;

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
            <LinkButton href="/" component={CustomRouterLink}>
                A link
            </LinkButton>
        </Router>
    );
};

export default {
    title: 'Components|Links/LinkButton',
    component: LinkButton,
    parameters: {
        notes,
    },
};
