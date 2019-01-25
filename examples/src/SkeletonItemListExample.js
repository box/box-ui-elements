// @flow
import * as React from 'react';

import SkeletonItemList from '../../src/features/metadata-view/components/SkeletonItemList';

type Props = {
    numberOfRows?: number,
};

const SkeletonItemListExample = ({ numberOfRows }: Props) => <SkeletonItemList numberOfRows={numberOfRows} />;

export default SkeletonItemListExample;
