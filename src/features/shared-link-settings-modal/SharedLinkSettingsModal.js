import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Button from 'components/button';
import PrimaryButton from 'components/primary-button';
import { Modal, ModalActions } from 'components/modal';
import InlineNotice from 'components/inline-notice';
import commonMessages from '../../common/messages';

import VanityNameSection from './VanityNameSection';
import PasswordSection from './PasswordSection';
import ExpirationSection from './ExpirationSection';
import AllowDownloadSection from './AllowDownloadSection';
import messages from './messages';

import './SharedLinkSettingsModal.scss';

class SharedLinkSettingsModal extends Component {
    static propTypes = {
        isOpen: PropTypes.bool,
        onRequestClose: PropTypes.func,
        submitting: PropTypes.bool,
        /** Function called on form submission. Format is:
         * ({
         *      expirationTimestamp: number (in milliseconds),
         *      isDownloadEnabled: true,
         *      isExpirationEnabled: true,
         *      isPasswordEnabled: true,
         *      password: string,
         *      vanityName: string,
         * }) => void
         */
        onSubmit: PropTypes.func.isRequired,

        // Custom URL props
        /** Whether or not user has permission to change/set vanity URL for this item */
        canChangeVanityName: PropTypes.bool.isRequired,
        /** Current vanity name for the item */
        vanityName: PropTypes.string.isRequired,
        /** Server URL prefix for vanity URL preview; should be something like http://company.box.com/v/ */
        serverURL: PropTypes.string.isRequired,
        vanityNameError: PropTypes.string,

        // Password props
        /** Whether or not user has permission to enable/disable/change password */
        canChangePassword: PropTypes.bool.isRequired,
        /** Whether or not the password section is visible to user */
        isPasswordAvailable: PropTypes.bool.isRequired,
        /** Whether or not password is currently enabled */
        isPasswordEnabled: PropTypes.bool.isRequired,
        passwordError: PropTypes.string,

        // Expiration props
        /** Whether or not user has permission to enable/disable/change expiration */
        canChangeExpiration: PropTypes.bool.isRequired,
        /** Current expiration timestamp, in milliseconds */
        expirationTimestamp: PropTypes.number,
        expirationError: PropTypes.string,

        // Allow download props
        /** Whether or not the download section is visible to user */
        isDownloadAvailable: PropTypes.bool.isRequired,
        /** Whether or not user has permission to enable/disable download */
        canChangeDownload: PropTypes.bool.isRequired,
        /** Whether or not download is currently enabled */
        isDownloadEnabled: PropTypes.bool.isRequired,

        // Direct link props
        /** URL for direct link */
        directLink: PropTypes.string.isRequired,
        /** Whether or not direct link is available */
        isDirectLinkAvailable: PropTypes.bool.isRequired,
        /** Whether or not direct link is unavailable only due to download setting */
        isDirectLinkUnavailableDueToDownloadSettings: PropTypes.bool.isRequired,

        // Hooks for resin
        cancelButtonProps: PropTypes.object,
        directLinkInputProps: PropTypes.object,
        downloadCheckboxProps: PropTypes.object,
        expirationCheckboxProps: PropTypes.object,
        expirationInputProps: PropTypes.object,
        modalProps: PropTypes.object,
        passwordCheckboxProps: PropTypes.object,
        passwordInputProps: PropTypes.object,
        saveButtonProps: PropTypes.object,
        vanityNameInputProps: PropTypes.object,
    };

    static defaultProps = {
        cancelButtonProps: {},
        modalProps: {},
        saveButtonProps: {},
    };

    constructor(props) {
        super(props);

        this.state = {
            expirationDate: props.expirationTimestamp ? new Date(props.expirationTimestamp) : null,
            expirationError: props.expirationError,
            isDownloadEnabled: props.isDownloadEnabled,
            isExpirationEnabled: !!props.expirationTimestamp,
            isPasswordEnabled: props.isPasswordEnabled,
            password: '',
            passwordError: props.passwordError,
            vanityName: props.vanityName,
            vanityNameError: props.vanityNameError,
        };
    }

    componentWillReceiveProps(nextProps) {
        const { expirationError, passwordError, vanityNameError } = nextProps;

        if (
            this.props.expirationError !== expirationError ||
            this.props.passwordError !== passwordError ||
            this.props.vanityNameError !== vanityNameError
        ) {
            this.setState({
                expirationError,
                passwordError,
                vanityNameError,
            });
        }
    }

    onSubmit = event => {
        event.preventDefault();

        const {
            expirationDate,
            isDownloadEnabled,
            isExpirationEnabled,
            isPasswordEnabled,
            password,
            vanityName,
        } = this.state;

        this.props.onSubmit({
            expirationTimestamp: expirationDate ? expirationDate.getTime() : undefined,
            isDownloadEnabled,
            isExpirationEnabled,
            isPasswordEnabled,
            password,
            vanityName,
        });
    };

    onVanityNameChange = event => {
        this.setState({
            vanityName: event.target.value,
            vanityNameError: undefined,
        });
    };

    onPasswordChange = event => {
        this.setState({
            password: event.target.value,
            passwordError: undefined,
        });
    };

    onPasswordCheckboxChange = event => {
        this.setState({ isPasswordEnabled: event.target.checked });
    };

    onExpirationDateChange = date => {
        this.setState({ expirationDate: date, expirationError: undefined });
    };

    onExpirationCheckboxChange = event => {
        this.setState({ isExpirationEnabled: event.target.checked });
    };

    onAllowDownloadChange = event => {
        this.setState({ isDownloadEnabled: event.target.checked });
    };

    renderVanityNameSection() {
        const { canChangeVanityName, serverURL, vanityNameInputProps } = this.props;
        const { vanityNameError } = this.state;

        return (
            <VanityNameSection
                canChangeVanityName={canChangeVanityName}
                error={vanityNameError}
                onChange={this.onVanityNameChange}
                serverURL={serverURL}
                vanityName={this.state.vanityName}
                vanityNameInputProps={vanityNameInputProps}
            />
        );
    }

    renderPasswordSection() {
        const { canChangePassword, isPasswordAvailable, passwordCheckboxProps, passwordInputProps } = this.props;
        const { isPasswordEnabled, password, passwordError } = this.state;

        return (
            <PasswordSection
                canChangePassword={canChangePassword}
                error={passwordError}
                isPasswordAvailable={isPasswordAvailable}
                isPasswordEnabled={isPasswordEnabled}
                isPasswordInitiallyEnabled={this.props.isPasswordEnabled}
                onPasswordChange={this.onPasswordChange}
                onCheckboxChange={this.onPasswordCheckboxChange}
                password={password}
                passwordCheckboxProps={passwordCheckboxProps}
                passwordInputProps={passwordInputProps}
            />
        );
    }

    renderExpirationSection() {
        const { canChangeExpiration, expirationCheckboxProps, expirationInputProps } = this.props;
        const { expirationDate, isExpirationEnabled, expirationError } = this.state;

        return (
            <ExpirationSection
                canChangeExpiration={canChangeExpiration}
                error={expirationError}
                expirationCheckboxProps={expirationCheckboxProps}
                expirationDate={expirationDate}
                expirationInputProps={expirationInputProps}
                isExpirationEnabled={isExpirationEnabled}
                onCheckboxChange={this.onExpirationCheckboxChange}
                onExpirationDateChange={this.onExpirationDateChange}
            />
        );
    }

    renderAllowDownloadSection() {
        const {
            canChangeDownload,
            directLink,
            directLinkInputProps,
            downloadCheckboxProps,
            isDirectLinkAvailable,
            isDirectLinkUnavailableDueToDownloadSettings,
            isDownloadAvailable,
        } = this.props;
        const { isDownloadEnabled } = this.state;

        return (
            <AllowDownloadSection
                isDownloadAvailable={isDownloadAvailable}
                isDownloadEnabled={isDownloadEnabled}
                canChangeDownload={canChangeDownload}
                directLink={directLink}
                directLinkInputProps={directLinkInputProps}
                downloadCheckboxProps={downloadCheckboxProps}
                isDirectLinkAvailable={isDirectLinkAvailable}
                isDirectLinkUnavailableDueToDownloadSettings={isDirectLinkUnavailableDueToDownloadSettings}
                onChange={this.onAllowDownloadChange}
            />
        );
    }

    render() {
        const {
            canChangeDownload,
            canChangeExpiration,
            canChangePassword,
            canChangeVanityName,
            cancelButtonProps,
            isOpen,
            modalProps,
            onRequestClose,
            saveButtonProps,
            submitting,
        } = this.props;

        const showInaccessibleSettingsNotice = !(
            canChangeDownload &&
            canChangeExpiration &&
            canChangePassword &&
            canChangeVanityName
        );

        const disableSaveBtn = !(canChangeDownload || canChangeExpiration || canChangePassword || canChangeVanityName);

        return (
            <Modal
                className="shared-link-settings-modal"
                isOpen={isOpen}
                onRequestClose={submitting ? undefined : onRequestClose}
                title={<FormattedMessage {...messages.modalTitle} />}
                {...modalProps}
            >
                <form onSubmit={this.onSubmit}>
                    {showInaccessibleSettingsNotice && (
                        <InlineNotice type="warning">
                            <FormattedMessage {...messages.inaccessibleSettingsNotice} />
                        </InlineNotice>
                    )}
                    {this.renderVanityNameSection()}
                    {this.renderPasswordSection()}
                    {this.renderExpirationSection()}
                    {this.renderAllowDownloadSection()}
                    <ModalActions>
                        <Button isDisabled={submitting} onClick={onRequestClose} type="button" {...cancelButtonProps}>
                            <FormattedMessage {...commonMessages.cancel} />
                        </Button>
                        <PrimaryButton
                            isDisabled={submitting || disableSaveBtn}
                            isLoading={submitting}
                            {...saveButtonProps}
                        >
                            <FormattedMessage {...commonMessages.save} />
                        </PrimaryButton>
                    </ModalActions>
                </form>
            </Modal>
        );
    }
}

export default SharedLinkSettingsModal;
