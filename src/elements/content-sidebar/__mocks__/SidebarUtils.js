/* eslint-disable react/prefer-stateless-function */
/* eslint-disable max-classes-per-file */
import * as React from 'react';

export default {
    getAsyncSidebarContent: jest.fn(panelName => {
        return {
            details: class DetailsSidebar extends React.Component {
                render() {
                    return <div data-testid="details-sidebar" />;
                }
            },
            metadata: class MetadataSidebar extends React.Component {
                render() {
                    return <div data-testid="metadata-sidebar" />;
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
