// @ts-nocheck
import * as R from 'ramda';
import DealwayLoading from './DealwayLoading';
import withDashboard from '@/containers/Dashboard/withDashboard';

function SplashScreenComponent({ splashScreenLoading }) {
  return splashScreenLoading ? <DealwayLoading /> : null;
}

export const SplashScreen = R.compose(
  withDashboard(({ splashScreenLoading }) => ({
    splashScreenLoading,
  })),
)(SplashScreenComponent);
