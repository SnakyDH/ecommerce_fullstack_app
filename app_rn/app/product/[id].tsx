import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { Colors } from '@/constants/Colors';
import { useGetProductsQuery } from '@/store/api/productsApi';
import { Product } from '@/types/product';
import { useTranslation } from 'react-i18next';
import RequestAcceptPresignedModal from '@/components/ui/RequestAcceptPresignedModal';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showPresignedModal, setShowPresignedModal] = useState(false);
  const { t } = useTranslation();
  const { data: productsResponse, isLoading, error } = useGetProductsQuery({ limit: 100 });
  const product = productsResponse?.data?.find((p: Product) => p.id.toString() === id);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    setShowPresignedModal(true);
  };

  const handlePresignedAccept = (transactionId: number, acceptedTerms: { [key: string]: boolean }) => {
    setShowPresignedModal(false);
    router.push({
      pathname: '/transaction',
      params: { transactionId }
    });
  };

  const handlePresignedClose = () => {
    setShowPresignedModal(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <ThemedText style={styles.loadingText}>{t("product.loadingProduct")}</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#ff6b6b" />
          <ThemedText style={styles.errorText}>{t("product.productNotFound")}</ThemedText>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ThemedText style={styles.backButtonText}>{t("product.goBack")}</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const totalPrice = product.price * selectedQuantity;
  const isOutOfStock = product.stock === 0;
  return (
    <>
      <Stack.Screen
        options={{
          title: product ? product.name : t("product.productDetails"),
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerBackTitle: 'Back',
        }}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />

            {/* Image Loading Indicator */}
            {imageLoading && (
              <View style={styles.imageLoadingOverlay}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <ThemedText style={styles.imageLoadingText}>{t("product.loadingImage")}</ThemedText>
              </View>
            )}

            {/* Image Error State */}
            {imageError && (
              <View style={styles.imageErrorOverlay}>
                <Ionicons name="image-outline" size={64} color="#ccc" />
                <ThemedText style={styles.imageErrorText}>{t("product.imageNotAvailable")}</ThemedText>
              </View>
            )}

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <View style={styles.outOfStockOverlay}>
                <Text style={styles.outOfStockText}>{t("product.outOfStock")}</Text>
              </View>
            )}
          </View>

          <View style={styles.productInfo}>
            <ThemedText style={styles.productName}>{product.name}</ThemedText>
            <ThemedText style={styles.productPrice}>
              {product.price.toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP',
              })}
            </ThemedText>

            <View style={styles.stockContainer}>
              <Ionicons
                name={product.stock > 0 ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={product.stock > 0 ? '#4CAF50' : '#ff6b6b'}
              />
              <ThemedText style={[
                styles.stockText,
                { color: product.stock > 0 ? '#4CAF50' : '#ff6b6b' }
              ]}>
                {product.stock > 0 ? `${product.stock} ${t("product.inStock")}` : t("product.outOfStock")}
              </ThemedText>
            </View>

            {!isOutOfStock && (
              <QuantitySelector
                quantity={selectedQuantity}
                maxQuantity={product.stock}
                onQuantityChange={setSelectedQuantity}
              />
            )}

            {!isOutOfStock && selectedQuantity > 1 && (
              <View style={styles.totalContainer}>
                <ThemedText style={styles.totalLabel}>{t("product.total")}:</ThemedText>
                <ThemedText style={styles.totalPrice}>
                  {totalPrice.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                  })}
                </ThemedText>
              </View>
            )}

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>
                {t("product.highQualityPrefix")}
                <Text style={styles.productNameHighlight}>
                  {product.name.toLowerCase()}
                </Text>
                {t("product.highQualitySuffix")}
              </Text>
            </View>
          </View>
        </ScrollView>

        {!isOutOfStock && (
          <View style={styles.actionContainer}>
            <Pressable
              style={[styles.actionButton, styles.buyNowButton]}
              onPress={handleBuyNow}
            >
              <Ionicons name="flash" size={20} color="white" />
              <Text style={styles.actionButtonText}>{t("product.buyNow")}</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>

      {/* Presigned Modal */}
      {product && (
        <RequestAcceptPresignedModal
          visible={showPresignedModal}
          onClose={handlePresignedClose}
          onAccept={handlePresignedAccept}
          productName={product.name}
          productPrice={product.price}
          quantity={selectedQuantity}
          productId={product.id}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.text + '20',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: 'white',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLoadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.text,
    opacity: 0.7,
  },
  imageErrorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageErrorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productNameHighlight: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: 'bold',
    fontStyle: 'italic',
    backgroundColor: Colors.primary + '20',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 12,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.text + '20',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  descriptionContainer: {
    marginTop: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    color: Colors.text,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.text + '20',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  addToCartButton: {
    backgroundColor: '#875b3a',
  },
  buyNowButton: {
    backgroundColor: Colors.primary,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 16,
    textAlign: 'center',
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
