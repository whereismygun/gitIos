/**
 *
 *
 * @flow
 *
 */

'use strict';

import type { Action } from './types';

module.exports = {
  switchTab: (tab: string, tabProps: Object): Action => ({
    type: 'SWITCH_TAB',
    tab,
    tabProps,
  }),
  skipIntro: (): Action => ({
    type: 'SKIP_INTRO',
  }),
};
