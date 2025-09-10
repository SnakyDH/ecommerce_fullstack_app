import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TransactionFormData, CardType } from '@/types/transaction';
import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';

interface TransactionFormScreenProps {
  onSubmit?: (data: TransactionFormData) => void;
  onCancel?: () => void;
  transactionId?: number;
}

export default function TransactionFormScreen({
  onSubmit,
  onCancel,
  transactionId
}: TransactionFormScreenProps) {
  const { t } = useTranslation();
  const [cardType, setCardType] = useState<CardType>(CardType.UNKNOWN);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<TransactionFormData>({
    defaultValues: {
      delivery: {
        customer: '',
        customerEmail: '',
        address: '',
        country: '',
        region: '',
        city: '',
        postalCode: '',
        phone: '',
      },
      creditCard: {
        number: '',
        cvv: '',
        expirationMonth: '',
        expirationYear: '',
        holderName: '',
      },
    },
    mode: 'onChange',
  });

  const watchCardNumber = watch('creditCard.number');

  // Credit Card Type Detection
  const detectCardType = (cardNumber: string): CardType => {
    const cleanNumber = cardNumber.replace(/\s+/g, '');

    if (/^4/.test(cleanNumber)) {
      return CardType.VISA;
    }
    if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
      return CardType.MASTERCARD;
    }
    if (/^3[47]/.test(cleanNumber)) {
      return CardType.AMEX;
    }
    if (/^6(?:011|5)/.test(cleanNumber)) {
      return CardType.DISCOVER;
    }

    return CardType.UNKNOWN;
  };

  // Format credit card number with spaces
  const formatCardNumber = (value: string): string => {
    const cleanValue = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleanValue.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return cleanValue;
    }
  };

  // Update card type when card number changes
  useEffect(() => {
    if (watchCardNumber) {
      const detectedType = detectCardType(watchCardNumber);
      setCardType(detectedType);
    }
  }, [watchCardNumber]);

  const getCardIcon = (type: CardType): string => {
    switch (type) {
      case CardType.VISA:
        return '💳 VISA';
      case CardType.MASTERCARD:
        return '💳 MASTERCARD';
      case CardType.AMEX:
        return '💳 AMEX';
      case CardType.DISCOVER:
        return '💳 DISCOVER';
      default:
        return '💳';
    }
  };

  const onFormSubmit = (data: TransactionFormData) => {
    if (onSubmit) {
      // Include the transaction ID in the console log for debugging
      console.log('Submitting form with transaction ID:', transactionId);
      onSubmit(data);
    } else {
      Alert.alert(t('transaction.success', 'Success'), t('transaction.transaction_form_submitted', 'Transaction form submitted successfully!'));
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Display transaction ID if available
  useEffect(() => {
    if (transactionId) {
      console.log('Transaction form loaded with transaction ID:', transactionId);
    }
  }, [transactionId]);

  return (
    <>
      <Stack.Screen options={{
        title: t('transaction.title', 'Transaction'),
        headerShown: true,
      }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{t('transaction.transaction_form_title', 'Transaction Form')}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('transaction.customer_information', 'Customer Information')}</Text>

            <Controller
              control={control}
              name="delivery.customer"
              rules={{ required: t('transaction.field_required', 'This field is required') }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>{t('transaction.full_name', 'Full Name')} *</Text>
                  <TextInput
                    style={[styles.input, errors.delivery?.customer && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder={t('transaction.enter_full_name', 'Enter your full name')}
                    autoCapitalize="words"
                  />
                  {errors.delivery?.customer && (
                    <Text style={styles.errorText}>{errors.delivery.customer.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="delivery.customerEmail"
              rules={{
                required: t('transaction.field_required', 'This field is required'),
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: t('transaction.invalid_email', 'Invalid email address'),
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>{t('transaction.email', 'Email')} *</Text>
                  <TextInput
                    style={[styles.input, errors.delivery?.customerEmail && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder={t('transaction.enter_email', 'Enter your email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {errors.delivery?.customerEmail && (
                    <Text style={styles.errorText}>{errors.delivery.customerEmail.message}</Text>
                  )}
                </View>
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('transaction.delivery_address', 'Delivery Address')}</Text>

            <Controller
              control={control}
              name="delivery.address"
              rules={{ required: t('transaction.field_required', 'This field is required') }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>{t('transaction.address', 'Address')} *</Text>
                  <TextInput
                    style={[styles.input, errors.delivery?.address && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder={t('transaction.enter_address', 'Enter your address')}
                    multiline
                  />
                  {errors.delivery?.address && (
                    <Text style={styles.errorText}>{errors.delivery.address.message}</Text>
                  )}
                </View>
              )}
            />

            <View style={styles.row}>
              <Controller
                control={control}
                name="delivery.city"
                rules={{ required: t('transaction.field_required', 'This field is required') }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>{t('transaction.city', 'City')} *</Text>
                    <TextInput
                      style={[styles.input, errors.delivery?.city && styles.inputError]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={t('transaction.enter_city', 'City')}
                    />
                    {errors.delivery?.city && (
                      <Text style={styles.errorText}>{errors.delivery.city.message}</Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="delivery.region"
                rules={{ required: t('transaction.field_required', 'This field is required') }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>{t('transaction.region', 'Region')} *</Text>
                    <TextInput
                      style={[styles.input, errors.delivery?.region && styles.inputError]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={t('transaction.enter_region', 'Region')}
                    />
                    {errors.delivery?.region && (
                      <Text style={styles.errorText}>{errors.delivery.region.message}</Text>
                    )}
                  </View>
                )}
              />
            </View>

            <View style={styles.row}>
              <Controller
                control={control}
                name="delivery.postalCode"
                rules={{ required: t('transaction.field_required', 'This field is required') }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>{t('transaction.postal_code', 'Postal Code')} *</Text>
                    <TextInput
                      style={[styles.input, errors.delivery?.postalCode && styles.inputError]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={t('transaction.enter_postal_code', 'Postal Code')}
                    />
                    {errors.delivery?.postalCode && (
                      <Text style={styles.errorText}>{errors.delivery.postalCode.message}</Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="delivery.country"
                rules={{ required: t('transaction.field_required', 'This field is required') }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>{t('transaction.country', 'Country')} *</Text>
                    <TextInput
                      style={[styles.input, errors.delivery?.country && styles.inputError]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={t('transaction.enter_country', 'Country')}
                    />
                    {errors.delivery?.country && (
                      <Text style={styles.errorText}>{errors.delivery.country.message}</Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>

          {/* Payment Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('transaction.payment_information', 'Payment Information')}</Text>

            <Controller
              control={control}
              name="creditCard.holderName"
              rules={{ required: t('transaction.field_required', 'This field is required') }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>{t('transaction.cardholder_name', 'Cardholder Name')} *</Text>
                  <TextInput
                    style={[styles.input, errors.creditCard?.holderName && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder={t('transaction.enter_cardholder_name', 'Name on card')}
                    autoCapitalize="words"
                  />
                  {errors.creditCard?.holderName && (
                    <Text style={styles.errorText}>{errors.creditCard.holderName.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="creditCard.number"
              rules={{
                required: t('transaction.field_required', 'This field is required'),
                minLength: {
                  value: 16,
                  message: t('transaction.invalid_card_number', 'Invalid card number'),
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    {t('transaction.card_number', 'Card Number')} *
                    {cardType !== CardType.UNKNOWN && (
                      <Text style={styles.cardType}> {getCardIcon(cardType)}</Text>
                    )}
                  </Text>
                  <TextInput
                    style={[styles.input, errors.creditCard?.number && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      const formatted = formatCardNumber(text);
                      onChange(formatted);
                    }}
                    value={value}
                    placeholder={t('transaction.enter_card_number', '1234 5678 9012 3456')}
                    keyboardType="numeric"
                    maxLength={19}
                  />
                  {errors.creditCard?.number && (
                    <Text style={styles.errorText}>{errors.creditCard.number.message}</Text>
                  )}
                </View>
              )}
            />

            <View style={styles.row}>
              <Controller
                control={control}
                name="creditCard.expirationMonth"
                rules={{ required: t('transaction.field_required', 'This field is required') }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, styles.thirdWidth]}>
                    <Text style={styles.label}>{t('transaction.month', 'Month')} *</Text>
                    <TextInput
                      style={[styles.input, errors.creditCard?.expirationMonth && styles.inputError]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="MM"
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    {errors.creditCard?.expirationMonth && (
                      <Text style={styles.errorText}>{errors.creditCard.expirationMonth.message}</Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="creditCard.expirationYear"
                rules={{ required: t('transaction.field_required', 'This field is required') }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, styles.thirdWidth]}>
                    <Text style={styles.label}>{t('transaction.year', 'Year')} *</Text>
                    <TextInput
                      style={[styles.input, errors.creditCard?.expirationYear && styles.inputError]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="YYYY"
                      keyboardType="numeric"
                      maxLength={4}
                    />
                    {errors.creditCard?.expirationYear && (
                      <Text style={styles.errorText}>{errors.creditCard.expirationYear.message}</Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="creditCard.cvv"
                rules={{
                  required: t('transaction.field_required', 'This field is required'),
                  minLength: {
                    value: 3,
                    message: t('transaction.invalid_cvv', 'Invalid CVV'),
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, styles.thirdWidth]}>
                    <Text style={styles.label}>{t('transaction.cvv', 'CVV')} *</Text>
                    <TextInput
                      style={[styles.input, errors.creditCard?.cvv && styles.inputError]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="123"
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                    />
                    {errors.creditCard?.cvv && (
                      <Text style={styles.errorText}>{errors.creditCard.cvv.message}</Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>{t('transaction.cancel', 'Cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton, !isValid && styles.disabledButton]}
              onPress={handleSubmit(onFormSubmit)}
              disabled={!isValid}
            >
              <Text style={styles.submitButtonText}>{t('transaction.submit', 'Submit')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    backgroundColor: Colors.cardHighlight,
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: Colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardHighlight,
    paddingBottom: 10,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.cardHighlight,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  thirdWidth: {
    width: '30%',
  },
  cardType: {
    color: '#007AFF',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
