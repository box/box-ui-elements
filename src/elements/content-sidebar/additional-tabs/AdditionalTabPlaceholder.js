/**
 * @flow
 * @file Preview sidebar additional tab loading component
 * @author Box
 */

import classNames from 'classnames';
import * as React from 'react';

type Props = {
    isLoading: boolean,
};

const AdditionalTabPlaceholder = ({ isLoading = false }: Props) => {
    const classes = classNames('bdl-AdditionalTab-icon', 'bdl-AdditionalTabLoading-placeholder', {
        'bdl-AdditionalTabLoading-placeholder--loading': isLoading,
    });
    return (
        <div className="bdl-AdditionalTabLoading">
            <div className={classes} />
        </div>
    );
};

export default AdditionalTabPlaceholder;
