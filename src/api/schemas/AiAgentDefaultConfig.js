/**
 * @flow
 * @author Box
 */

import type { AiAgentBasicTextTool } from './AiAgentBasicTextTool';

export type AiAgentDefaultConfig = {|
    /**
     * Required mode parameter for AI agent
     */
    +mode: string,

    /**
     * Optional language parameter for AI agent
     */
    +language?: string,

    /**
     * Optional basic text configuration
     */
    +basic_text?: AiAgentBasicTextTool,
|};
