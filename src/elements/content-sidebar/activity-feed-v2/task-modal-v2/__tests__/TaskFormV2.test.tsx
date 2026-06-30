import * as React from 'react';
import type { UserContactType } from '@box/user-selector';

import { render, screen, userEvent } from '../../../../../test-utils/testing-library';
import {
    TASK_COMPLETION_RULE_ALL,
    TASK_COMPLETION_RULE_ANY,
    TASK_EDIT_MODE_CREATE,
    TASK_EDIT_MODE_EDIT,
    TASK_TYPE_APPROVAL,
    TASK_TYPE_GENERAL,
} from '../../../../../constants';
import TaskFormV2, { TASK_FORM_V2_ID } from '../TaskFormV2';
import type { TaskFormV2Props, TaskFormV2SubmitPayload } from '../TaskFormV2';
import type { RuntimeAssignee } from '../utils/contactMapping';

type UserSelectorMockProps = {
    disabled?: boolean;
    error?: string;
    label?: React.ReactNode;
    onSelectedUsersChange?: (users: UserContactType[]) => void;
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

type DatePickerMockProps = { label: React.ReactNode; value?: unknown; minValue?: unknown };

let lastDatePickerProps: DatePickerMockProps = { label: null };

jest.mock('@box/blueprint-web', () => {
    const actual = jest.requireActual('@box/blueprint-web');
    return {
        ...actual,
        DatePicker: (props: DatePickerMockProps) => {
            lastDatePickerProps = props;
            return (
                <div data-testid="date-picker">
                    <span>{props.label}</span>
                    <span data-testid="date-picker-value">{props.value ? 'has-value' : 'empty'}</span>
                </div>
            );
        },
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

const buildGroupAssignee = (id: string, name: string): RuntimeAssignee => ({
    id: '',
    permissions: { can_delete: false, can_update: false },
    role: 'ASSIGNEE',
    status: 'NOT_STARTED',
    target: { id, name, type: 'group' },
    type: 'task_collaborator',
});

const renderForm = (props: Partial<TaskFormV2Props> = {}) => {
    const onSubmit = jest.fn();
    const fetchUsers = jest.fn().mockResolvedValue([]);
    const fetchAvatarUrls = jest.fn().mockResolvedValue({});
    const utils = render(
        <>
            <TaskFormV2
                fetchAvatarUrls={fetchAvatarUrls}
                fetchUsers={fetchUsers}
                onSubmit={onSubmit}
                taskType={TASK_TYPE_APPROVAL}
                {...props}
            />
            {/* External submit button to simulate the modal footer's form-id-targeted submit. */}
            <button data-testid="external-submit" form={TASK_FORM_V2_ID} type="submit">
                submit
            </button>
        </>,
    );
    return { ...utils, fetchAvatarUrls, fetchUsers, onSubmit };
};

const clickSubmit = async (user: ReturnType<typeof userEvent>) => {
    await user.click(screen.getByTestId('external-submit'));
};

beforeEach(() => {
    lastUserSelectorProps = {};
    lastDatePickerProps = { label: null };
});

describe('elements/content-sidebar/activity-feed-v2/task-modal-v2/TaskFormV2', () => {
    test('renders the assignee combobox, message field, and due date picker', () => {
        renderForm();
        expect(screen.getByTestId('user-selector')).toBeVisible();
        expect(screen.getByRole('textbox', { name: /message/i })).toBeVisible();
        expect(screen.getByTestId('date-picker')).toBeVisible();
    });

    test('does not show the completion-rule checkbox when there are no assignees', () => {
        renderForm();
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    test('shows the completion-rule checkbox disabled when only one user assignee is selected', () => {
        renderForm({ initialAssignees: [buildUserAssignee('1', 'Alice')] });
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeVisible();
        expect(checkbox).toBeDisabled();
    });

    test('enables the completion-rule checkbox when two users are selected', () => {
        renderForm({
            initialAssignees: [buildUserAssignee('1', 'Alice'), buildUserAssignee('2', 'Bob')],
        });
        expect(screen.getByRole('checkbox')).toBeEnabled();
    });

    test('enables the completion-rule checkbox when a group is selected', () => {
        renderForm({ initialAssignees: [buildGroupAssignee('99', 'Engineering')] });
        expect(screen.getByRole('checkbox')).toBeEnabled();
    });

    test('shows required-field errors when submitting an empty form', async () => {
        const user = userEvent();
        const { onSubmit } = renderForm();
        await clickSubmit(user);
        expect(screen.getAllByText('Required Field').length).toBeGreaterThanOrEqual(2);
        expect(onSubmit).not.toHaveBeenCalled();
    });

    test('calls onSubmit with the form payload when all required fields are filled', async () => {
        const user = userEvent();
        const { onSubmit } = renderForm({
            initialAssignees: [buildUserAssignee('1', 'Alice')],
            initialMessage: 'Please review',
        });
        await clickSubmit(user);

        expect(onSubmit).toHaveBeenCalledTimes(1);
        const payload = onSubmit.mock.calls[0][0] as TaskFormV2SubmitPayload;
        expect(payload.message).toBe('Please review');
        expect(payload.assignees).toHaveLength(1);
        expect(payload.assignees[0].target).toMatchObject({ id: '1', name: 'Alice', type: 'user' });
        expect(payload.completionRule).toBe(TASK_COMPLETION_RULE_ALL);
        expect(payload.dueDate).toBeNull();
    });

    test('toggling the completion-rule checkbox switches between ALL and ANY on submit', async () => {
        const user = userEvent();
        const { onSubmit } = renderForm({
            initialAssignees: [buildUserAssignee('1', 'Alice'), buildUserAssignee('2', 'Bob')],
            initialMessage: 'Review',
        });
        await user.click(screen.getByRole('checkbox'));
        await clickSubmit(user);

        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ completionRule: TASK_COMPLETION_RULE_ANY }));
    });

    test('forwards group selections to the submit payload', async () => {
        const user = userEvent();
        const { onSubmit } = renderForm({
            initialAssignees: [buildGroupAssignee('99', 'Engineering')],
            initialMessage: 'Group task',
        });
        await clickSubmit(user);

        expect(onSubmit).toHaveBeenCalledTimes(1);
        const payload = onSubmit.mock.calls[0][0] as TaskFormV2SubmitPayload;
        expect(payload.assignees[0].target).toMatchObject({ name: 'Engineering', type: 'group' });
    });

    test('seeds the message field from initialMessage', () => {
        renderForm({ initialMessage: 'Prefilled message' });
        expect(screen.getByRole('textbox', { name: /message/i })).toHaveValue('Prefilled message');
    });

    test('tags the form with data-resin-isediting=true in edit mode', () => {
        renderForm({ editMode: TASK_EDIT_MODE_EDIT });
        const form = document.getElementById(TASK_FORM_V2_ID);
        expect(form).toHaveAttribute('data-resin-isediting', 'true');
    });

    test('tags the form with data-resin-isediting=false in create mode', () => {
        renderForm({ editMode: TASK_EDIT_MODE_CREATE });
        const form = document.getElementById(TASK_FORM_V2_ID);
        expect(form).toHaveAttribute('data-resin-isediting', 'false');
    });

    test('tags the form with data-resin-tasktype from the prop', () => {
        renderForm({ taskType: TASK_TYPE_GENERAL });
        const form = document.getElementById(TASK_FORM_V2_ID);
        expect(form).toHaveAttribute('data-resin-tasktype', TASK_TYPE_GENERAL);
    });

    test('disables the assignee selector and message field when isDisabled=true', () => {
        renderForm({ isDisabled: true });
        expect(lastUserSelectorProps.disabled).toBe(true);
        expect(screen.getByRole('textbox', { name: /message/i })).toBeDisabled();
    });

    test('does not call onSubmit when isDisabled=true even if required fields are filled', async () => {
        const user = userEvent();
        const { onSubmit } = renderForm({
            initialAssignees: [buildUserAssignee('1', 'Alice')],
            initialMessage: 'Should not submit',
            isDisabled: true,
        });
        await clickSubmit(user);
        expect(onSubmit).not.toHaveBeenCalled();
    });

    test('passes today as the DatePicker minValue for new tasks', () => {
        renderForm();
        expect(lastDatePickerProps.minValue).toBeDefined();
    });

    test('omits the DatePicker minValue when editing a task whose due date is already in the past', () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 7);
        renderForm({ editMode: TASK_EDIT_MODE_EDIT, initialDueDate: pastDate });
        expect(lastDatePickerProps.minValue).toBeUndefined();
    });

    test('keeps today as the DatePicker minValue when editing a task whose due date is still in the future', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        renderForm({ editMode: TASK_EDIT_MODE_EDIT, initialDueDate: futureDate });
        expect(lastDatePickerProps.minValue).toBeDefined();
    });

    test('normalizes the submitted dueDate to end-of-day in create mode even when initialDueDate had a morning time', async () => {
        const user = userEvent();
        const morning = new Date();
        morning.setDate(morning.getDate() + 3);
        morning.setHours(9, 0, 0, 0);
        const { onSubmit } = renderForm({
            editMode: TASK_EDIT_MODE_CREATE,
            initialAssignees: [buildUserAssignee('1', 'Alice')],
            initialDueDate: morning,
            initialMessage: 'New task',
        });
        await clickSubmit(user);

        const payload = onSubmit.mock.calls[0][0] as TaskFormV2SubmitPayload;
        expect(payload.dueDate?.getHours()).toBe(23);
        expect(payload.dueDate?.getMinutes()).toBe(59);
        expect(payload.dueDate?.getSeconds()).toBe(59);
    });

    test('preserves the original time on the submitted dueDate in edit mode', async () => {
        const user = userEvent();
        const morning = new Date();
        morning.setDate(morning.getDate() + 3);
        morning.setHours(9, 30, 15, 0);
        const { onSubmit } = renderForm({
            editMode: TASK_EDIT_MODE_EDIT,
            initialAssignees: [buildUserAssignee('1', 'Alice')],
            initialDueDate: morning,
            initialMessage: 'Existing task',
        });
        await clickSubmit(user);

        const payload = onSubmit.mock.calls[0][0] as TaskFormV2SubmitPayload;
        expect(payload.dueDate?.getHours()).toBe(9);
        expect(payload.dueDate?.getMinutes()).toBe(30);
        expect(payload.dueDate?.getSeconds()).toBe(15);
    });
});
