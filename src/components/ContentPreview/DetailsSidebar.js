/**
 * @flow
 * @file Details sidebar component
 * @author Box
 */

import React from 'react';
import SidebarSection from './SidebarSection';
import FileProperties from '../FileProperties';
import SidebarContent from './SidebarContent';
import SidebarSkills from './SidebarSkills';
import type { BoxItem } from '../../flowTypes';
import './DetailsSidebar.scss';

type Props = {
    file: BoxItem,
    getLocalizedMessage: Function
};

/* eslint-disable jsx-a11y/label-has-for */
const DetailsSidebar = ({ file, getLocalizedMessage }: Props) =>
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
        <SidebarSkills metadata={file.metadata} getLocalizedMessage={getLocalizedMessage} />
    </SidebarContent>;

export default DetailsSidebar;
