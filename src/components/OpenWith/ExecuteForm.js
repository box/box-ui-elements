/**
 * @flow
 * @file Form to invoke an integration via POST
 * @author Box
 */

import React, { PureComponent } from 'react';

type Props = {
    executePostData: ExecuteAPI,
    id: string,
    onSubmit: Function,
};

class ExecuteForm extends PureComponent<Props> {
    ref: any;

    constructor(props: Props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        const { onSubmit }: Props = this.props;
        this.ref.current.submit();
        onSubmit();
    }

    render() {
        const {
            executePostData: { url, params },
            id,
        }: Props = this.props;
        return (
            <form
                ref={this.ref}
                id={`bcow-execute-form-${id}`}
                action={url}
                target="_blank"
                acceptCharset="utf-8"
                method="post"
                encType="application/x-www-form-urlencoded"
            >
                {params &&
                    params.map(({ key, value }) => (
                        <input
                            key={key}
                            name={key}
                            value={value}
                            type="hidden"
                        />
                    ))}
            </form>
        );
    }
}

export default ExecuteForm;
