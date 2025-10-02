import * as React from 'react';
import { WrappedComponentProps } from 'react-intl';
import type { GetProfileUrlCallback } from '../../../../common/flowTypes';
import type { FeatureConfig } from '../../../../common/feature-checking';
import './ActivityMessage.scss';
export interface ActivityMessageProps extends WrappedComponentProps {
    features: FeatureConfig;
    getUserProfileUrl?: GetProfileUrlCallback;
    id: string;
    isEdited?: boolean;
    onClick?: () => void;
    onTranslate?: ({ id, tagged_message }: {
        id: string;
        tagged_message: string;
    }) => void;
    tagged_message: string;
    translatedTaggedMessage?: string;
    translationEnabled?: boolean;
    translationFailed?: boolean | null;
    annotationsMillisecondTimestamp?: string | null;
}
type State = {
    isLoading?: boolean;
    isTranslation?: boolean;
};
declare class ActivityMessage extends React.Component<ActivityMessageProps, State> {
    static readonly defaultProps: {
        isEdited: boolean;
        translationEnabled: boolean;
    };
    state: {
        isLoading: boolean;
        isTranslation: boolean;
    };
    componentDidUpdate(prevProps: ActivityMessageProps): void;
    getButton(isTranslation?: boolean): React.ReactNode;
    handleTranslate: (event: React.MouseEvent) => void;
    handleShowOriginal: (event: React.MouseEvent) => void;
    render(): React.ReactNode;
}
export { ActivityMessage };
declare const _default: any;
export default _default;
