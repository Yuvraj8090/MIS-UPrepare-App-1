import React from "react";
import { View, Text } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";

const DropDown = ({ select, setSelect, data }) => {
  return (
    <SelectDropdown
      data={data}
      onSelect={(selectedItem, index) => {
        // console.log(selectedItem?.project_id, index);
        // setSelectedPID(selectedItem?.project_id);
        setSelect(selectedItem?.project_id);
      }}
      renderButton={(selectedItem, isOpened) => {
        return (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonTxtStyle}>
              {(selectedItem && selectedItem?.project_id) ||
                "Select Project Id"}
            </Text>
            <MaterialCommunityIcons
              name={isOpened ? "chevron-up" : "chevron-down"}
              style={styles.dropdownButtonArrowStyle}
            />
          </View>
        );
      }}
      renderItem={(item, index, isSelected) => {
        return (
          <View
            style={{
              ...styles.dropdownItemStyle,
              ...(isSelected && { backgroundColor: "#D2D9DF" }),
            }}
          >
            <MaterialCommunityIcons
              name={item.icon}
              style={styles.dropdownItemIconStyle}
            />
            <Text style={styles.dropdownItemTxtStyle}>{item?.project_id}</Text>
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.dropdownMenuStyle}
    />
  );
};

export default DropDown;
