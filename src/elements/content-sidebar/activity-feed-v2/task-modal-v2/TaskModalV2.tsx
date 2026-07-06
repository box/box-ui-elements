import * as React from 'react';
import { useIntl } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';

import { Modal } from '@box/blueprint-web';
import type { FetchedAvatarUrls, UserContactType } from '@box/user-selector';

import { TASK_COMPLETION_RULE_ALL, TASK_EDIT_MODE_EDIT, TASK_TYPE_GENERAL } from '../../../../constants';

import type { ElementsXhrError } from '../../../../common/types/api';
import type { TaskCollabAssignee, TaskEditMode, TaskNew, TaskType } from '../../../../common/types/tasks';
import type { GroupMini, SelectorItem, UserMini } from '../../../../common/types/core';

import { ACTIVITY_TARGETS, INTERACTION_TARGET } from '../../../common/interactionTargets';

import TaskErrorNotice from './TaskErrorNotice';
import TaskFormV2, { TASK_FORM_V2_ID } from './TaskFormV2';
import type { CreateTaskCallback, EditTaskCallback, TaskAssignee, TaskFormV2SubmitPayload } from './types';

import messages from './messages';

import './TaskModalV2.scss';

type EditModeProps = {
    editingAssignees: TaskAssignee[];
    editingTask: TaskNew;
    editTask: EditTaskCallback;
    mode: 'edit';
};

type CreateModeProps = {
    editingAssignees?: never;
    editingTask?: never;
    editTask?: never;
    mode?: 'create';
};

type SharedProps = {
    createTask: CreateTaskCallback;
    error?: ElementsXhrError;
    fetchAvatarUrls: (contacts: UserContactType[]) => Promise<FetchedAvatarUrls>;
    fetchUsers: (query: string) => Promise<UserContactType[]>;
    isOpen: boolean;
    onClose: () => void;
    onSubmitError: (error: ElementsXhrError) => void;
    onSubmitSuccess: () => void;
    taskType: TaskType;
};

export type TaskModalV2Props = SharedProps & (CreateModeProps | EditModeProps);

const getTitleMessage = (taskType: TaskType, editMode: TaskEditMode): MessageDescriptor => {
    const isEdit = editMode === TASK_EDIT_MODE_EDIT;
    if (taskType === TASK_TYPE_GENERAL) {
        return isEdit ? messages.editGeneralTaskTitle : messages.createGeneralTaskTitle;
    }
    return isEdit ? messages.editApprovalTaskTitle : messages.createApprovalTaskTitle;
};

const assigneeToSelectorItem = (assignee: TaskAssignee): SelectorItem<UserMini | GroupMini> => ({
    id: assignee.target.id,
    item: assignee.target,
    name: assignee.target.name,
    value: assignee.target.id,
});

const diffAssignees = (
    next: TaskAssignee[],
    previous: TaskAssignee[],
): { added: TaskAssignee[]; removed: TaskAssignee[] } => {
    const previousIds = new Set(previous.map(a => a.target.id));
    const nextIds = new Set(next.map(a => a.target.id));
    return {
        added: next.filter(a => !previousIds.has(a.target.id)),
        removed: previous.filter(a => !nextIds.has(a.target.id)),
    };
};

const parseInitialDueDate = (raw: string | null | undefined): Date | null => {
    if (!raw) {
        return null;
    }
    const parsed = new Date(raw);
    return Number.isFinite(parsed.getTime()) ? parsed : null;
};

const TaskModalV2 = ({
    createTask,
    error,
    fetchAvatarUrls,
    fetchUsers,
    isOpen,
    onClose,
    onSubmitError,
    onSubmitSuccess,
    taskType,
    ...editProps
}: TaskModalV2Props) => {
    const isEditMode = editProps.mode === 'edit';
    const editMode: TaskEditMode = isEditMode ? 'EDIT' : 'CREATE';
    const editingTask = isEditMode ? editProps.editingTask : undefined;
    const editingAssignees = isEditMode ? editProps.editingAssignees : undefined;
    const editTask = isEditMode ? editProps.editTask : undefined;

    const { formatMessage } = useIntl();
    const titleMessage = getTitleMessage(taskType, editMode);

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const initialAssignees = editingAssignees;
    const initialMessage = editingTask?.description ?? '';
    const initialCompletionRule = editingTask?.completion_rule ?? TASK_COMPLETION_RULE_ALL;
    const initialDueDate = parseInitialDueDate(editingTask?.due_at ?? null);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    const handleSuccess = React.useCallback(() => {
        setIsSubmitting(false);
        onSubmitSuccess();
    }, [onSubmitSuccess]);

    const handleError = React.useCallback(
        (apiError: ElementsXhrError) => {
            setIsSubmitting(false);
            onSubmitError(apiError);
        },
        [onSubmitError],
    );

    const handleFormSubmit = (payload: TaskFormV2SubmitPayload) => {
        setIsSubmitting(true);
        const dueAtString = payload.dueDate ? payload.dueDate.toISOString() : null;

        try {
            if (isEditMode && editingTask && editTask) {
                const { added, removed } = diffAssignees(payload.assignees, editingAssignees ?? []);
                editTask(
                    {
                        addedAssignees: added.map(assigneeToSelectorItem),
                        completion_rule: payload.completionRule,
                        description: payload.message,
                        due_at: dueAtString,
                        id: editingTask.id,
                        // Cast widens v1's UserMini-only target to runtime reality (group targets exist).
                        removedAssignees: removed as unknown as TaskCollabAssignee[],
                    },
                    handleSuccess,
                    handleError,
                );
                return;
            }
            createTask(
                payload.message,
                payload.assignees.map(assigneeToSelectorItem),
                taskType,
                dueAtString,
                payload.completionRule,
                handleSuccess,
                handleError,
            );
        } catch (thrown) {
            handleError(thrown as ElementsXhrError);
        }
    };

    const submitLabel = formatMessage(isEditMode ? messages.updateButtonLabel : messages.createButtonLabel);

    return (
        <Modal open={isOpen} onOpenChange={handleOpenChange}>
            <Modal.Content
                className="bcs-NewTaskModal"
                data-resin-component="taskmodalv2"
                data-testid="task-modal-v2"
                size="medium"
            >
                <Modal.Header>{formatMessage(titleMessage)}</Modal.Header>
                <Modal.Body className="bcs-NewTaskModal-body">
                    <TaskErrorNotice error={error} isEditMode={isEditMode} taskType={taskType} />
                    <TaskFormV2
                        key={isEditMode ? `edit-${editingTask.id}` : 'create'}
                        editMode={editMode}
                        fetchAvatarUrls={fetchAvatarUrls}
                        fetchUsers={fetchUsers}
                        initialAssignees={initialAssignees}
                        initialCompletionRule={initialCompletionRule}
                        initialDueDate={initialDueDate}
                        initialMessage={initialMessage}
                        isDisabled={isSubmitting}
                        onSubmit={handleFormSubmit}
                        taskId={editingTask?.id}
                        taskType={taskType}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Modal.Footer.SecondaryButton
                        data-target-id="TaskModalV2-cancelButton"
                        disabled={isSubmitting}
                        onClick={onClose}
                        {...{ [INTERACTION_TARGET]: ACTIVITY_TARGETS.APPROVAL_FORM_CANCEL }}
                    >
                        {formatMessage(messages.cancelButtonLabel)}
                    </Modal.Footer.SecondaryButton>
                    <Modal.Footer.PrimaryButton
                        data-target-id="TaskModalV2-submitButton"
                        form={TASK_FORM_V2_ID}
                        loading={isSubmitting}
                        loadingAriaLabel={formatMessage(messages.loadingAriaLabel)}
                        type="submit"
                        {...{ [INTERACTION_TARGET]: ACTIVITY_TARGETS.APPROVAL_FORM_POST }}
                    >
                        {submitLabel}
                    </Modal.Footer.PrimaryButton>
                </Modal.Footer>
                <Modal.Close aria-label={formatMessage(messages.closeLabel)} />
            </Modal.Content>
        </Modal>
    );
};

export default TaskModalV2;
