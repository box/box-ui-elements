import type { CitationType } from '@box/box-ai-content-answers';

export type AiClassificationReason = {
    answer: string;
    modifiedAt?: string;
    citations?: CitationType[];
};
