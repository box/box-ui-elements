// Need to import and re-export the type to be shared in another component.
// https://github.com/babel/babel-loader/issues/603#issuecomment-418472968
import { TooltipProps as Props } from './Tooltip';

export { default, TooltipPosition, TooltipTheme } from './Tooltip';
export type TooltipProps = Props;
