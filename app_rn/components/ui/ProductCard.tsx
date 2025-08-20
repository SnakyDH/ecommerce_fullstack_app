import { StyleSheet, Image, Pressable, View, Text, ActivityIndicator } from "react-native";
import { useRouter } from 'expo-router';
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Colors } from "@/constants/Colors";

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  stock?: number;
}

export default function ProductCard({ id, name, price, imageUrl, stock }: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handlePress = () => {
    router.push({
      pathname: '/product/[id]',
      params: { id: id.toString() }
    });
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const isOutOfStock = stock !== undefined && stock === 0;

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Image Loading Indicator */}
        {imageLoading && (
          <View style={styles.imageLoadingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}

        {/* Image Error State */}
        {imageError && (
          <View style={styles.imageErrorOverlay}>
            <Text style={styles.imageErrorText}>📷</Text>
            <Text style={styles.imageErrorSubtext}>{t("product.imageNotAvailable")}</Text>
          </View>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>{t("product.outOfStock")}</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
        <Text style={styles.price}>{price.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</Text>
        {stock !== undefined && (
          <Text style={[styles.stockText, isOutOfStock && styles.outOfStockTextSmall]}>
            {isOutOfStock ? t("product.outOfStock") : `${stock} ${t("product.inStock")}`}
          </Text>
        )}
      </View>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    height: 320,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageContainer: {
    position: 'relative',
  },
  content: {
    backgroundColor: "#875b3a",
    padding: 15,
    gap: 8,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  stockText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    fontStyle: 'italic',
  },
  outOfStockTextSmall: {
    color: "#ffcccb",
  },
  image: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: "100%",
    height: 200,
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  outOfStockText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  imageErrorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  imageErrorText: {
    fontSize: 32,
    marginBottom: 8,
  },
  imageErrorSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});