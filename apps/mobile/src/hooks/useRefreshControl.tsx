import { useCallback, useState } from 'react';
import { RefreshControl } from 'react-native-gesture-handler';

export const useRefreshControl = (refresh: () => Promise<void>) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefreshing = useCallback(async () => {
    setRefreshing(true);
    await refresh().finally(() => {
      setRefreshing(false);
    });
  }, [refresh]);

  return (
    <RefreshControl
      key={undefined}
      onRefresh={handleRefreshing}
      refreshing={refreshing}
    />
  );
};
