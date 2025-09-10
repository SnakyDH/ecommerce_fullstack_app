import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import TransactionFormScreen from './TransactionFormScreen';
import { TransactionFormData } from '@/types/transaction';

export default function TransactionPage() {
  const { transactionId } = useLocalSearchParams<{ transactionId: string }>();

  const handleSubmit = (data: TransactionFormData) => {
    // Here you would typically send the data to your API with the transaction ID
    console.log('Transaction form submitted:', data, 'for transaction ID:', transactionId);

    Alert.alert(
      'Form Submitted',
      `Transaction form completed for ${data.delivery.customer}`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TransactionFormScreen
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        transactionId={transactionId ? parseInt(transactionId) : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
