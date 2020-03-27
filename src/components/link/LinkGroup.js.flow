// @flow
import * as React from 'react';

type Props = {
    children: React.Node,
    className: string,
    title?: React.Node,
};

// eslint-disable-next-line react/prefer-stateless-function
class LinkGroup extends React.Component<Props> {
    static defaultProps = {
        title: '',
        className: '',
    };

    render() {
        const { title, children, className } = this.props;

        return (
            <div className={`link-group ${className}`}>
                {title ? <div className="link-group-title">{title}</div> : null}
                <ul>{React.Children.map(children, (item, i) => (item ? <li key={i}>{item} </li> : null))}</ul>
            </div>
        );
    }
}

export default LinkGroup;
