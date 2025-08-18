import { StyleSheet, Image, Pressable, View, Text } from "react-native";

interface Props {
  name: string;
  price: number;
  imageUrl: string;
  onPress: () => void;
}

export default function ProductCard({ name, price, imageUrl, onPress }: Props) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.price}>{price.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</Text>
      </View>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    height: 300,
  },
  content: {
    backgroundColor: "#875b3a",
    padding: 15,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  price: {
    fontSize: 18,
    fontWeight: "semibold",
    color: "white",
  },
  image: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: "100%",
    height: 200,
  },
});

