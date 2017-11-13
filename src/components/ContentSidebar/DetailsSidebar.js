/**
 * @flow
 * @file Details sidebar component
 * @author Box
 */

import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from '../messages';
import SidebarSection from './SidebarSection';
import FileProperties from '../FileProperties';
import SidebarContent from './SidebarContent';
import SidebarSkills from './SidebarSkills';
import type { BoxItem } from '../../flowTypes';
import './DetailsSidebar.scss';

type Props = {
    file: BoxItem,
    getPreviewer: Function,
    hasTitle: boolean,
    hasSkills: boolean,
    hasDescription: boolean,
    hasProperties: boolean,
    hasMetadata: boolean,
    hasAccessStats: boolean,
    hasClassification: boolean,
    ensurePrivacy: boolean,
    intl: any
};

/* eslint-disable jsx-a11y/label-has-for */
const DetailsSidebar = ({
    file,
    getPreviewer,
    hasTitle,
    hasSkills,
    hasDescription,
    hasProperties,
    hasMetadata,
    hasAccessStats,
    hasClassification,
    ensurePrivacy,
    intl
}: Props) => {
    if (!hasSkills && !hasDescription && !hasProperties && !hasMetadata && !hasAccessStats && !hasClassification) {
        return null;
    }

    return (
        <SidebarContent hasTitle={hasTitle} title={<FormattedMessage {...messages.sidebarDetailsTitle} />}>
            {hasDescription &&
                <div className='bcs-details-description'>
                    <label>
                        <FormattedMessage {...messages.sidebarDescription} />
                        <textarea
                            readOnly
                            placeholder={intl.formatMessage(messages.sidebarDescriptionPlaceholder)}
                            defaultValue={file.description}
                        />
                    </label>
                </div>}
            {hasProperties &&
                <SidebarSection title={<FormattedMessage {...messages.sidebarProperties} />}>
                    <FileProperties file={file} ensurePrivacy={ensurePrivacy} />
                </SidebarSection>}
            {hasSkills && <SidebarSkills metadata={file.metadata} getPreviewer={getPreviewer} />}
        </SidebarContent>
    );
};

export default injectIntl(DetailsSidebar);
