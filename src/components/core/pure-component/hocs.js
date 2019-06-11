import * as React from 'react';

function pure(func) {
    class Pure extends React.PureComponent {
        render() {
            return func(this.props);
        }
    }

    Pure.displayName = func.name || 'Pure';

    return Pure;
}

export default pure;
