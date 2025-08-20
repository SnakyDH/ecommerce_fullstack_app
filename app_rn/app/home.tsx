import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ProductCard from "@/components/ui/ProductCard";
import SwitchLang from "@/components/ui/SwitchLang";
import { Colors } from "@/constants/Colors";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, FlatList, RefreshControl, ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";


export default function Home() {
  const { t } = useTranslation();

  const {
    products,
    pagination,
    isLoading,
    isLoadingMore,
    hasError,
    isEmpty,
    hasNextPage,
    loadMore,
    refresh,
  } = useInfiniteProducts({
    pageSize: 10,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isLoadingMore) {
      loadMore();
    }
  }, [hasNextPage, isLoadingMore, loadMore]);

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <ThemedView style={styles.header}>
      </ThemedView>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>{t("home.title")}</ThemedText>
        <SwitchLang />
      </ThemedView>
      <ThemedView style={styles.body}>
        <ThemedText style={styles.title}>{t("home.products")}</ThemedText>
        <ThemedText style={styles.description}>{t("home.productsDescription")}</ThemedText>




        {pagination && products.length > 0 && (
          <View style={styles.paginationInfo}>
            <ThemedText style={styles.paginationText}>
              Showing {products.length} of {pagination.total} products (Page {pagination.page}/{pagination.totalPages})
            </ThemedText>
            <ThemedText style={styles.debugText}>
              Has next: {hasNextPage ? 'Yes' : 'No'} | Loading more: {isLoadingMore ? 'Yes' : 'No'}
            </ThemedText>
          </View>
        )}

        {isLoading && !refreshing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <ThemedText style={styles.loadingText}>Loading products...</ThemedText>
          </View>
        )}

        {hasError && (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>
              Failed to load products. Please try again.
            </ThemedText>
          </View>
        )}

        {!isLoading && !hasError && (
          <FlatList
            testID="products-list"
            data={products}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            renderItem={({ item }) => (
              <ProductCard
                id={item.id}
                name={item.name}
                price={item.price}
                imageUrl={item.image}
                stock={item.stock}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.contentContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => (
              isLoadingMore ? (
                <View style={styles.loadMoreContainer}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <ThemedText style={styles.loadMoreText}>Loading more products...</ThemedText>
                </View>
              ) : null
            )}
            ListEmptyComponent={
              isEmpty ? (
                <View style={styles.emptyContainer}>
                  <ThemedText style={styles.emptyText}>No products found</ThemedText>
                </View>
              ) : null
            }
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    height: 60,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
  },
  title: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: "bold",
  },
  description: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "normal",
  },
  body: {
    flex: 1,
    width: "100%",
    padding: 16,
    gap: 10,
  },
  row: {
    gap: 15,
  },
  contentContainer: {
    gap: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.text,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: Colors.text,
    fontSize: 16,
    textAlign: 'center',
  },
  loadMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  loadMoreText: {
    color: Colors.text,
    fontSize: 14,
  },
  paginationInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  paginationText: {
    color: Colors.text,
    fontSize: 12,
    opacity: 0.7,
  },
  debugText: {
    color: Colors.text,
    fontSize: 10,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  debugContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});

