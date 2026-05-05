import {
  ScrollView,
  View,
  Text,
  Image,
  ToastAndroid,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import styles from "./styles";
import TextField from "../../components/TextField/TextField";
import BButton from "../../components/Button/BButton";
import { useNavigation } from "@react-navigation/native";
import { forgotPassword } from "../../services/api/fetch";
import { useAuth } from "../../navigation/AuthContext/AuthContext";
import LoaderCard from "../../components/LoaderCard";

const { width, height } = Dimensions.get("window");

const ForgotScreen = () => {
  const [userName, setUserName] = React.useState("");
  const [showLCard, setShowLCard] = useState(false);

  // For Error Messagee
  const [userNameError, setUserNameError] = React.useState("");

  const navigation = useNavigation();

  const { user } = useAuth();

  // useEffect(function () {
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //   var keyy = await getKey();
  //   var data = await getStoreData(keyy);
  //   setToken(data?.api_token);
  // };

  // const handleSubmit = async () => {
  //   var token = user?.token;

  //   var body = {
  //     email: email,
  //   };
  //   console.log("Email Address :", body);
  //   await ForgotPassword({ body })
  //     .then((data) => {
  //       console.log("User Data :", data);

  //       if (data?.status === true) {
  //         setSuccess(true);
  //         ToastAndroid.show("Email Sent Successfully", ToastAndroid.LONG);
  //         // navigation.navigate("Home1");
  //       } else {
  //         setError(data?.errors?.email);
  //         ToastAndroid.show("Something went wrong", ToastAndroid.LONG);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error::::::", error);
  //     });
  //   setTimeout(() => {
  //     setSuccess(false);
  //     setError(null);
  //   }, 5000);
  // };

  const validateUserName = (username) => {
    // For example, allowing alphanumeric characters and underscores, with a length of 3 to 20 characters
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    if (!usernameRegex.test(userName)) {
      setUserNameError("Invalid username with a length of 3 to 20 characters.");
      return false;
    } else {
      setUserNameError("");
      return true;
    }
  };

  const handleSubmit = async () => {
    setShowLCard(true);
    const isUserNameValid = validateUserName();
    var formData = {
      username: userName,
    };

    if (isUserNameValid) {
      // Implement your login logic here
      // If everything is valid, proceed with login

      await forgotPassword(formData).then((data) => {
        console.log("USER DATATAA  ::", data);

        if (data?.data?.ok) {
          setTimeout(() => {
            setShowLCard(false);
            ToastAndroid.show(data?.data?.msg, ToastAndroid.LONG);
            navigation.navigate("OTPScreen", { userName: userName });
          }, 2000);
        } else {
          // console.log("OUTTT", data.msg);
          // setError(data?.errors?.email);
          ToastAndroid.show(data?.data?.msg, ToastAndroid.LONG);
          setShowLCard(false);
        }
      });

      // .catch((error) => {
      //   console.error("Error::::::", error);
      // });

      // ToastAndroid.show("OTP Sent Successfully", ToastAndroid.LONG);
      // alert("Forgot Successfully!!");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/home.jpeg")}
      style={styles.mainContainer}
    >
      <ScrollView
        // style={styles.mainContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* <CustomHeader Title={"Forgot Password"} /> */}
        <View style={styles.container}>
          <Image
            source={require("../../assets/images/forgot.png")}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.title}>Forgot Your Password</Text>
          <View style={styles.subtitleview}>
            <Text style={styles.subTitle}>
              Enter your username and we will send you instructions to reset
              your password
            </Text>
          </View>
          <TextField
            err={userNameError}
            value={userName}
            setData={setUserName}
            iconName="account"
            placeholder="Username"
          />

          {userNameError && (
            <Text
              style={{
                fontFamily: "Jost-Medium",
                fontSize: 12,
                color: "red",
                marginVertical: "1%",
              }}
            >
              {userNameError}
            </Text>
          )}

          <BButton
            Title={"Submit"}
            // isOn={email.length <= 8 ? isOn : <></>}
            onPress={handleSubmit}
          />
          {/* {error && (
        <>
        <Image
            source={require("../../../assets/failed.gif")}
            style={{ width: 40, height: 40 }}
          />
          <Text style={styles.error}>{`${error}`}</Text>
        </>
        )}
      {success && (
        <>
          <Image
            source={require("../../../assets/send.gif")}
            style={{ width: 40, height: 40 }}
            />
            <Text style={styles.status}>"Email Send Successfully!!"</Text>
            </>
          )} */}
        </View>
      </ScrollView>
      <LoaderCard show={showLCard} text={"Processing..."} />
    </ImageBackground>
  );
};

export default ForgotScreen;
