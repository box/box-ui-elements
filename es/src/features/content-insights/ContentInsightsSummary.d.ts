import * as React from 'react';
import { GraphData, ResponseError } from './types';
import './ContentInsightsSummary.scss';
interface Props {
    graphData: GraphData;
    error?: ResponseError;
    isLoading: boolean;
    onClick: () => void;
    previousPeriodCount: number;
    totalCount: number;
}
declare const ContentInsightsSummary: ({ error, graphData, isLoading, previousPeriodCount, onClick, totalCount }: Props) => React.JSX.Element;
export default ContentInsightsSummary;
