// @flow
import * as React from 'react';

import SkeletonItemList from '../components/SkeletonItemList';

type Props = {
    numberOfRows?: number,
};

const SkeletonItemListExample = ({ numberOfRows }: Props) => <SkeletonItemList numberOfRows={numberOfRows} />;

export default SkeletonItemListExample;
