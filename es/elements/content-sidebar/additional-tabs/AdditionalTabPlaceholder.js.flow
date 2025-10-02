/**
 * @flow
 * @file Preview sidebar additional tab placeholder component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';

type Props = {
    isLoading: boolean,
};

const AdditionalTabPlaceholder = ({ isLoading = false }: Props) => {
    const classes = classNames('bdl-AdditionalTabPlaceholder-icon', {
        'bdl-AdditionalTabPlaceholder-icon--loading': isLoading,
    });
    return (
        <div className="bdl-AdditionalTabPlaceholder" data-testid="additionaltabplaceholder">
            <div className={classes} />
        </div>
    );
};

export default AdditionalTabPlaceholder;
