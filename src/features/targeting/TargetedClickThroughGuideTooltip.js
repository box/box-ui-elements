// @flow
import * as React from 'react';
import { withTargetedClickThrough } from './hocs';

import GuideTooltip from '../../components/guide-tooltip';

export default withTargetedClickThrough<React.ElementConfig<typeof GuideTooltip>>(GuideTooltip);
