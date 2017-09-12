/**
 * @flow
 * @file Details sidebar component
 * @author Box
 */

import React from 'react';
import SidebarSection from './SidebarSection';
import FileProperties from '../FileProperties';
import Keywords from '../Keywords';
import Transcript from '../Transcript';
import Timelines from '../Timeline';
import SidebarContent from './SidebarContent';
import type { BoxItem, Cards, Card } from '../../flowTypes';
import './DetailsSidebar.scss';

type Props = {
    file: BoxItem,
    metadata?: Cards,
    getLocalizedMessage: Function
};

function getCard(card: Card) {
    const { card_type } = card;
    switch (card_type) {
        case 'keyword':
            return <Keywords card={card} />;
        case 'timeline':
            return <Timelines card={card} />;
        case 'transcript':
            return <Transcript card={card} />;
        default:
            return null;
    }
}

/* eslint-disable jsx-a11y/label-has-for */
const DetailsSidebar = ({ file, metadata, getLocalizedMessage }: Props) =>
    <SidebarContent title={getLocalizedMessage('buik.preview.sidebar.details.title')}>
        <div className='bcpr-sidebar-details-description'>
            <label>
                <span>
                    {getLocalizedMessage('buik.preview.sidebar.details.description')}
                </span>
                <textarea
                    readOnly
                    placeholder={getLocalizedMessage('buik.preview.sidebar.details.description.placeholder')}
                    defaultValue={file.description}
                />
            </label>
        </div>
        <SidebarSection title={getLocalizedMessage('buik.preview.sidebar.details.properties')}>
            <FileProperties file={file} getLocalizedMessage={getLocalizedMessage} />
        </SidebarSection>
        {!!metadata &&
            metadata.map((card: Card) =>
                <SidebarSection key={card.id} title={card.title}>
                    {getCard(card)}
                </SidebarSection>
            )}
    </SidebarContent>;

export default DetailsSidebar;
