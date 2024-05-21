import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { State, Store } from '@sambego/storybook-state';

import TimeInput from './TimeInput';
//
// export const required = () => {
//     const INITIAL_DATE = new Date(2018, 7, 9, 15, 35);
//     const componentStore = new Store({
//         initialDate: INITIAL_DATE,
//     });
//
//     return (
//         <State store={componentStore}>
//             {state => (
//                 <IntlProvider locale="en-US">
//                     <TimeInput initialDate={state.initialDate} />
//                 </IntlProvider>
//             )}
//         </State>
//     );
// };
//
// export const optional = () => {
//     const INITIAL_DATE = new Date(2018, 7, 9, 15, 35);
//     const componentStore = new Store({
//         initialDate: INITIAL_DATE,
//     });
//
//     return (
//         <State store={componentStore}>
//             {state => (
//                 <IntlProvider locale="en-US">
//                     <TimeInput initialDate={state.initialDate} isRequired={false} />
//                 </IntlProvider>
//             )}
//         </State>
//     );
// };

export default {
    title: 'Components/TimeInput',
    component: TimeInput,
};
