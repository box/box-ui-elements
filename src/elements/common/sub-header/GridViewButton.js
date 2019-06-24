// @flow

import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../../components/button';
import IconGridViewInverted from '../../../icons/general/IconGridViewInverted';
import IconGridView from '../../../icons/general/IconGridView';
import messages from '../messages';
import Tooltip from '../Tooltip';
import './GridViewButton.scss';

type Props = {
    isGridView: boolean,
};

const GridViewButton = (props: Props) => {
    const { isGridView, ...rest } = props;
    const icon = isGridView ? <IconGridView width={17} height={17} /> : <IconGridViewInverted width={17} height={17} />;

    return (
        <Tooltip text={<FormattedMessage {...messages.gridView} />}>
            <Button className="be-btn-grid-view" aria-label={messages.gridView.defaultMessage} type="button" {...rest}>
                {icon}
            </Button>
        </Tooltip>
    );
};

export default GridViewButton;
