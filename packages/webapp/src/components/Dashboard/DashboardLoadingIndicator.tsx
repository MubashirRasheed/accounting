// @ts-nocheck
import React from 'react';
import { Choose } from '@/components';
import DealwayLoading from './DealwayLoading';

/**
 * Dashboard loading indicator.
 */
export default function DashboardLoadingIndicator({
  isLoading = false,
  className,
  children,
}) {
  return (
    <Choose>
      <Choose.When condition={isLoading}>
        <DealwayLoading />        
      </Choose.When>

      <Choose.Otherwise>
        { children }
      </Choose.Otherwise>
    </Choose>
  );
}
