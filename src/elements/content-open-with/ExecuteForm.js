/**
 * @flow
 * @file Form to invoke an integration via POST
 * @author Box
 */

import React, { PureComponent } from 'react';
import { HTTP_POST } from '../../constants';
import { isSafeHref } from '../../utils/url';
import type { ExecuteAPI } from '../../common/types/integrations';

type Props = {
    executePostData: ExecuteAPI,
    id: string,
    onSubmit: Function,
    windowName: ?string,
};

class ExecuteForm extends PureComponent<Props> {
    ref: any;

    constructor(props: Props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        const { executePostData, onSubmit }: Props = this.props;
        if (!this.ref.current || !isSafeHref(executePostData.url)) {
            return;
        }
        this.ref.current.submit();
        onSubmit();
    }

    render() {
        const {
            executePostData: { url, params },
            id,
            windowName,
        }: Props = this.props;
        const action = isSafeHref(url) ? url : undefined;
        return (
            <form
                ref={this.ref}
                action={action}
                id={`bcow-execute-form-${id}`}
                method={HTTP_POST}
                rel="noreferrer noopener"
                target={windowName || '_blank'}
            >
                {params && params.map(({ key, value }) => <input key={key} name={key} type="hidden" value={value} />)}
            </form>
        );
    }
}

export default ExecuteForm;
