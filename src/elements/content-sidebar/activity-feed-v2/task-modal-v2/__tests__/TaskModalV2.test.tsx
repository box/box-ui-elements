import * as React from 'react';
import type { UserContactType } from '@box/user-selector';

import { render, screen, userEvent } from '../../../../../test-utils/testing-library';
import {
    ERROR_CODE_GROUP_EXCEEDS_LIMIT,
    TASK_COMPLETION_RULE_ALL,
    TASK_TYPE_APPROVAL,
    TASK_TYPE_GENERAL,
} from '../../../../../constants';
import type { ElementsXhrError } from '../../../../../common/types/api';
import type { TaskNew } from '../../../../../common/types/tasks';
import TaskModalV2 from '../TaskModalV2';
import type { RuntimeAssignee } from '../utils/contactMapping';

type UserSelectorMockProps = {
    disabled?: boolean;
    error?: string;
    label?: React.ReactNode;
    onSelectedUsersChange?: (users: UserContactType[]) => void;
    placeholder?: string;
    selectedUsers?: UserContactType[];
};

let lastUserSelectorProps: UserSelectorMockProps = {};

jest.mock('@box/user-selector', () => ({
    UserSelectorContainer: (props: UserSelectorMockProps) => {
        lastUserSelectorProps = props;
        return (
            <div data-testid="user-selector">
                <label>
                    {props.label}
                    <input aria-label="assignee input" data-testid="user-selector-input" />
                </label>
                {props.error && <span role="alert">{props.error}</span>}
                <ul>
                    {(props.selectedUsers ?? []).map(user => (
                        <li data-testid="user-selector-chip" key={user.value}>
                            {user.name}
                        </li>
                    ))}
                </ul>
            </div>
        );
    },
}));

jest.mock('@box/blueprint-web', () => {
    const actual = jest.requireActual('@box/blueprint-web');
    return {
        ...actual,
        DatePicker: (props: { label: React.ReactNode; value?: unknown }) => (
            <div data-testid="date-picker">
                <span>{props.label}</span>
                <span data-testid="date-picker-value">{props.value ? 'has-value' : 'empty'}</span>
            </div>
        ),
    };
});

const buildUserAssignee = (id: string, name: string): RuntimeAssignee => ({
    id: '',
    permissions: { can_delete: false, can_update: false },
    role: 'ASSIGNEE',
    status: 'NOT_STARTED',
    target: { email: `${name.toLowerCase()}@example.com`, id, name, type: 'user' },
    type: 'task_collaborator',
});

const buildEditingTask = (overrides: Partial<TaskNew> = {}): TaskNew => ({
    assigned_to: { entries: [], limit: 25, next_marker: '' },
    completion_rule: TASK_COMPLETION_RULE_ALL,
    created_at: '2026-06-30T12:00:00Z',
    created_by: {
        id: 'creator',
        role: 'CREATOR',
        status: 'NOT_STARTED',
        target: { id: 'creator', name: 'Creator', type: 'user' },
        type: 'task_collaborator',
    },
    description: 'Existing task description',
    id: 'task-1',
    modified_at: '2026-06-30T12:00:00Z',
    permissions: {
        can_create_task_collaborator: true,
        can_create_task_link: true,
        can_delete: true,
        can_update: true,
    },
    status: 'NOT_STARTED',
    task_links: { entries: [], limit: 25, next_marker: '' },
    task_type: TASK_TYPE_APPROVAL,
    type: 'task',
    ...overrides,
});

type RenderModalOptions = {
    createTask?: jest.Mock;
    editTask?: jest.Mock;
    editingAssignees?: RuntimeAssignee[];
    editingTask?: TaskNew | null;
    error?: ElementsXhrError;
    isOpen?: boolean;
    onClose?: jest.Mock;
    onSubmitError?: jest.Mock;
    onSubmitSuccess?: jest.Mock;
    taskType?: TaskNew['task_type'];
};

const renderModal = (options: RenderModalOptions = {}) => {
    const createTask = options.createTask ?? jest.fn();
    const editTask = options.editTask ?? jest.fn();
    const fetchUsers = jest.fn().mockResolvedValue([]);
    const fetchAvatarUrls = jest.fn().mockResolvedValue({});
    const onClose = options.onClose ?? jest.fn();
    const onSubmitError = options.onSubmitError ?? jest.fn();
    const onSubmitSuccess = options.onSubmitSuccess ?? jest.fn();
    const taskType = options.taskType ?? TASK_TYPE_APPROVAL;
    const isOpen = options.isOpen ?? true;

    const editingTask = options.editingTask ?? null;
    const shared = {
        createTask,
        error: options.error,
        fetchAvatarUrls,
        fetchUsers,
        isOpen,
        onClose,
        onSubmitError,
        onSubmitSuccess,
        taskType,
    };
    const modal = editingTask ? (
        <TaskModalV2
            {...shared}
            editingAssignees={options.editingAssignees ?? []}
            editingTask={editingTask}
            editTask={editTask}
            mode="edit"
        />
    ) : (
        <TaskModalV2 {...shared} />
    );

    const utils = render(modal);
    return { ...utils, createTask, editTask, fetchAvatarUrls, fetchUsers, onClose, onSubmitError, onSubmitSuccess };
};

beforeEach(() => {
    lastUserSelectorProps = {};
});

describe('elements/content-sidebar/activity-feed-v2/task-modal-v2/TaskModalV2', () => {
    test('renders nothing when isOpen is false', () => {
        renderModal({ isOpen: false });
        expect(screen.queryByTestId('task-modal-v2')).not.toBeInTheDocument();
    });

    test('renders the dialog, form, and footer buttons when isOpen is true', () => {
        renderModal();
        expect(screen.getByTestId('task-modal-v2')).toBeVisible();
        expect(screen.getByTestId('user-selector')).toBeVisible();
        expect(screen.getByRole('button', { name: /create/i })).toBeVisible();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeVisible();
    });

    test.each([
        [TASK_TYPE_APPROVAL, false, 'Create Approval Task', /create/i],
        [TASK_TYPE_GENERAL, false, 'Create General Task', /create/i],
        [TASK_TYPE_APPROVAL, true, 'Modify Approval Task', /update/i],
        [TASK_TYPE_GENERAL, true, 'Modify General Task', /update/i],
    ])(
        'renders the correct title and submit label for taskType=%s editMode=%s',
        (taskType, isEdit, expectedTitle, submitLabelPattern) => {
            renderModal({
                editingTask: isEdit ? buildEditingTask({ task_type: taskType }) : null,
                taskType,
            });
            expect(screen.getByRole('heading', { name: expectedTitle })).toBeVisible();
            expect(screen.getByRole('button', { name: submitLabelPattern })).toBeVisible();
        },
    );

    test('calls onClose when the close button is clicked', async () => {
        const user = userEvent();
        const { onClose } = renderModal();
        await user.click(screen.getByRole('button', { name: 'Close' }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when Escape is pressed', async () => {
        const user = userEvent();
        const { onClose } = renderModal();
        await user.keyboard('{Escape}');
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when Cancel is clicked', async () => {
        const user = userEvent();
        const { onClose } = renderModal();
        await user.click(screen.getByRole('button', { name: /cancel/i }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('seeds the form with editingTask values when in edit mode', () => {
        renderModal({
            editingAssignees: [buildUserAssignee('1', 'Alice')],
            editingTask: buildEditingTask({ description: 'Prefilled' }),
        });
        expect(screen.getByRole('textbox', { name: /message/i })).toHaveValue('Prefilled');
        expect(screen.getByTestId('user-selector-chip')).toHaveTextContent('Alice');
    });

    test('calls createTask with form values on submit in create mode', async () => {
        const user = userEvent();
        const { createTask } = renderModal();
        lastUserSelectorProps.onSelectedUsersChange?.([
            { email: 'alice@example.com', id: 1, name: 'Alice', type: 'user', value: '1' },
        ]);
        await user.type(screen.getByRole('textbox', { name: /message/i }), 'Please review');
        await user.click(screen.getByRole('button', { name: /create/i }));

        expect(createTask).toHaveBeenCalledTimes(1);
        const [message, approvers, taskType, dueAt, completionRule] = createTask.mock.calls[0];
        expect(message).toBe('Please review');
        expect(approvers).toHaveLength(1);
        expect(approvers[0]).toMatchObject({ id: '1', name: 'Alice' });
        expect(taskType).toBe(TASK_TYPE_APPROVAL);
        expect(dueAt).toBeNull();
        expect(completionRule).toBe(TASK_COMPLETION_RULE_ALL);
    });

    test('calls editTask with diffed added/removed assignees on submit in edit mode', async () => {
        const user = userEvent();
        const alice = buildUserAssignee('1', 'Alice');
        const bob = buildUserAssignee('2', 'Bob');
        const { editTask } = renderModal({
            editingAssignees: [alice, bob],
            editingTask: buildEditingTask({ description: 'Edit me' }),
        });
        lastUserSelectorProps.onSelectedUsersChange?.([
            { email: 'alice@example.com', id: 1, name: 'Alice', type: 'user', value: '1' },
            { email: 'charlie@example.com', id: 3, name: 'Charlie', type: 'user', value: '3' },
        ]);
        await user.click(screen.getByRole('button', { name: /update/i }));

        expect(editTask).toHaveBeenCalledTimes(1);
        const payload = editTask.mock.calls[0][0];
        expect(payload.id).toBe('task-1');
        expect(payload.description).toBe('Edit me');
        expect(payload.addedAssignees).toHaveLength(1);
        expect(payload.addedAssignees[0]).toMatchObject({ id: '3', name: 'Charlie' });
        expect(payload.removedAssignees).toHaveLength(1);
        expect(payload.removedAssignees[0].target).toMatchObject({ id: '2', name: 'Bob' });
    });

    test('calls onSubmitSuccess and stops loading when createTask succeeds', async () => {
        const user = userEvent();
        const createTask = jest.fn((_text, _approvers, _type, _due, _rule, onSuccess) => onSuccess());
        const { onSubmitSuccess } = renderModal({ createTask });
        lastUserSelectorProps.onSelectedUsersChange?.([
            { email: 'a@example.com', id: 1, name: 'Alice', type: 'user', value: '1' },
        ]);
        await user.type(screen.getByRole('textbox', { name: /message/i }), 'msg');
        await user.click(screen.getByRole('button', { name: /create/i }));

        expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
    });

    test('calls onSubmitError when createTask fails', async () => {
        const user = userEvent();
        const apiError: ElementsXhrError = { status: 500 } as ElementsXhrError;
        const createTask = jest.fn((_text, _approvers, _type, _due, _rule, _ok, onError) => onError(apiError));
        const { onSubmitError } = renderModal({ createTask });
        lastUserSelectorProps.onSelectedUsersChange?.([
            { email: 'a@example.com', id: 1, name: 'Alice', type: 'user', value: '1' },
        ]);
        await user.type(screen.getByRole('textbox', { name: /message/i }), 'msg');
        await user.click(screen.getByRole('button', { name: /create/i }));

        expect(onSubmitError).toHaveBeenCalledWith(apiError);
    });

    test('renders a generic error notice when error has a non-forbidden status', () => {
        renderModal({ error: { status: 500 } as ElementsXhrError });
        expect(screen.getByText(/An error occurred while creating this task/i)).toBeVisible();
    });

    test('renders a forbidden-edit warning notice for 403 on edit (approval task)', () => {
        renderModal({
            editingTask: buildEditingTask({ task_type: TASK_TYPE_APPROVAL }),
            error: { status: 403 } as ElementsXhrError,
            taskType: TASK_TYPE_APPROVAL,
        });
        expect(screen.getByText(/Unable to remove assignee\(s\) because the task is now approved\./i)).toBeVisible();
    });

    test('renders a forbidden-edit warning notice for 403 on edit (general task)', () => {
        renderModal({
            editingTask: buildEditingTask({ task_type: TASK_TYPE_GENERAL }),
            error: { status: 403 } as ElementsXhrError,
            taskType: TASK_TYPE_GENERAL,
        });
        expect(screen.getByText(/Unable to remove assignee\(s\) because the task is now completed\./i)).toBeVisible();
    });

    test('renders a warning notice for group-exceeds-limit errors', () => {
        renderModal({ error: { code: ERROR_CODE_GROUP_EXCEEDS_LIMIT } as ElementsXhrError });
        expect(screen.getByText(/Exceeded max assignees per group/i)).toBeVisible();
        expect(screen.getByText(/cannot exceed the limit of 250 assignees per group/i)).toBeVisible();
    });

    test('forwards group selections to createTask', async () => {
        const user = userEvent();
        const { createTask } = renderModal();
        lastUserSelectorProps.onSelectedUsersChange?.([
            { email: '', id: 99, name: 'Engineering', type: 'group', value: '99' },
        ]);
        await user.type(screen.getByRole('textbox', { name: /message/i }), 'Group task');
        await user.click(screen.getByRole('button', { name: /create/i }));

        const approvers = createTask.mock.calls[0][1];
        expect(approvers[0].item).toMatchObject({ id: '99', name: 'Engineering', type: 'group' });
    });

    test('disables the cancel button while submitting', async () => {
        const user = userEvent();
        const createTask = jest.fn();
        renderModal({ createTask });
        lastUserSelectorProps.onSelectedUsersChange?.([
            { email: 'a@example.com', id: 1, name: 'Alice', type: 'user', value: '1' },
        ]);
        await user.type(screen.getByRole('textbox', { name: /message/i }), 'msg');
        await user.click(screen.getByRole('button', { name: /create/i }));

        expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    });

    test('tags the modal content with data-resin-component=taskmodalv2', () => {
        renderModal();
        expect(screen.getByTestId('task-modal-v2')).toHaveAttribute('data-resin-component', 'taskmodalv2');
    });

    test('tags the Cancel and Create buttons with data-resin-target and data-target-id', () => {
        renderModal();
        const cancel = screen.getByRole('button', { name: /cancel/i });
        const submit = screen.getByRole('button', { name: /create/i });
        expect(cancel).toHaveAttribute('data-resin-target', 'activityfeed-approvalformcancel');
        expect(cancel).toHaveAttribute('data-target-id', 'TaskModalV2-cancelButton');
        expect(submit).toHaveAttribute('data-resin-target', 'activityfeed-approvalformpost');
        expect(submit).toHaveAttribute('data-target-id', 'TaskModalV2-submitButton');
    });

    test('routes a synchronous throw from createTask through onSubmitError', async () => {
        const user = userEvent();
        const thrown = { status: 500 } as ElementsXhrError;
        const createTask = jest.fn(() => {
            throw thrown;
        });
        const { onSubmitError } = renderModal({ createTask });
        lastUserSelectorProps.onSelectedUsersChange?.([
            { email: 'a@example.com', id: 1, name: 'Alice', type: 'user', value: '1' },
        ]);
        await user.type(screen.getByRole('textbox', { name: /message/i }), 'msg');
        await user.click(screen.getByRole('button', { name: /create/i }));

        expect(onSubmitError).toHaveBeenCalledWith(thrown);
        expect(screen.getByRole('button', { name: /cancel/i })).toBeEnabled();
    });

    test('falls back to a null due date when editingTask.due_at is unparseable', () => {
        renderModal({
            editingTask: buildEditingTask({ due_at: 'not-a-real-date' }),
        });
        expect(screen.getByTestId('date-picker-value')).toHaveTextContent('empty');
    });

    test('renders a forbidden-edit warning for an Axios-shaped error with response.status=403', () => {
        const axiosLikeError = { response: { status: 403 } } as unknown as ElementsXhrError;
        renderModal({
            editingTask: buildEditingTask({ task_type: TASK_TYPE_GENERAL }),
            error: axiosLikeError,
            taskType: TASK_TYPE_GENERAL,
        });
        expect(screen.getByText(/Unable to remove assignee\(s\) because the task is now completed\./i)).toBeVisible();
    });

    test('renders a group-exceeds notice for an Axios-shaped error with response.data.code', () => {
        const axiosLikeError = {
            response: { data: { code: ERROR_CODE_GROUP_EXCEEDS_LIMIT } },
        } as unknown as ElementsXhrError;
        renderModal({ error: axiosLikeError });
        expect(screen.getByText(/Exceeded max assignees per group/i)).toBeVisible();
    });
});
