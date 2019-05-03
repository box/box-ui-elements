// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import BetaFeedbackBadge from '../../features/beta-feedback';
import AddTaskMenu from './AddTaskMenu';
import Modal from '../../components/modal/Modal';
import TaskForm from './activity-feed/task-form';
import messages from '../common/messages';
import { TASK_TYPE_APPROVAL, TASK_TYPE_GENERAL } from '../../constants';

type AddTaskButtonProps = {|
    feedbackUrl: string,
    isDisabled: boolean,
|};

// These are used by the wrapped form
type PassThroughProps = {|
    approverSelectorContacts: any,
    className?: string,
    createTask: any,
    getApproverWithQuery?: any,
    getAvatarUrl: any,
|};

type Props = {| ...AddTaskButtonProps, ...PassThroughProps |};

type State = {
    error: ?ElementsXhrError,
    isTaskFormOpen: boolean,
    taskType: TaskType,
};

class AddTaskButton extends React.Component<Props, State> {
    state = {
        error: null,
        isTaskFormOpen: false,
        taskType: TASK_TYPE_APPROVAL,
    };

    static defaultProps = {
        isDisabled: false,
    };

    getMessageForModalTitle(taskType: TaskType): Object {
        switch (taskType) {
            case TASK_TYPE_GENERAL:
                return messages.tasksCreateGeneralTaskFormTitle;
            case TASK_TYPE_APPROVAL:
            default:
                return messages.tasksCreateApprovalTaskFormTitle;
        }
    }

    handleClickMenuItem = (taskType: TaskType) => this.setState({ isTaskFormOpen: true, taskType });

    handleModalClose = () => this.setState({ isTaskFormOpen: false, error: null });

    handleCreateSuccess = () => this.setState({ isTaskFormOpen: false, error: null });

    handleCreateError = (e: ElementsXhrError) => this.setState({ error: e });

    render() {
        const { isDisabled, feedbackUrl, ...passThrough } = this.props;
        const { isTaskFormOpen, taskType, error } = this.state;

        // CSS selector for first form element
        // Note: Modal throws an error if this fails to find an element!
        const focusTargetSelector = '.task-modal input';
        return (
            <React.Fragment>
                <AddTaskMenu isDisabled={isDisabled} onMenuItemClick={this.handleClickMenuItem} />
                <Modal
                    className="be-modal task-modal"
                    data-testid="create-task-modal"
                    focusElementSelector={focusTargetSelector}
                    isOpen={isTaskFormOpen}
                    onRequestClose={this.handleModalClose}
                    title={
                        <React.Fragment>
                            <FormattedMessage {...this.getMessageForModalTitle(taskType)} />
                            <BetaFeedbackBadge tooltip formUrl={feedbackUrl} />
                        </React.Fragment>
                    }
                >
                    <div className="be">
                        <TaskForm
                            {...passThrough}
                            error={error}
                            onCancel={this.handleModalClose}
                            onCreateSuccess={this.handleCreateSuccess}
                            onCreateError={this.handleCreateError}
                            taskType={taskType}
                        />
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}

export default AddTaskButton;
