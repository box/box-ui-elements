import * as React from 'react';
import { BrowserRouter as Router, Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

import LinkButton from '../LinkButton';
import notes from './LinkButton.stories.md';

export const basic = () => (
    <LinkButton
        href="https://www.box.com/platform"
        // @ts-ignore TODO: figure out why this is giving a TS error
    >
        A link that looks like a Button
    </LinkButton>
);

export const large = () => (
    <LinkButton href="https://www.box.com/platform" size="large">
        A link that looks like a Button
    </LinkButton>
);

export const withCustomComponent = () => {
    // You can pass a custom component to be used instead of the default "a" tag, like a React Router link:
    // import { BrowserRouter as Router, Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

    const CustomRouterLink = ({ href, children, ...rest }: RouterLinkProps) => (
        // @ts-ignore TODO: figure out why this is giving a TS error
        <RouterLink to={href} {...rest}>
            {children}
        </RouterLink>
    );

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Router>
            <LinkButton href="/" component={CustomRouterLink}>
                A link
            </LinkButton>
        </Router>
    );
};

export default {
    title: 'Components/Links/LinkButton',
    component: LinkButton,
    parameters: {
        notes,
    },
};
