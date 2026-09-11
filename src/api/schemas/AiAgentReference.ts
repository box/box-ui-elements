/**
 * @author Box
 */

export type AiAgentTypeField = 'ai_agent_id';

export interface AiAgentReference {
    /**
     * AI Agent Reference type used to pass a custom AI Agent ID to requests.
     * See https://developer.box.com/reference/resources/ai-agent-reference/
     */
    readonly type: AiAgentTypeField;
    /**
     * The ID of the custom AI Agent.
     */
    readonly id: string;
}
