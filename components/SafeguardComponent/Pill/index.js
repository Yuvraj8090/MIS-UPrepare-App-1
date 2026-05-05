import { View, Text } from "react-native";
import styles from "./style";

const Pill = ({ children, style }) => (
  <View style={[styles.pill, style]}>
    <Text style={styles.pillText}>{children}</Text>
  </View>
);
export default Pill;
