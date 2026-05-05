import { useState } from "react";
import styles from "./style";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
} from "react-native";
import Pill from "../Pill";
import SelectDropdown from "react-native-select-dropdown";
import {
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import CalenderField from "@/components/TextField/CalenderField/CalenderField";

const EntryCard = ({ entry, onSave, onUploadPress }) => {
  const [yesNo, setYesNo] = useState(entry?.social?.yes_no || "0");
  const [remarks, setRemarks] = useState(entry?.social?.remarks || "");
  const [date, setDate] = useState(
    entry?.social?.date_of_entry ? new Date(entry.social.date_of_entry) : null
  );
  const [validityDate, setValityDate] = useState(
    entry?.social?.validity_date ? new Date(entry.social.validity_date) : null
  );
  const [items, setItems] = useState([
    { label: "No", value: "2" },
    { label: "Yes", value: "1" },
    { label: "N/A", value: "0" },
  ]);
  const disabled = entry?.is_locked;
  console.log("ENTRYY ::", entry);
  console.log("ENTRYY ::", entry?.social?.remarks);
  console.log("ENTRYY YES NO::", entry?.social?.yes_no);

  const handleSave = () => {
    // Return a payload to parent (or call API)
    const payload = {
      entry_id: entry?.id,
      yes_no: yesNo,
      remarks,
      date_of_entry: date.toISOString().slice(0, 10),
      validity_date: validityDate.toISOString().slice(0, 10),
    };
    onSave && onSave(payload);

    Keyboard.dismiss();
  };

  const isHeading =
    typeof entry?.sl_no !== "undefined" && !String(entry.sl_no).includes(".");

  // ---------- Heading UI ----------
  if (isHeading) {
    return (
      <View style={[styles.row, styles.headingRow]}>
        <View style={[styles.colSL, styles.headingSLCol]}>
          <Text style={styles.headingSLText}>{entry.sl_no}</Text>
        </View>

        <View style={[styles.colItem, styles.headingItemCol]}>
          <Text style={styles.headingItemText}>{entry.item_description}</Text>
        </View>

        {/* Rest of the columns as dashes (like your screenshot) */}
        {entry.item_description?.length > 20 ? (
          <>
            <View style={[styles.cell, styles.dashCol]}>
              <Text style={styles.dash}>—</Text>
            </View>
          </>
        ) : (
          <>
            <View style={[styles.cell, styles.dashCol]}>
              <Text style={styles.dash}>—</Text>
            </View>
            <View style={[styles.cell, styles.dashCol]}>
              <Text style={styles.dash}>—</Text>
            </View>
            {/* <View style={[styles.cell, styles.dashCol]}>
              <Text style={styles.dash}>—</Text>
            </View>
            <View style={[styles.cell, styles.dashCol]}>
              <Text style={styles.dash}>—</Text>
            </View> */}
          </>
        )}
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.colSL}>
          <Text style={styles.slText}>{entry.sl_no}</Text>
        </View>

        <View style={styles.colItem}>
          <Text style={styles.itemText}>{entry.item_description}</Text>
        </View>
      </View>

      <View style={[styles.row, { marginTop: 12 }]}>
        <View style={styles.colSmall}>
          <Text style={styles.label}>Yes/No</Text>
          <View style={styles.pickerWrap}>
            <SelectDropdown
              disabled={disabled}
              data={items}
              defaultValue={items.find(
                (item) => Number(item.value) === Number(yesNo)
              )}
              onSelect={(selectedItem) => setYesNo(selectedItem?.value)}
              renderDropdownIcon={(isOpened) => (
                <AntDesign
                  name={isOpened ? "up" : "down"}
                  size={14}
                  color="#000"
                />
              )}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownBtn}>
                    <Text style={styles.dropdownBtnText}>
                      {selectedItem?.label}
                    </Text>
                    <MaterialCommunityIcons
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      size={15}
                    />
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View
                    style={{
                      ...styles.dropdownMenu,
                      ...(isSelected && { backgroundColor: "#D2D9DF" }),
                    }}
                  >
                    <Text style={styles.dropdownItemTxtStyle}>
                      {item?.label}
                    </Text>
                  </View>
                );
              }}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdownMenu}
            />
          </View>
        </View>

        <View style={styles.colRemarks}>
          <Text style={styles.label}>Remarks</Text>
          <TextInput
            placeholder="Add remarks..."
            value={remarks}
            onChangeText={setRemarks}
            style={styles.input}
            multiline
            numberOfLines={2}
            editable={!disabled}
            placeholderTextColor={"#555"}
          />
        </View>
        <View style={[styles.colSmall, { marginLeft: "1%" }]}>
          <Text style={styles.label}>Validity</Text>
          {entry?.is_validity ? (
            <>
              <CalenderField
                Cdate={validityDate}
                setCDate={setValityDate}
                placeholder={"Date"}
                disabled={disabled}
              />
            </>
          ) : (
            <>
              <Pill style={{ alignSelf: "flex-start" }}>N/A</Pill>
            </>
          )}
        </View>
      </View>

      <View style={[styles.row, { marginTop: 12, alignItems: "center" }]}>
        <View style={[styles.colDate]}>
          <Text style={styles.label}>Date of Entry</Text>
          <CalenderField
            Cdate={date}
            setCDate={setDate}
            placeholder={"Date"}
            disabled={disabled}
          />
        </View>

        <View style={styles.colActions}>
          <Text style={styles.label}>Action</Text>
          <TouchableOpacity
            style={[
              styles.saveBtn,
              { backgroundColor: disabled ? "#ccc" : "#28A745" },
            ]}
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>
              {disabled ? "Saved" : "Save"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.colFiles}>
          <Text style={styles.label}>Files</Text>
          <TouchableOpacity
            style={[
              styles.uploadBtn,
              { backgroundColor: disabled ? "#ccc" : "#007BFF" },
            ]}
            onPress={() => onUploadPress(entry)}
          >
            <Text style={styles.uploadBtnText}>
              {" "}
              {disabled ? "Uploaded" : "Uploaded"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EntryCard;
