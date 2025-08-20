import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
  disabled?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  maxQuantity,
  onQuantityChange,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const canDecrease = quantity > 1 && !disabled;
  const canIncrease = quantity < maxQuantity && !disabled;

  const handleDecrease = () => {
    if (canDecrease) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (canIncrease) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("product.quantity")}</Text>
      <View style={styles.selectorContainer}>
        <Pressable
          style={[
            styles.button,
            styles.decreaseButton,
            !canDecrease && styles.disabledButton,
          ]}
          onPress={handleDecrease}
          disabled={!canDecrease}
          testID="decrease-quantity"
        >
          <Ionicons
            name="remove"
            size={20}
            color={canDecrease ? Colors.primary : '#ccc'}
          />
        </Pressable>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityText}>{quantity}</Text>
        </View>

        <Pressable
          style={[
            styles.button,
            styles.increaseButton,
            !canIncrease && styles.disabledButton,
          ]}
          onPress={handleIncrease}
          disabled={!canIncrease}
          testID="increase-quantity"
        >
          <Ionicons
            name="add"
            size={20}
            color={canIncrease ? Colors.primary : '#ccc'}
          />
        </Pressable>
      </View>

      <Text style={styles.stockInfo}>
        {maxQuantity > 0 ? `${maxQuantity} ${t("product.available")}` : t("product.outOfStock")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  decreaseButton: {
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  increaseButton: {
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  disabledButton: {
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  quantityContainer: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.text + '30',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  stockInfo: {
    fontSize: 12,
    color: Colors.text,
    opacity: 0.7,
    textAlign: 'center',
  },
});
