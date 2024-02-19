// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { Icon } from '@/components';

import '@/style/components/DealwayLoading.scss';


export default function DealwayLoading({ className }) {
  return (
    <div className={classNames('dealway-loading', className)}>
      <div class="center">
        <Icon icon="dealway" height={37} width={228} />
      </div>
    </div>
  );
}
