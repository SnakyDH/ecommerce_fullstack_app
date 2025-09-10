import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useGetPresignedQuery } from '@/store/api/presignedApi';
import { useInitTransactionMutation } from '@/store/api/transactionApi';
import { Presigned, PresignedType } from '@/types/presigned';
import { useTranslation } from 'react-i18next';

interface RequestAcceptPresignedModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept: (transactionId: number, acceptedTerms: { [key: string]: boolean }) => void;
  productName: string;
  productPrice: number;
  quantity: number;
  productId: number;
}

export default function RequestAcceptPresignedModal({
  visible,
  onClose,
  onAccept,
  productName,
  productPrice,
  quantity,
  productId,
}: RequestAcceptPresignedModalProps) {
  const { t } = useTranslation();
  const { data: presignedData, isLoading, error } = useGetPresignedQuery();
  const [initTransaction, { isLoading: isInitializing }] = useInitTransactionMutation();
  const [acceptedTerms, setAcceptedTerms] = useState<{ [key: string]: boolean }>({});

  const handleCheckboxChange = (presigned: Presigned) => {
    setAcceptedTerms(prev => ({
      ...prev,
      [presigned.type]: !prev[presigned.type],
    }));
  };

  const handleOpenUrl = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(t('error.cannotOpenUrl'), t('error.urlNotSupported'));
      }
    } catch (error) {
      Alert.alert(t('error.generic'), t('error.failedToOpenUrl'));
    }
  };

  const handleAccept = async () => {
    if (!presignedData) return;

    const allTermsAccepted = presignedData.every(
      presigned => acceptedTerms[presigned.type] === true
    );

    if (!allTermsAccepted) {
      Alert.alert(
        t('purchase.termsRequired'),
        t('purchase.pleaseAcceptAllTerms'),
      );
      return;
    }

    try {
      // Filter only the accepted presigned documents
      const acceptedPresignedDocs = presignedData.filter(
        doc => acceptedTerms[doc.type]
      );

      const response = await initTransaction({
        productId,
        quantity,
        presignedDocuments: acceptedPresignedDocs
      }).unwrap();

      // Pass the transaction ID and accepted terms to the parent component
      onAccept(response.transactionId, acceptedTerms);
    } catch (error) {
      console.error('Failed to initialize transaction:', error);
      Alert.alert(
        t('error.transactionFailed'),
        t('error.pleaseRetryLater')
      );
    }
  };

  const getTermTitle = (type: PresignedType) => {
    switch (type) {
      case PresignedType.END_USER_POLICY:
        return t('purchase.endUserPolicy');
      case PresignedType.PERSONAL_DATA_AUTH:
        return t('purchase.personalDataAuth');
      default:
        return t('purchase.termsAndConditions');
    }
  };

  const totalPrice = productPrice * quantity;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>
            {t('purchase.confirmPurchase')}
          </ThemedText>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.summaryContainer}>
            <ThemedText style={styles.sectionTitle}>
              {t('purchase.orderSummary')}
            </ThemedText>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.productName}>{productName}</ThemedText>
              <ThemedText style={styles.quantity}>x{quantity}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.totalLabel}>{t('purchase.total')}:</ThemedText>
              <ThemedText style={styles.totalPrice}>
                {totalPrice.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                })}
              </ThemedText>
            </View>
          </View>

          <View style={styles.termsContainer}>
            <ThemedText style={styles.sectionTitle}>
              {t('purchase.termsAndConditions')}
            </ThemedText>
            <ThemedText style={styles.termsDescription}>
              {t('purchase.pleaseReviewAndAccept')}
            </ThemedText>

            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <ThemedText style={styles.loadingText}>
                  {t('purchase.loadingTerms')}
                </ThemedText>
              </View>
            )}

            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={24} color="#ff6b6b" />
                <ThemedText style={styles.errorText}>
                  {t('error.failedToLoadTerms')}
                </ThemedText>
              </View>
            )}

            {presignedData && presignedData.map((presigned) => (
              <View key={presigned.type} style={styles.termItem}>
                <Pressable
                  style={styles.checkboxContainer}
                  onPress={() => handleCheckboxChange(presigned)}
                >
                  <View style={[
                    styles.checkbox,
                    acceptedTerms[presigned.type] && styles.checkboxChecked
                  ]}>
                    {acceptedTerms[presigned.type] && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                  <View style={styles.termTextContainer}>
                    <ThemedText style={styles.termTitle}>
                      {getTermTitle(presigned.type)}
                    </ThemedText>
                    <Pressable
                      onPress={() => handleOpenUrl(presigned.url)}
                      style={styles.linkContainer}
                    >
                      <ThemedText style={styles.linkText}>
                        {t('purchase.readDocument')}
                      </ThemedText>
                      <Ionicons name="open-outline" size={16} color={Colors.primary} />
                    </Pressable>
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <ThemedText style={styles.cancelButtonText}>
              {t('common.cancel')}
            </ThemedText>
          </Pressable>

          <Pressable
            style={[
              styles.acceptButton,
              (!presignedData || isLoading || isInitializing) && styles.acceptButtonDisabled
            ]}
            onPress={handleAccept}
            disabled={!presignedData || isLoading || isInitializing}
          >
            <ThemedText style={styles.acceptButtonText}>
              {isInitializing ? t('common.processing') : t('purchase.confirmPurchase')}
            </ThemedText>
            {isInitializing && <ActivityIndicator size="small" color="white" style={styles.buttonLoader} />}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonLoader: {
    marginLeft: 8,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.text + '20',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryContainer: {
    backgroundColor: Colors.cardHighlight,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    flex: 1,
  },
  quantity: {
    fontSize: 16,
    color: Colors.text + 'CC',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    opacity: 0.7,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#ff6b6b',
  },
  termItem: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  termTextContainer: {
    flex: 1,
  },
  termTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 4,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.text + '20',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  acceptButtonDisabled: {
    backgroundColor: Colors.text + '40',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});