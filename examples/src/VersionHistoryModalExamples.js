import React, { Component } from 'react';

import Button from 'components/button';
import VersionHistoryModal from 'features/version-history-modal';

let currentVersionNumber = 0; // Just for examples

const SECONDS_IN_DAY = 3600 * 24;

const generateVersionItem = (versionNumber, values = {}) => {
    return {
        canDownload: true,
        created: 961514440 + versionNumber * SECONDS_IN_DAY, // June 20, 2000 @ 6:20:40
        currentFromUserName: 'Some Random User',
        currentFromFileVersionID: null,
        currentFromVersionNumber: null,
        deleted: 0,
        deletedPermanentlyBy: 0,
        deleterUserName: 'Some Deleter User',
        extension: 'jpg',
        fileVersionID: 10000 + versionNumber,
        id: `111_${versionNumber}`,
        isCurrent: false,
        itemName: `Version ${versionNumber}`,
        itemTypedID: `file_111_${versionNumber}`,
        restored: 0,
        restorerUserName: 'Some Restorer User',
        updated: 961514440 + versionNumber * SECONDS_IN_DAY, // June 20, 2000 @ 6:20:40
        uploaderUserName: 'Some Uploader User',
        versionNumber,
        ...values,
    };
};

// Generate some versions
const initialVersions = [];
for (let i = 0; i < 30; i++) {
    initialVersions.unshift(generateVersionItem(++currentVersionNumber));
}

// Add indefinite retention case
initialVersions.unshift(
    generateVersionItem(++currentVersionNumber, {
        itemName: 'Some file retained indefinitely',
        isRetained: true,
        isIndefinitelyRetained: true,
    }),
);

// Add retained until case
initialVersions.unshift(
    generateVersionItem(++currentVersionNumber, {
        itemName: 'Some file retained until some time',
        isRetained: true,
        dispositionAction: 0, // Retention only
        dispositionDate: 971514440,
    }),
);

// Add retained and deleted on
initialVersions.unshift(
    generateVersionItem(++currentVersionNumber, {
        itemName: 'Some file retained and will be deleted',
        isRetained: true,
        dispositionAction: 1, // Delete after retention
        dispositionDate: 971514440,
    }),
);

// Add no download case
initialVersions.unshift(
    generateVersionItem(++currentVersionNumber, {
        itemName: 'Cannot download me!',
        canDownload: false,
    }),
);

// Version skips should be fine
currentVersionNumber += 9;

// Add message version to clarify version skips are ok
initialVersions.unshift(
    generateVersionItem(++currentVersionNumber, {
        itemName: 'Some versions before this one have been deleted',
    }),
);

// Add long user name case
initialVersions.unshift(
    generateVersionItem(++currentVersionNumber, {
        itemName: 'Long uploader name case',
        uploaderUserName:
            'Some super long name that will inevitable cause wrapping and test the bounds of responsiven ess, but why would we even need to support something this long anyway',
    }),
);

// Add long contiguous user name case
initialVersions.unshift(
    generateVersionItem(++currentVersionNumber, {
        itemName: 'Long contiguous name case',
        uploaderUserName:
            'Somesuperlongnamethatwillinevitablecausewrappingandtesttheboundsofresponsivenessbutomgwhyisthissolong',
    }),
);

// Add long file name case
initialVersions.unshift(
    generateVersionItem(++currentVersionNumber, {
        itemName:
            'Super long name that will cause wrapping, etc, but why would we even need to support something this long anyway',
    }),
);

// Add long contiguous name case
initialVersions.unshift(
    generateVersionItem(++currentVersionNumber, {
        itemName: 'Superlongcontiguousnamethatwillcausewrappingbutwhywouldweevenneedtosupportsomethingthislonganyway',
    }),
);

// Add restore case
initialVersions.unshift(generateVersionItem(++currentVersionNumber, { restored: 961514440 }));

// Add deleted case
initialVersions.unshift(generateVersionItem(++currentVersionNumber, { deleted: 961514440 }));

// Add permanently deleted case
initialVersions.unshift(
    generateVersionItem(++currentVersionNumber, {
        deleted: 961514440,
        deletedPermanentlyBy: 961614440,
    }),
);

// Add a normal upload case
initialVersions.unshift(generateVersionItem(++currentVersionNumber));

// Add current version case
initialVersions.unshift(generateVersionItem(++currentVersionNumber, { isCurrent: true }));

const updateVersionsAtIndex = (versions, index, values) => {
    const newVersions = versions.slice(0); // Copy old array to avoid modifying the original
    const newVersion = { ...versions[index], ...values };

    newVersions[index] = newVersion;

    return newVersions;
};

class VersionHistoryModalExamples extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            isProcessing: false,
            versions: initialVersions,
            scrollToVersionNumber: null,
        };
    }

    onDelete = ({ id, versionNumber }) => {
        const index = this.state.versions.findIndex(value => value.id === id);
        if (index >= 0) {
            console.log(`Removing version ${versionNumber}`);  // eslint-disable-line
            this.setState({
                isProcessing: true,
            });

            setTimeout(() => {
                this.setState({
                    isProcessing: false,
                    versions: updateVersionsAtIndex(this.state.versions, index, {
                        deleted: Math.round(Date.now() / 1000),
                        restored: 0,
                    }),
                });
            }, 500);
        }
    };

    onDownload = ({ versionNumber }) => {
        console.log(`Downloading version ${versionNumber}`); // eslint-disable-line
    };

    onMakeCurrent = ({ id, fileVersionID, versionNumber }) => {
        const index = this.state.versions.findIndex(value => value.id === id);
        if (index >= 0) {
            console.log(`Making version ${versionNumber} the current version (noop)`); // eslint-disable-line
            this.setState({
                isProcessing: true,
            });

            setTimeout(() => {
                const newVersions = updateVersionsAtIndex(this.state.versions, 0, {
                    isCurrent: false,
                });

                // Super simple version of making current
                newVersions.unshift(
                    generateVersionItem(++currentVersionNumber, {
                        itemName: `Restored file from V${versionNumber}`,
                        currentFromVersionNumber: versionNumber,
                        currentFromUserName: 'Some Noob',
                        currentFromFileVersionID: fileVersionID,
                        isCurrent: true,
                        updated: Math.round(Date.now() / 1000),
                    }),
                );

                this.setState({
                    isProcessing: false,
                    versions: newVersions,
                    scrollToVersionNumber: currentVersionNumber,
                });
            }, 500);
        }
    };

    onRestore = ({ id, versionNumber }) => {
        const index = this.state.versions.findIndex(value => value.id === id);
        if (index >= 0) {
            console.log(`Restoring version ${versionNumber}`); // eslint-disable-line
            this.setState({
                isProcessing: true,
            });

            setTimeout(() => {
                this.setState({
                    isProcessing: false,
                    versions: updateVersionsAtIndex(this.state.versions, index, {
                        deleted: 0,
                        deletedPermanentlyBy: 0,
                        restored: Math.round(Date.now() / 1000),
                    }),
                });
            }, 500);
        }
    };

    openModal = () => {
        this.setState({
            isOpen: true,
        });
    };

    openModalAndscrollToVersionNumber = () => {
        this.setState({
            isOpen: true,
            scrollToVersionNumber: 10,
        });
    };

    closeModal = () => {
        this.setState({
            isOpen: false,
            scrollToVersionNumber: null,
        });
    };

    render() {
        const { isOpen, isProcessing, scrollToVersionNumber, versions } = this.state;

        return (
            <div>
                {isOpen && (
                    <VersionHistoryModal
                        isOpen={isOpen}
                        isProcessing={isProcessing}
                        isDownloadAllowed
                        onDelete={this.onDelete}
                        onDownload={this.onDownload}
                        onMakeCurrent={this.onMakeCurrent}
                        onRestore={this.onRestore}
                        onRequestClose={this.closeModal}
                        scrollToVersionNumber={scrollToVersionNumber}
                        versions={versions}
                        versionLimit={10}
                    />
                )}
                <Button onClick={this.openModal}>Open Version History Modal</Button>
                <Button onClick={this.openModalAndscrollToVersionNumber}>Jump to Version 10</Button>
            </div>
        );
    }
}

export default VersionHistoryModalExamples;
