import * as React from 'react';

export interface LinkGroupProps {
    children: React.ReactNode;
    className: string;
    title?: React.ReactNode;
}

// eslint-disable-next-line react/prefer-stateless-function
class LinkGroup extends React.Component<LinkGroupProps> {
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
