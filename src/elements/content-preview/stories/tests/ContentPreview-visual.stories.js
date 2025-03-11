// @flow
import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { Notification } from '@box/blueprint-web';
import { http, HttpResponse } from 'msw';

import { mockEventRequest, mockFileRequest, mockUserRequest } from '../../../common/__mocks__/mockRequests';
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
        expect(modal.getByText(/Welcome to Box AI/i)).toBeInTheDocument();
        expect(modal.getByText('Chat cleared when you close pdf')).toBeInTheDocument();

        expect(modal.getByText('Summarize this document')).toBeInTheDocument();
        expect(modal.getByText('What are the key takeaways?')).toBeInTheDocument();
        expect(modal.getByText('How can this document be improved?')).toBeInTheDocument();
        expect(modal.getByText('Are there any next steps defined?')).toBeInTheDocument();

        expect(modal.getByText('Ask Box AI')).toBeInTheDocument();
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
        const textInput = modal.getByRole('textbox', { name: 'Ask Box AI' });
        expect(textInput).toBeInTheDocument();
        textInput.focus();
        await userEvent.keyboard('table summarizing the highlights from the document');

        await userEvent.click(modal.getByRole('button', { name: 'Ask' }), { pointerEventsCheck: 0 });
    },
};

export default {
    title: 'Elements/ContentPreview/tests/visual/BoxAI',
    component: ContentPreview,
    render: ({ ...args }: any) => (
        <Notification.Provider>
            <Router>
                <ContentPreview key={`${args.fileId}-${args.token}`} {...args} />
            </Router>
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
