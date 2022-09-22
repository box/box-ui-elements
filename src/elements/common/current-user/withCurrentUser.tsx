import React from 'react';
// @ts-ignore: no ts definition
import messages from '../messages';
// @ts-ignore: no ts definition
import { withAPIContext } from '../api-context';
// @ts-ignore: no ts definition
import { getBadItemError } from '../../../utils/error';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { ElementsXhrError, ErrorContextProps } from '../../../common/types/api';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { Errors } from '../flowTypes';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { User } from '../../../common/types/core';

export type WithCurrentUserProps = {
    currentUser?: User;
    currentUserError?: Errors;
} & ErrorContextProps;

export type ComponentWithCurrentUser = {
    errorCallback: (error: ElementsXhrError, code: string, contextInfo: Object) => void;
    fetchCurrentUser: (user?: User, shouldDestroy?: boolean) => void;
    fetchCurrentUserErrorCallback: (e: ElementsXhrError, code: string) => Errors;
    fetchCurrentUserSuccessCallback: (currentUser: User) => void;
};

export type CurrentUserState = {
    currentUser?: User;
    currentUserError?: Errors;
};

export type WithCurrentUserComponent<P> = React.ComponentClass<P & WithCurrentUserProps>;

export default function withCurrentUser<P extends object>(
    WrappedComponent: React.ComponentType<P & WithCurrentUserProps>,
): WithCurrentUserComponent<P> {
    class ComponentWithCurrentUser extends React.Component<P & WithCurrentUserProps, CurrentUserState> {
        static displayName: string;

        constructor(props: P & WithCurrentUserProps) {
            super(props);
            const { currentUser } = props;
            this.state = { currentUser };
        }

        componentDidMount() {
            const { currentUser } = this.state;
            this.fetchCurrentUser(currentUser);
        }

        /**
         * Network error callback
         *
         * @private
         * @param {Error} error - Error object
         * @param {Error} code - the code for the error
         * @param {Object} contextInfo - the context info for the error
         * @return {void}
         */
        errorCallback = (error: ElementsXhrError, code: string, contextInfo: Object = {}): void => {
            // eslint-disable-next-line no-console
            console.error(error);
            this.props.onError(error, code, contextInfo);
        };

        /**
         * Fetches a Users info
         *
         * @private
         * @param {User} [user] - Box User. If missing, gets user that the current token was generated for.
         * @param {boolean} shouldDestroy
         * @return {void}
         */
        fetchCurrentUser = (user?: User, shouldDestroy = false): void => {
            const { api, file } = this.props;

            if (!file) {
                throw getBadItemError();
            }

            if (typeof user === 'undefined') {
                api.getUsersAPI(shouldDestroy).getUser(
                    file.id,
                    this.fetchCurrentUserSuccessCallback,
                    this.fetchCurrentUserErrorCallback,
                );
            } else {
                this.setState({ currentUser: user, currentUserError: undefined });
            }
        };

        /**
         * User fetch success callback
         *
         * @private
         * @param {Object} currentUser - User info object
         * @return {void}
         */
        fetchCurrentUserSuccessCallback = (currentUser: User): void => {
            this.setState({ currentUser, currentUserError: undefined });
        };

        /**
         * Handles a failed file user info fetch
         *
         * @private
         * @param {ElementsXhrError} e - API error
         * @return {void}
         */
        fetchCurrentUserErrorCallback = (e: ElementsXhrError, code: string) => {
            this.setState({
                currentUser: undefined,
                currentUserError: {
                    maskError: {
                        errorHeader: messages.currentUserErrorHeaderMessage,
                        errorSubHeader: messages.defaultErrorMaskSubHeaderMessage,
                    },
                },
            });

            this.errorCallback(e, code, {
                error: e,
            });
        };

        render() {
            const { currentUser, currentUserError } = this.state;
            return <WrappedComponent {...this.props} currentUser={currentUser} currentUserError={currentUserError} />;
        }
    }

    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    ComponentWithCurrentUser.displayName = `WithCurrentUser(${displayName})`;

    return withAPIContext(ComponentWithCurrentUser);
}
