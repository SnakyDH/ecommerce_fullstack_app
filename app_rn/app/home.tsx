import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ProductCard from "@/components/ui/ProductCard";
import SwitchLang from "@/components/ui/SwitchLang";
import { Colors } from "@/constants/Colors";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const products = [
  {
    id: 1,
    name: "Coffee",
    price: 10,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
  },
  {
    id: 2,
    name: "Coffee",
    price: 10,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
  },
  {
    id: 3,
    name: "Coffee",
    price: 10,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
  },
  {
    id: 4,
    name: "Coffee",
    price: 10,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
  },


]


export default function Home() {
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

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
        <FlatList data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => <ProductCard name={item.name} price={item.price} imageUrl={item.imageUrl} onPress={() => {
            // TODO: Navigate to product details
          }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.contentContainer}
        />
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
});

