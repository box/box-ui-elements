// @flow
import * as React from 'react';

type Props = {
    title?: React.Node,
    children: React.Node,
    className: string,
};

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
