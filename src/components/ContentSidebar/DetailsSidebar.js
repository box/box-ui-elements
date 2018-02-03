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

type Props = {
    file: BoxItem,
    getPreviewer: Function,
    hasTitle: boolean,
    hasSkills: boolean,
    hasProperties: boolean,
    hasMetadata: boolean,
    hasAccessStats: boolean,
    hasClassification: boolean,
    ensurePrivacy: boolean,
    rootElement: HTMLElement,
    appElement: HTMLElement
};

/* eslint-disable jsx-a11y/label-has-for */
const DetailsSidebar = ({
    file,
    getPreviewer,
    hasTitle,
    hasSkills,
    hasProperties,
    hasMetadata,
    hasAccessStats,
    hasClassification,
    ensurePrivacy,
    rootElement,
    appElement
}: Props) => {
    if (!hasSkills && !hasProperties && !hasMetadata && !hasAccessStats && !hasClassification) {
        return null;
    }

    return (
        <SidebarContent hasTitle={hasTitle} title={<FormattedMessage {...messages.sidebarDetailsTitle} />}>
            {hasSkills && (
                <SidebarSkills
                    metadata={file.metadata}
                    getPreviewer={getPreviewer}
                    rootElement={rootElement}
                    appElement={appElement}
                />
            )}
            {hasProperties && (
                <SidebarSection title={<FormattedMessage {...messages.sidebarProperties} />}>
                    <FileProperties file={file} ensurePrivacy={ensurePrivacy} />
                </SidebarSection>
            )}
        </SidebarContent>
    );
};

export default DetailsSidebar;
