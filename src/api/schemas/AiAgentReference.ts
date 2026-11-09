export type AiAgentTypeField = 'ai_agent_id';

export interface AiAgentReference {
    /**
     * AI Agent Reference type for a custom AI Agent ID.
     * @see https://developer.box.com/reference/resources/ai-agent-reference/
     */
    readonly type: AiAgentTypeField;

    /** The ID of the custom AI Agent. */
    readonly id: string;
}
