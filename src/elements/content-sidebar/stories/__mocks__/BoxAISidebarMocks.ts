import {AgentType} from "@box/box-ai-agent-selector";

export const mockAgents: AgentType[] = [
    {
        id: '1',
        name: 'Agent 1',
        description: 'This is the default agent',
        isEnterpriseDefault: true,
        imageURL: 'https://cdn01.boxcdn.net/_assets/img/favicons/favicon-32x32.png',
    },
    {
        id: '2',
        name: 'Agent 2',
        description: 'This agent has a different description',
        isEnterpriseDefault: false,
    },
    {
        id: '3',
        name: 'Agent 3',
        isEnterpriseDefault: false,
        ask: { foo: 'foobar' },
    },
    {
        id: '4',
        name: 'Agent 4',
        description: 'This is agent 4',
        imageURL: 'https://cdn01.boxcdn.net/_assets/img/favicons/favicon-32x32.png',
    },
];
