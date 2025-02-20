import * as React from 'react';
import classNames from 'classnames';

interface Props {
    isLoading: boolean;
}

const AdditionalTabPlaceholder = ({ isLoading = false }: Props): React.ReactElement => {
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
