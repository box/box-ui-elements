import { defineMessages } from 'react-intl';

const messages = defineMessages({
    navigation: {
        defaultMessage: '{currentStepIndex} of {totalNumSteps}',
        description: 'Displays the navigation step index to the user of where they are in the guide. e.g. 1 of 4',
        id: 'boxui.core.producttourtooltip.navigation',
    },
});

export default messages;
