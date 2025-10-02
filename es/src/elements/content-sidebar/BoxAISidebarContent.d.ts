/**
 * @file Box AI sidebar component
 * @author Box
 */
import * as React from 'react';
import { type AgentType } from '@box/box-ai-agent-selector';
import { type ApiWrapperWithInjectedProps } from '@box/box-ai-content-answers';
import { withAPIContext } from '../common/api-context';
import './BoxAISidebar.scss';
declare function BoxAISidebarContent(props: ApiWrapperWithInjectedProps & {
    onSelectedAgentCallback: (selectedAgent: AgentType) => void;
    shouldShowLandingPage: boolean;
}): React.JSX.Element;
export { BoxAISidebarContent as BoxAISidebarComponent };
declare const BoxAISidebarContentDefaultExport: typeof withAPIContext;
export default BoxAISidebarContentDefaultExport;
