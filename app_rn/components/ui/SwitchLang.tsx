import { Colors } from "@/constants/Colors";
import { Locales } from "@/constants/Locales";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { Images } from "@/constants/Images";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SwitchLang() {
  const { t, i18n } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => i18n.changeLanguage(Locales.en)}
      >
        <Image source={Images.en} style={styles.flag} />
        <ThemedText>{t("switchToEnglish")}</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => i18n.changeLanguage(Locales.es)}
      >
        <Image source={Images.es} style={styles.flag} />
        <ThemedText>{t("switchToSpanish")}</ThemedText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  flag: {
    width: 20,
    height: 20,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    backgroundColor: Colors.primary,
    color: Colors.text,
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
});