/**
 * @flow
 * @file Form to invoke an integration via POST
 * @author Box
 */

import * as React from 'react';

type Props = {
    formData: ExecuteAPI,
    id: string,
    ref: any,
};

const ExecuteForm = ({ formData: { url, params }, id, ref }: Props) => (
    <form
        ref={ref}
        id={`bcow-execute-form-${id}`}
        action={url}
        target="_blank"
        acceptCharset="utf-8"
        method="post"
        encType="application/x-www-form-urlencoded"
    >
        {params &&
            params.map(({ key, value }) => (
                <input key={key} name={key} value={value} type="hidden" />
            ))}
    </form>
);

export default ExecuteForm;
