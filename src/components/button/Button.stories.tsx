import * as React from 'react';
import { action } from 'storybook/actions';

import * as vars from '../../styles/variables';

import PrimaryButton from '../primary-button';
import Icon from '../../icon/line/Plus16';
import Icon2 from '../../icons/general/IconEllipsis';
// @ts-ignore flow import
import InlineNotice from '../inline-notice';

import Button from './Button';
import notes from './Button.stories.md';

export const regular = () => {
    return <Button onClick={action('onClick called')}>Click Here</Button>;
};

export const loading = () => <Button isLoading>Click Here</Button>;

export const disabled = () => <Button isDisabled>Click Here</Button>;

export const withRadar = () => <Button showRadar>Click Here</Button>;

export const large = () => <Button size="large">Click Here</Button>;

export const iconButton = () => <Button icon={<Icon2 title="Options" />} size="large" />;

export const iconAndTextButton = () => (
    <Button icon={<Icon />} size="large">
        Click Here
    </Button>
);

export const fixingMargins = () => (
    <>
        <InlineNotice type="error" title="Note">
            The PlainButton variant has a <b>margin of 0</b> and needs special handling due to how the margin is defined
            for <b>hover/active states</b>.
            <br /> The methods shown below will cause problems for PlainButton. See PlainButton docs for details.
        </InlineNotice>
        <p>By default there are 5px margins on all sides of the Button and PrimaryButton components.</p>
        <p style={{ backgroundColor: vars.bdlGray10, display: 'inline-block' }}>
            <Button>Cancel</Button>
            <PrimaryButton>Action</PrimaryButton>
        </p>
        <p>
            A quick fix to remove the margins is to add the <code>man</code> (margin-all-none) or <code>mrn</code>/
            <code>mln</code>/<code>mhn</code>/<code>mvn</code> (right/left/horizontal/vertical) utility classes.
        </p>
        <p style={{ backgroundColor: vars.bdlGray10, display: 'inline-block' }}>
            <Button className="mln">Cancel (mln)</Button>
            <Button className="mhn">Other (mhn)</Button>
            <PrimaryButton className="mrn">Action (mrn)</PrimaryButton>
        </p>
        <p>
            Alternately, you can create a CSS class and customize as needed.
            <pre>
                <code>
                    {`
        .bdl-SpecialButton {
            margin: 0 $bdl-grid-unit;
        }
                    `}
                </code>
            </pre>
        </p>
    </>
);

export default {
    title: 'Components/Buttons/Button',
    component: Button,
    parameters: {
        notes,
    },
};
