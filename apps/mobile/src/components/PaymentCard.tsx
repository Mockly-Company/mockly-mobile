import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@mockly/design-system';
import { Payment, PaymentStatus } from '@mockly/entities';

export interface PaymentCardProps {
  payment: Payment;
  onPress?: (payment: Payment) => void;
}

const getStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case PaymentStatus.COMPLETED:
      return '#4CAF50';
    case PaymentStatus.PENDING:
      return '#FF9800';
    case PaymentStatus.FAILED:
      return '#F44336';
    case PaymentStatus.CANCELLED:
      return '#9E9E9E';
    case PaymentStatus.REFUNDED:
      return '#2196F3';
    default:
      return '#666';
  }
};

const getStatusLabel = (status: PaymentStatus): string => {
  switch (status) {
    case PaymentStatus.COMPLETED:
      return 'Completed';
    case PaymentStatus.PENDING:
      return 'Pending';
    case PaymentStatus.FAILED:
      return 'Failed';
    case PaymentStatus.CANCELLED:
      return 'Cancelled';
    case PaymentStatus.REFUNDED:
      return 'Refunded';
    default:
      return status;
  }
};

export const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  onPress,
}) => {
  const formattedAmount = `${payment.currency} ${payment.amount.toLocaleString()}`;
  const formattedDate = new Date(payment.createdAt).toLocaleDateString();
  const statusColor = getStatusColor(payment.status);
  const statusLabel = getStatusLabel(payment.status);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(payment)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text variant="body" weight="bold" style={styles.amount}>
            {formattedAmount}
          </Text>
          <Text variant="caption" style={styles.date}>
            {formattedDate}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text variant="caption" style={styles.statusText}>
            {statusLabel}
          </Text>
        </View>
      </View>
      <View style={styles.details}>
        <Text variant="caption" style={styles.label}>
          Payment Method
        </Text>
        <Text variant="body">{payment.method.replace('_', ' ')}</Text>
      </View>
      {payment.transactionId && (
        <View style={styles.details}>
          <Text variant="caption" style={styles.label}>
            Transaction ID
          </Text>
          <Text
            variant="caption"
            style={styles.transactionId}
            numberOfLines={1}
          >
            {payment.transactionId}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leftSection: {
    flex: 1,
  },
  amount: {
    fontSize: 18,
    marginBottom: 4,
  },
  date: {
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
  },
  details: {
    marginBottom: 8,
  },
  label: {
    color: '#666',
    marginBottom: 2,
  },
  transactionId: {
    color: '#666',
    fontFamily: 'monospace',
  },
});
