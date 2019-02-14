// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../components/button';
import Modal from '../../components/modal/Modal';
import TaskForm from './activity-feed/task-form';
import messages from '../common/messages';

type AddTaskButtonProps = {|
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
    isTaskFormOpen: boolean,
};

class AddTaskButton extends React.Component<Props, State> {
    state = {
        isTaskFormOpen: false,
    };

    static defaultProps = {
        isDisabled: false,
    };

    handleClickAdd = () => this.setState({ isTaskFormOpen: true });

    handleClose = () => this.setState({ isTaskFormOpen: false });

    handleSubmit = () => this.setState({ isTaskFormOpen: false });

    render() {
        const { isDisabled, ...passThrough } = this.props;
        const { isTaskFormOpen } = this.state;

        return (
            <React.Fragment>
                <Button isDisabled={isDisabled} onClick={this.handleClickAdd} type="button">
                    <FormattedMessage {...messages.tasksAddTask} />
                </Button>
                <Modal
                    className="be task-modal"
                    data-testid="create-task-modal"
                    isOpen={isTaskFormOpen}
                    onRequestClose={this.handleClose}
                    title={<FormattedMessage {...messages.tasksAddTaskFormTitle} />}
                >
                    <TaskForm {...passThrough} onCancel={this.handleClose} onSubmit={this.handleSubmit} />
                </Modal>
            </React.Fragment>
        );
    }
}

export default AddTaskButton;
