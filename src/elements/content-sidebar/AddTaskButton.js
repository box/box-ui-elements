// @flow
import * as React from 'react';
import Button from 'box-react-ui/lib/components/button';
import Modal from 'box-react-ui/lib/components/modal/Modal';
import { FormattedMessage } from 'react-intl';
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
                <Button type="button" onClick={this.handleClickAdd} isDisabled={isDisabled}>
                    <FormattedMessage {...messages.tasksAddTask} />
                </Button>
                <Modal
                    isOpen={isTaskFormOpen}
                    onRequestClose={this.handleClose}
                    title={<FormattedMessage {...messages.tasksAddTaskFormTitle} />}
                    className="be task-modal"
                    data-testid="create-task-modal"
                >
                    <TaskForm {...passThrough} onCancel={this.handleClose} onSubmit={this.handleSubmit} />
                </Modal>
            </React.Fragment>
        );
    }
}

export default AddTaskButton;
