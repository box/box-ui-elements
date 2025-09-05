/* eslint-disable react/prefer-stateless-function */
/* eslint-disable max-classes-per-file */
import * as React from 'react';

import { SIDEBAR_VIEW_METADATA_REDESIGN } from '../../../constants';

export default {
    getAsyncSidebarContent: jest.fn(panelName => {
        return {
            details: class DetailsSidebar extends React.Component {
                render() {
                    return <div data-testid="details-sidebar" />;
                }
            },
            boxai: class BoxAISidebar extends React.Component {
                render() {
                    return <div data-testid="boxai-sidebar" />;
                }
            },
            metadata: class MetadataSidebar extends React.Component {
                render() {
                    return <div data-testid="metadata-sidebar" />;
                }
            },
            [SIDEBAR_VIEW_METADATA_REDESIGN]: class MetadataSidebarRedesigned extends React.Component {
                render() {
                    const { filteredTemplateIds } = this.props;
                    return (
                        <div 
                            data-testid="metadata-sidebar-redesigned"
                            data-filtered-template-ids={filteredTemplateIds ? JSON.stringify(filteredTemplateIds) : undefined}
                        />
                    );
                }
            },
            skills: class SkillsSidebar extends React.Component {
                render() {
                    return <div data-testid="skills-sidebar" />;
                }
            },
            activity: class ActivitySidebar extends React.Component {
                render() {
                    const { activeFeedEntryType, activeFeedEntryId, hasSidebarInitialized } = this.props;
                    return (
                        <div 
                            data-testid="activity-sidebar"
                            data-active-feed-entry-type={activeFeedEntryType}
                            data-active-feed-entry-id={activeFeedEntryId}
                            data-has-sidebar-initialized={hasSidebarInitialized}
                        />
                    );
                }
            },
            versions: class VersionsSidebar extends React.Component {
                render() {
                    const { versionId } = this.props;
                    return (
                        <div 
                            data-testid="versions-sidebar"
                            data-version-id={versionId}
                        />
                    );
                }
            },
            docgen: class DocGenSidebar extends React.Component {
                render() {
                    return <div data-testid="docgen-sidebar" />;
                }
            },
        }[panelName];
    }),
};
