import { useRouter } from 'next/router';

export const validTabs = ['patients', 'appointments'] as const;
export type TabType = (typeof validTabs)[number];

export function useActiveTab(): TabType {
  const router = useRouter();
  const path = router.pathname.split('/')[1];

  const isValidTab = (tab: string): tab is TabType => validTabs.includes(tab as TabType);

  return isValidTab(path) ? path : 'patients';
}
