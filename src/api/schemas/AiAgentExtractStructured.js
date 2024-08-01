/**
 * @flow
 * @author Box
 */

import { AiAgentBasicTextTool } from './AiAgentBasicTextTool.js';
import type { AiAgentLongTextTool } from './AiAgentLongTextTool.js';

export type AiAgentExtractStructuredTypeField = 'ai_agent_extract_structured';

export interface AiAgentExtractStructured {
    /**
     * The type of AI agent to be used for extraction.
     */
    +type: AiAgentExtractStructuredTypeField;
    +long_text?: AiAgentLongTextTool;
    +basic_text?: AiAgentBasicTextTool;
}
