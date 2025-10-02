import { GraphData, ResponseError } from '../../features/content-insights/types';
import './SidebarContentInsights.scss';
export interface ContentInsights {
    error?: ResponseError;
    graphData: GraphData;
    isLoading: boolean;
    previousPeriodCount: number;
    totalCount: number;
}
export interface Props {
    contentInsights?: ContentInsights;
    onContentInsightsClick?: () => void;
}
declare const _default: any;
export default _default;
