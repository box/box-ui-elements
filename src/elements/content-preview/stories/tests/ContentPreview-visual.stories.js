// @flow
import * as React from 'react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { Notification } from '@box/blueprint-web';
import { http, HttpResponse } from 'msw';
import CustomRouter from '../../../common/routing/customRouter';

import { mockEventRequest, mockFileRequest, mockUserRequest } from '../../../__mocks__/mockRequests';
import { DEFAULT_HOSTNAME_API } from '../../../../constants';

import ContentPreview from '../../ContentPreview';

const WAIT_TIMEOUT = 5000;

export const basic = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = await canvas.findByRole('button', { name: 'Box AI' }, { timeout: WAIT_TIMEOUT });
        expect(button).toBeInTheDocument();
        await userEvent.click(button);

        const dialog = await waitFor(() => document.querySelector('[role="dialog"]'));
        expect(dialog).toBeInTheDocument();

        const modal = within(dialog);
        expect(modal.getByText('Welcome to Box AI')).toBeInTheDocument();
        expect(modal.getByText('Ask questions about')).toBeInTheDocument();
        expect(modal.getByText('This chat will be cleared when you close this pdf')).toBeInTheDocument();

        expect(modal.getByText('Summarize this document')).toBeInTheDocument();
        expect(modal.getByText('What are the key takeaways?')).toBeInTheDocument();
        expect(modal.getByText('How can this document be improved?')).toBeInTheDocument();
        expect(modal.getByText('Are there any next steps defined?')).toBeInTheDocument();

        expect(modal.getByText('Ask anything about this pdf')).toBeInTheDocument();
    },
};

export const closeModal = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = await canvas.findByRole('button', { name: 'Box AI' }, { timeout: WAIT_TIMEOUT });
        expect(button).toBeInTheDocument();
        await userEvent.click(button);

        const dialog = await waitFor(() => document.querySelector('[role="dialog"]'));
        expect(dialog).toBeInTheDocument();

        const modal = within(dialog);
        const closeButton = modal.getByRole('button', { name: 'Close Modal' });
        await userEvent.click(closeButton);
    },
};

export const submitAnswer = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = await canvas.findByRole('button', { name: 'Box AI' }, { timeout: WAIT_TIMEOUT });
        expect(button).toBeInTheDocument();
        await userEvent.click(button);

        const dialog = await waitFor(() => document.querySelector('[role="dialog"]'));
        expect(dialog).toBeInTheDocument();

        const modal = within(dialog);
        const textInput = modal.getByRole('textbox', { name: 'Ask anything about this pdf' });
        expect(textInput).toBeInTheDocument();
        textInput.focus();
        await userEvent.keyboard('Why are public APIs important?');

        await userEvent.click(modal.getByRole('button', { name: 'Ask' }), { pointerEventsCheck: 0 });
        const answer = await modal.findByText('Public APIs are important because of key and important reasons.');
        expect(answer).toBeInTheDocument();

        expect(modal.getByText('Based on:')).toBeInTheDocument();
    },
};

export const clickOnSuggestion = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = await canvas.findByRole('button', { name: 'Box AI' }, { timeout: WAIT_TIMEOUT });
        expect(button).toBeInTheDocument();
        await userEvent.click(button);

        const dialog = await waitFor(() => document.querySelector('[role="dialog"]'));
        expect(dialog).toBeInTheDocument();

        const modal = within(dialog);
        const suggestion = modal.getByText('Summarize this document');
        await userEvent.click(suggestion);

        const answer = await modal.findByText('Public APIs are important because of key and important reasons.');
        expect(answer).toBeInTheDocument();

        expect(modal.getByText('Based on:')).toBeInTheDocument();
    },
};

export const hoverOverCitation = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = await canvas.findByRole('button', { name: 'Box AI' }, { timeout: WAIT_TIMEOUT });
        expect(button).toBeInTheDocument();
        await userEvent.click(button);

        const dialog = await waitFor(() => document.querySelector('[role="dialog"]'));

        expect(dialog).toBeInTheDocument();
        const modal = within(dialog);
        const suggestion = modal.getByText('Summarize this document');
        await userEvent.click(suggestion);

        const answer = await modal.findByText('Public APIs are important because of key and important reasons.');
        expect(answer).toBeInTheDocument();

        expect(modal.getByText('Based on:')).toBeInTheDocument();

        const citation = await modal.getByRole('button', { name: 'Reference 1' });
        expect(citation).toBeInTheDocument();
        await userEvent.hover(citation);

        const main = await waitFor(() => document.querySelector('.sb-main-padded.sb-show-main'));
        await waitFor(async () => {
            await expect(within(main).getByText('Public APIs are key drivers of innovation and growth.')).toBeVisible();
        });
    },
};

export const citationDisabled = {
    args: {
        contentAnswersProps: {
            show: true,
            isCitationsEnabled: false,
            isMarkdownEnabled: true,
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = await canvas.findByRole('button', { name: 'Box AI' }, { timeout: WAIT_TIMEOUT });
        expect(button).toBeInTheDocument();
        await userEvent.click(button);

        const dialog = await waitFor(() => document.querySelector('[role="dialog"]'));
        expect(dialog).toBeInTheDocument();

        const modal = within(dialog);
        const suggestion = modal.getByText('Summarize this document');
        await userEvent.click(suggestion);

        const answer = await modal.findByText('Public APIs are important because of key and important reasons.');
        expect(answer).toBeInTheDocument();

        expect(modal.queryByText('Based on:')).not.toBeInTheDocument();
    },
};

export const clearConversation = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = await canvas.findByRole('button', { name: 'Box AI' }, { timeout: WAIT_TIMEOUT });
        expect(button).toBeInTheDocument();
        await userEvent.click(button);

        const dialog = await waitFor(() => document.querySelector('[role="dialog"]'));
        expect(dialog).toBeInTheDocument();

        const modal = within(dialog);
        const suggestion = modal.getByText('Summarize this document');
        await userEvent.click(suggestion);

        const answer = await modal.findByText('Public APIs are important because of key and important reasons.');
        expect(answer).toBeInTheDocument();

        expect(modal.getByText('Based on:')).toBeInTheDocument();

        const clearConversationButton = modal.getByRole('button', { name: 'Clear conversation' });
        await userEvent.click(clearConversationButton);

        const oldAnswer = modal.queryByText('Public APIs are important because of key and important reasons.');
        expect(oldAnswer).not.toBeInTheDocument();
    },
};

export const markdownEnabled = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = await canvas.findByRole('button', { name: 'Box AI' }, { timeout: WAIT_TIMEOUT });
        expect(button).toBeInTheDocument();
        await userEvent.click(button);

        const dialog = await waitFor(() => document.querySelector('[role="dialog"]'));
        expect(dialog).toBeInTheDocument();

        const modal = within(dialog);
        const textInput = modal.getByRole('textbox', { name: 'Ask anything about this pdf' });
        expect(textInput).toBeInTheDocument();
        textInput.focus();
        await userEvent.keyboard('table summarizing the highlights from the document');

        await userEvent.click(modal.getByRole('button', { name: 'Ask' }), { pointerEventsCheck: 0 });
        const answer = await modal.findByText('Here’s a table summarizing the highlights from the document:');
        expect(answer).toBeInTheDocument();
    },
};

export const markdownDisabled = {
    args: {
        contentAnswersProps: {
            show: true,
            isCitationsEnabled: false,
            isMarkdownEnabled: false,
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = await canvas.findByRole('button', { name: 'Box AI' }, { timeout: WAIT_TIMEOUT });
        expect(button).toBeInTheDocument();
        await userEvent.click(button);

        const dialog = await waitFor(() => document.querySelector('[role="dialog"]'));
        expect(dialog).toBeInTheDocument();

        const modal = within(dialog);
        const textInput = modal.getByRole('textbox', { name: 'Ask anything about this pdf' });
        expect(textInput).toBeInTheDocument();
        textInput.focus();
        await userEvent.keyboard('table summarizing the highlights from the document');

        await userEvent.click(modal.getByRole('button', { name: 'Ask' }), { pointerEventsCheck: 0 });
    },
};

export default {
    title: 'Elements/ContentPreview/tests/visual/BoxAI',
    component: ContentPreview,
    render: ({ ...args }) => (
        <Notification.Provider>
            <CustomRouter initialEntries={['/']}>
                <ContentPreview key={`${args.fileId}-${args.token}`} {...args} />
            </CustomRouter>
        </Notification.Provider>
    ),
    args: {
        features: global.FEATURE_FLAGS,
        fileId: global.FILE_ID,
        hasHeader: true,
        token: global.TOKEN,
        contentAnswersProps: {
            show: true,
            isCitationsEnabled: true,
            isMarkdownEnabled: true,
        },
    },
    parameters: {
        chromatic: {
            ignoreSelectors: ['[class^="bp_avatar_module_avatar--"] > [class^="bp_avatar_module_text--"]'],
        },
        msw: {
            handlers: [
                http.post(mockEventRequest.url, () => {
                    return HttpResponse.json(mockEventRequest.response);
                }),
                http.get(mockUserRequest.url, () => {
                    return HttpResponse.json(mockUserRequest.response);
                }),
                http.get(mockFileRequest.url, () => {
                    return HttpResponse.json(mockFileRequest.response);
                }),
                http.post(`${DEFAULT_HOSTNAME_API}/2.0/ai/ask`, async ({ request }) => {
                    const body = await request.json();
                    switch (body.prompt) {
                        case 'table summarizing the highlights from the document':
                            return HttpResponse.json({
                                answer: 'Here’s a table summarizing the highlights from the document:\n\n| **Highlight**                                                                                     |\n|---------------------------------------------------------------------------------------------------|\n| Captain of the NCAA Division I Women’s Lacrosse Team, with a 3.8 GPA in Business at Brown University and experience in sales, marketing, and operations across various internships. |',
                                created_at: '2024-09-20T12:25:51.816-07:00',
                                completion_reason: 'done',
                            });
                        default:
                            return HttpResponse.json({
                                answer: 'Public APIs are important because of key and important reasons.',
                                citations: [
                                    {
                                        content: 'Public APIs are key drivers of innovation and growth.',
                                        id: '123',
                                        type: 'file',
                                        name: 'The importance of public APIs.pdf',
                                    },
                                ],
                                completion_reason: 'done',
                                created_at: '2012-12-12T10:53:43-08:00',
                            });
                    }
                }),
            ],
        },
    },
};
