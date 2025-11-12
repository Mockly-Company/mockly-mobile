import React, { useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text, Button } from '@mockly/design-system';
import { Payment, PaymentStatus } from '@mockly/entities';
import { PaymentService, ApiClient } from '@mockly/api';
import { useApi } from '../hooks/useApi';
import { PaymentCard } from '../components/PaymentCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

// TODO: Replace with actual API configuration
const apiClient = new ApiClient({ baseURL: 'https://api.mockly.example.com' });
const paymentService = new PaymentService(apiClient);

export interface PaymentHistoryScreenProps {
  onPaymentPress?: (payment: Payment) => void;
}

export const PaymentHistoryScreen: React.FC<PaymentHistoryScreenProps> = ({
  onPaymentPress,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | undefined>(
    undefined,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, error, refetch } = useApi(
    () =>
      paymentService.getPaymentHistory({
        page: currentPage,
        pageSize: 20,
        status: statusFilter,
      }),
    {
      autoFetch: true,
    },
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await refetch();
    setRefreshing(false);
  };

  const handlePaymentPress = (payment: Payment) => {
    onPaymentPress?.(payment);
  };

  const handleFilterChange = (status: PaymentStatus | undefined) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    if (data && currentPage * data.pageSize < data.total) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (loading && !data) {
    return <LoadingState message="Loading payment history..." />;
  }

  if (error && !data) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  const payments = data?.payments || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h2" style={styles.title}>
          Payment History
        </Text>
        {data && (
          <Text variant="caption" style={styles.subtitle}>
            {data.total} payments
          </Text>
        )}
      </View>

      <View style={styles.filterContainer}>
        <Text variant="caption" style={styles.filterLabel}>
          Filter by status:
        </Text>
        <View style={styles.filterButtons}>
          <Button
            variant={statusFilter === undefined ? 'primary' : 'outline'}
            size="small"
            onPress={() => handleFilterChange(undefined)}
            style={styles.filterButton}
          >
            All
          </Button>
          <Button
            variant={
              statusFilter === PaymentStatus.COMPLETED ? 'primary' : 'outline'
            }
            size="small"
            onPress={() => handleFilterChange(PaymentStatus.COMPLETED)}
            style={styles.filterButton}
          >
            Completed
          </Button>
          <Button
            variant={
              statusFilter === PaymentStatus.PENDING ? 'primary' : 'outline'
            }
            size="small"
            onPress={() => handleFilterChange(PaymentStatus.PENDING)}
            style={styles.filterButton}
          >
            Pending
          </Button>
        </View>
      </View>

      <FlatList
        data={payments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <PaymentCard payment={item} onPress={handlePaymentPress} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="body" style={styles.emptyText}>
              No payment history available
            </Text>
          </View>
        }
        ListFooterComponent={
          loading ? (
            <View style={styles.footer}>
              <Text variant="caption">Loading more...</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterLabel: {
    marginBottom: 8,
    color: '#666',
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#999',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
