/**
 * @author Box
 */

import type { AiAgentBasicTextTool } from './AiAgentBasicTextTool';
import type { AiAgentLongTextTool } from './AiAgentLongTextTool';

export type AiAgentExtractStructuredTypeField = 'ai_agent_extract_structured';

export interface AiAgentExtractStructured {
    /**
     * The type of AI agent to be used for extraction.
     */
    readonly type: AiAgentExtractStructuredTypeField;
    /**
     * The long-text tool configuration.
     */
    readonly long_text?: AiAgentLongTextTool;
    /**
     * The basic-text tool configuration.
     */
    readonly basic_text?: AiAgentBasicTextTool;
}
