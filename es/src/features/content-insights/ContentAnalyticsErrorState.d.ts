import * as React from 'react';
import { ResponseError } from './types';
import './ContentAnalyticsErrorState.scss';
interface Props {
    error?: ResponseError;
}
declare const ContentAnalyticsErrorState: ({ error }: Props) => React.JSX.Element;
export default ContentAnalyticsErrorState;
