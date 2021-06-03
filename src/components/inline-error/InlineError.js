// @flow
import * as React from 'react';
// $FlowFixMe InlineNotice is in typescript
import InlineNotice from '../inline-notice';

type Props = {
    children: React.Node,
    className?: string,
    /** Title of the inline error. */
    title: React.Node,
};

const InlineError = (props: Props) => <InlineNotice {...props} type="error" />;

export default InlineError;
