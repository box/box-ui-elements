// @flow
import * as React from 'react';
import AnnotatorContext from './AnnotatorContext';

const withAnnotatorContext = (WrappedComponent: React.ComponentType<any>) =>
    React.forwardRef<Object, React.Ref<any>>((props: Object, ref: React.Ref<any>) => (
        <AnnotatorContext.Consumer>
            {({ isPending, operation, ...rest }) => (
                <WrappedComponent
                    ref={ref}
                    {...props}
                    annotationOperation={operation}
                    annotationIsPending={isPending}
                    {...rest}
                />
            )}
        </AnnotatorContext.Consumer>
    ));

export default withAnnotatorContext;
