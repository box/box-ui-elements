// @flow
import { useContext } from 'react';
import type { EligibleMessageIDMap } from './types';
import MessageContext from './MessageContext';

const useSetEligibleMesageIDMap = (eligibleMessageIDMap: EligibleMessageIDMap): void => {
    const { setEligibleMessageIDMap } = useContext(MessageContext);
    setEligibleMessageIDMap(eligibleMessageIDMap);
};

export default useSetEligibleMesageIDMap;
