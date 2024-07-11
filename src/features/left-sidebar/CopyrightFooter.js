/* @flow */
import * as React from 'react';

import LinkBase from '../../components/link/LinkBase';

import './styles/CopyrightFooter.scss';

type Props = {
    date?: Date,
    linkProps?: Object,
};

const CopyrightLink = (props: Props) => {
    const { linkProps = {}, date = new Date() } = props;
    return (
        <div className="copyright-footer">
            <small className="copyright">
                <LinkBase href="/about-us" {...linkProps}>
                    © {date.getFullYear()} Box Inc.
                </LinkBase>
            </small>
        </div>
    );
};

export default CopyrightLink;
