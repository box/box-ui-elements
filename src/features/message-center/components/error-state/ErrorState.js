// @flow
import * as React from 'react';
import './ErrorState.scss';

type Props = {|
    children: React.Node,
|};

function ErrorState({ children }: Props) {
    return <section className="ErrorState">{children}</section>;
}

export default ErrorState;
