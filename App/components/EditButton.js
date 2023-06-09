import { Ionicons } from "@expo/vector-icons";
import { Image, View } from "react-native";
import { StyleSheet } from "react-native";

export function EditButton({ tintColor }) {
  return (
    <View style={styles.view}>
      <Image
        style={(styles.image, { tintColor: tintColor })}
        source={require("../assets/images/edit-icon.svg")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    marginRight: 10,
  },
  image: {
    maxWidth: 30,
    maxHeight: 30,
  },
});
