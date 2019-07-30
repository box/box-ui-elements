// @flow

import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Button from '../../../components/button';
import IconGridViewInverted from '../../../icons/general/IconGridViewInverted';
import IconListView from '../../../icons/general/IconListView';
import messages from '../messages';
import Tooltip from '../Tooltip';
import type { ViewMode } from '../flowTypes';
import { VIEW_MODE_GRID, VIEW_MODE_LIST } from '../../../constants';
import { bdlGray50 } from '../../../styles/variables';
import './ViewModeChangeButton.scss';

type Props = {
    className?: string,
    onViewModeChange: (viewMode: ViewMode) => void,
    viewMode: ViewMode,
} & InjectIntlProvidedProps;

const ViewModeChangeButton = ({ className = '', onViewModeChange, intl, viewMode, ...rest }: Props) => {
    const isGridView = viewMode === VIEW_MODE_GRID;

    const onClick = () => {
        onViewModeChange(isGridView ? VIEW_MODE_LIST : VIEW_MODE_GRID);
    };

    return (
        <Tooltip
            text={
                isGridView ? <FormattedMessage {...messages.listView} /> : <FormattedMessage {...messages.gridView} />
            }
        >
            <Button
                data-testid="view-mode-change-button"
                className={classNames('bdl-ViewModeChangeButton', className)}
                type="button"
                onClick={onClick}
                {...rest}
            >
                {isGridView ? (
                    <IconListView color={bdlGray50} width={17} height={17} />
                ) : (
                    <IconGridViewInverted color={bdlGray50} width={17} height={17} />
                )}
            </Button>
        </Tooltip>
    );
};

export default injectIntl(ViewModeChangeButton);
