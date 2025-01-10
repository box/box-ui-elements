import React, { PureComponent } from 'react';
import { HTTP_POST } from '../../constants';
import type { ExecuteAPI } from '../../common/types/integrations';

interface Props {
    executePostData: ExecuteAPI;
    id: string;
    onSubmit: () => void;
    windowName?: string;
}

class ExecuteForm extends PureComponent<Props> {
    private formRef: React.RefObject<HTMLFormElement>;

    constructor(props: Props) {
        super(props);
        this.formRef = React.createRef();
    }

    componentDidMount() {
        const { onSubmit } = this.props;
        if (this.formRef.current) {
            this.formRef.current.submit();
            onSubmit();
        }
    }

    render() {
        const {
            executePostData: { url, params },
            id,
            windowName,
        } = this.props;

        return (
            <form
                ref={this.formRef}
                action={url}
                id={`bcow-execute-form-${id}`}
                method={HTTP_POST}
                rel="noreferrer noopener"
                target={windowName || '_blank'}
            >
                {params?.map(({ key, value }) => <input key={key} name={key} type="hidden" value={value} />)}
            </form>
        );
    }
}

export default ExecuteForm;
