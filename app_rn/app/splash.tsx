import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, StyleSheet } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/home");
    }, 2000);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Image source={Images.logo} style={styles.logo} />
      <ThemedText style={styles.title}>{t("welcome")}</ThemedText>
      <ActivityIndicator size="large" color={Colors.tint} style={styles.activityIndicator} />
    </ThemedView>
  )
}


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background, gap: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: Colors.text },
  activityIndicator: { marginTop: 20 },
  logo: { width: 200, height: 200 },
});