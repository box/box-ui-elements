import { type RenderOptions } from '@testing-library/react';
type RenderConnectedOptions = RenderOptions & {
    wrapperProps?: Record<string, unknown>;
};
declare const renderConnected: (element: any, options?: RenderConnectedOptions) => import("@testing-library/react").RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;
declare const createUserEvent: () => import("@testing-library/user-event").UserEvent;
export * from '@testing-library/react';
export { renderConnected as render, createUserEvent as userEvent };
