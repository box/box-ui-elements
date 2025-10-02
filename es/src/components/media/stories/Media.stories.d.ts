import * as React from 'react';
export declare const example: () => React.JSX.Element;
export declare const exampleExplanation: () => React.JSX.Element;
export declare const withNestedComponents: () => React.JSX.Element;
export declare const withFormElements: () => React.JSX.Element;
declare const _default: {
    title: string;
    component: {
        ({ as: Wrapper, children, className, ...rest }: import("../Media").MediaProps): React.JSX.Element;
        Body: ({ className, children, ...rest }: import("../MediaBody").MediaBodyProps) => React.JSX.Element;
        Menu: React.FC<import("react-intl").WithIntlProps<import("../MediaMenu").MediaMenuProps>> & {
            WrappedComponent: React.ComponentType<import("../MediaMenu").MediaMenuProps>;
        };
        Figure: ({ as: Wrapper, className, children, ...rest }: import("../MediaFigure").MediaFigureProps) => React.JSX.Element;
    };
    parameters: {
        notes: string;
    };
};
export default _default;
