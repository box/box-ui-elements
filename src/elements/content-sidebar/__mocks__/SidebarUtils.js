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
                    return <div data-testid="metadata-sidebar-redesigned" />;
                }
            },
            skills: class SkillsSidebar extends React.Component {
                render() {
                    return <div data-testid="skills-sidebar" />;
                }
            },
            activity: class ActivitySidebar extends React.Component {
                render() {
                    return <div data-testid="activity-sidebar" />;
                }
            },
            versions: class VersionsSidebar extends React.Component {
                render() {
                    return <div data-testid="versions-sidebar" />;
                }
            },
        }[panelName];
    }),
};
