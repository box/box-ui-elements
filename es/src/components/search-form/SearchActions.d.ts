import * as React from 'react';
import { IntlShape } from 'react-intl';
export interface SearchActionsProps {
    /** Whether to render an interactive search button */
    hasSubmitAction: boolean;
    /** Intl object */
    intl: IntlShape;
    /** Called when clear button is clicked */
    onClear: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}
declare const SearchActions: ({ hasSubmitAction, intl, onClear }: SearchActionsProps) => React.JSX.Element;
export { SearchActions as SearchActionsBase };
declare const _default: React.FC<Omit<SearchActionsProps, "intl"> & {
    forwardedRef?: React.Ref<any>;
} & import("../loading-indicator/makeLoadable").MakeLoadableProps>;
export default _default;
