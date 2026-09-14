import {
  View,
  Text,
  ActivityIndicator,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import * as Progress from "react-native-progress";
import { Feather, AntDesign } from "@expo/vector-icons";

const UploadProgress = ({
  text,
  show,
  setShow,
  progress,
  source,
  saveLocally,
}) => {
  const progr = progress / 100;

  const [cancel, setCancel] = useState(false);

  const cancelUpload = () => {
    setCancel(true);
    source.cancel("Uploading canceled !!");
    setTimeout(() => {
      setShow(false);
      setCancel(false);
    }, 2000);
  };

  return (
    show && (
      <View
        style={{
          width: "100%",
          height: "100%",
          zIndex: 1050,
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.15)",
          //   borderTopLeftRadius: 10,
          //   borderTopLeftRadius: 10,
          borderRadius: 5,
        }}
      >
        <View
          style={{
            width: 16 * 15,
            height: 12 * 12,
            elevation: 2,
            alignItems: "center",
            borderRadius: 10,
            justifyContent: "center",
            backgroundColor: "#fff",
            backfaceVisibility: "hidden",
          }}
        >
          {saveLocally ? (
            <>
              <View style={{ alignItems: "center" }}>
                <AntDesign name="checkcircleo" size={30} color="green" />
                <Text
                  style={{
                    fontFamily: "Jost-Medium",
                    fontSize: 18,
                  }}
                >
                  Image Save locally Now!!
                </Text>
              </View>
            </>
          ) : cancel ? (
            <>
              <View style={{ alignItems: "center" }}>
                <AntDesign name="close" size={40} color="red" />
                <Text style={{ fontFamily: "Jost-Medium", fontSize: 18 }}>
                  Upload canceled!!
                </Text>
              </View>
            </>
          ) : (
            <>
              {progress == 99 ? (
                <Feather name="check-circle" size={26} color="green" />
              ) : (
                <Text style={{ fontFamily: "Jost-Medium", fontSize: 16 }}>
                  {progress} %
                </Text>
              )}
              <View style={{ marginVertical: "3%" }}>
                <Progress.Bar progress={progr} size={15} />
              </View>
              <Text style={{ fontFamily: "Jost-Medium", fontSize: 16 }}>
                {progress == 99 ? <>Upload Image Successfully</> : <>{text}</>}
              </Text>
            </>
          )}

          {!cancel && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={cancelUpload}
              style={{
                alignItems: "center",
                flexDirection: "row",
                marginTop: "10%",
              }}
            >
              <Text
                style={{
                  fontFamily: "Jost-Medium",
                  fontSize: 12,
                  color: "red",
                }}
              >
                Cancel Uploading
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  );
};

export default UploadProgress;
