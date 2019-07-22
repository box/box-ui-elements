// @flow strict
/**
 * Helper for working with the SUIT convention for componentized CSS
 * http://suitcss.github.io/
 * (`scope-Component-subComponent--modifier.is-in-state`)
 *
 * Returns a component that attaches a default classname to a base element and prefixes the class with a namespace.
 * The base element tag can be changed per-instance using the `as` prop, following the styled-component convention.
 *
 * @example const Card = suit('Card'); <Card as="span" onClick={handleClick} />;
 * @example const H1 = suit('Heading-1', {tag: 'h1', scope: 'bdl'}); <H1>Hello</H1>;
 */
import * as React from 'react';
import classnames from 'classnames';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

const DEFAULT_PREFIX = 'bdl'; // "Box Design Language" namespace
const DEFAULT_ELEMENT = 'div'; // Used when no tag option is provided

type SuitComponentName = string; // the classname without the prefix

type SuitOptions = {
    scope?: SuitComponentName, // prefix for classname based on SUIT convention
    tag?: React.ElementType, // base HTML element tag name or React component reference
};

export type SuitComponentProps = {
    as: React.ElementType, // Component to use as outermost element, e.g., 'span'
    className?: string, // Additional class names
};

const suit = (baseClass: SuitComponentName, options: SuitOptions = {}) => {
    const { tag = DEFAULT_ELEMENT, scope = DEFAULT_PREFIX } = options;
    const scopedClassname = `${scope}-${baseClass}`;

    const SuitComponent = ({ as: Tag, className, ...rest }: SuitComponentProps) => (
        <Tag className={classnames(scopedClassname, className)} {...rest} />
    );

    SuitComponent.defaultProps = {
        as: tag,
    };

    SuitComponent.displayName = upperFirst(camelCase(baseClass));

    return SuitComponent;
};

export default suit;
