/**
 * @flow
 * @file Component for the Modified column for the item
 * @author sghosh326
 */

import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from '../messages';
import Datefield from '../Date';
import { VIEW_RECENTS } from '../../constants';
import type { BoxItem, View } from '../../flowTypes';
import './ModifiedCell.scss';

type Props = {
    item: BoxItem,
    view: View,
    intl: any,
};

const ItemModified = ({ view, item, intl }: Props) => {
  const { modified_at = '', interacted_at = '', modified_by }: BoxItem = item;
  const isRecents: boolean = view === VIEW_RECENTS;
  const date: string = isRecents ? interacted_at || modified_at : modified_at;
  const modifiedByName: string = modified_by.name;

  return (
        <span className="be-item-modified">
            <FormattedMessage
                {...messages.modifiedColumnValue}
                values={{
                    date: <Datefield date={date} />,
                    name: modifiedByName,
                }}
            />
        </span>
  );
};

export default injectIntl(ItemModified);
