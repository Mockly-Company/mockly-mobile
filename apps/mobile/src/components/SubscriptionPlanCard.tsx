import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@mockly/design-system';
import { SubscriptionPlan, BillingCycle } from '@mockly/entities';

export interface PlanOption {
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  price: number;
  currency: string;
  features: string[];
}

export interface SubscriptionPlanCardProps {
  option: PlanOption;
  selected?: boolean;
  onSelect?: (option: PlanOption) => void;
}

const getPlanLabel = (plan: SubscriptionPlan): string => {
  switch (plan) {
    case SubscriptionPlan.FREE:
      return 'Free';
    case SubscriptionPlan.BASIC:
      return 'Basic';
    case SubscriptionPlan.PREMIUM:
      return 'Premium';
    case SubscriptionPlan.ENTERPRISE:
      return 'Enterprise';
    default:
      return plan;
  }
};

const getCycleLabel = (cycle: BillingCycle): string => {
  switch (cycle) {
    case BillingCycle.MONTHLY:
      return 'Monthly';
    case BillingCycle.QUARTERLY:
      return 'Quarterly';
    case BillingCycle.YEARLY:
      return 'Yearly';
    default:
      return cycle;
  }
};

export const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  option,
  selected = false,
  onSelect,
}) => {
  const planLabel = getPlanLabel(option.plan);
  const cycleLabel = getCycleLabel(option.billingCycle);
  const formattedPrice = `${option.currency} ${option.price.toLocaleString()}`;

  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selectedContainer]}
      onPress={() => onSelect?.(option)}
      activeOpacity={0.7}
    >
      {selected && <View style={styles.selectedIndicator} />}
      <View style={styles.header}>
        <Text variant="h3" style={styles.planName}>
          {planLabel}
        </Text>
        <View style={styles.priceContainer}>
          <Text variant="h2" style={styles.price}>
            {formattedPrice}
          </Text>
          <Text variant="caption" style={styles.cycle}>
            /{cycleLabel}
          </Text>
        </View>
      </View>
      <View style={styles.features}>
        {option.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text variant="body" style={styles.featureText}>
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedContainer: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
  },
  header: {
    marginBottom: 20,
  },
  planName: {
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    color: '#007AFF',
  },
  cycle: {
    marginLeft: 4,
    color: '#666',
  },
  features: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkmark: {
    color: '#4CAF50',
    fontSize: 18,
    marginRight: 8,
    fontWeight: 'bold',
  },
  featureText: {
    flex: 1,
  },
});
