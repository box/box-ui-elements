/**
 * @flow
 * @file Details sidebar component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import SidebarSection from './SidebarSection';
import FileProperties from '../FileProperties';
import SidebarContent from './SidebarContent';
import SidebarSkills from './SidebarSkills';
import type { BoxItem } from '../../flowTypes';
import './DetailsSidebar.scss';

type Props = {
    file: BoxItem,
    getPreviewer: Function
};

/* eslint-disable jsx-a11y/label-has-for */
const DetailsSidebar = ({ file, getPreviewer }: Props) =>
    <SidebarContent title={<FormattedMessage {...messages.sidebarDetailsTitle} />}>
        <SidebarSkills metadata={file.metadata} getPreviewer={getPreviewer} />
        <SidebarSection title={<FormattedMessage {...messages.sidebarProperties} />}>
            <FileProperties file={file} />
        </SidebarSection>
    </SidebarContent>;

export default DetailsSidebar;

// <div className='bcpr-sidebar-details-description'>
// <label>
//     <FormattedMessage {...messages.sidebarDescription} />
//     <textarea
//         readOnly
//         placeholder={intl.formatMessage(messages.sidebarDescriptionPlaceholder)}
//         defaultValue={file.description}
//     />
// </label>
// </div>
