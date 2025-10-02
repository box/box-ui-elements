import * as React from 'react';
import './HeaderWithCount.scss';
interface Props {
    title: string;
    totalCount?: number;
}
declare function HeaderWithCount({ title, totalCount }: Props): React.JSX.Element;
export default HeaderWithCount;
