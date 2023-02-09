import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { AzureInstance, AzureLoginView } from "react-native-azure-ad-2";
import RCTNetworking from "react-native/Libraries/Network/RCTNetworking";
import AzureLoginView from "./AzureLoginView";

const { Navigator, Screen } = createNativeStackNavigator();
const buttonColor = Platform.OS === "ios" ? "#fff" : "#007AFF";
const domain = 'https://dev.vena.energy';
const loginUrl = domain + '/mobile-login';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Get ready to login to Azure</Text>
      <View style={styles.button}>
        <Button
          onPress={() => navigation.navigate("SignIn")}
          title="Sign In"
          style={styles.title}
          color={buttonColor}
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const SignInScreen = ({ navigation }) => {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginObject, setLoginObject] = useState({});
  const [listCountries, setListCountries] = useState({});

  const onLoginSuccess = async (authData) => {
    console.log('bugatino-authData', authData);
    try {
      const listSelectedCountries = await getListSelectedCountry(authData.equis_auth_token);
      setListCountries(listSelectedCountries);
      setLoginObject(authData);
      setLoginSuccess(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("error getting user info");
      console.error(err);
    }
  };

  const getListSelectedCountry = async (token) => {
    const response = await fetch(domain + '/api/v1/get-selected-countries', {
      credentials: 'include',
      headers: {
        'equis-auth-token': token,
      },
    });
    const listSelectedCountries = await response.json();
    console.log('listSelectedCountries', listSelectedCountries);
    return listSelectedCountries;
  }

  const signOut = () =>
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          RCTNetworking.clearCookies(() => {});
          setLoginSuccess(false);
          navigation.navigate("Home");
        },
      },
    ]);

  if (!loginSuccess) {
    return (
      <AzureLoginView
        loginUrl={loginUrl}
        loadingMessage="Requesting access token again"
        onSuccess={onLoginSuccess}
      />
    );
  }

  const { userInfo } = loginObject;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome {userInfo.displayName}</Text>
      <Text style={styles.text}>
        You logged into Azure with: {JSON.stringify(loginObject)}
      </Text>

      <Text style={styles.text}>
        Your selected country is: {JSON.stringify(listCountries)}
      </Text>

      <View style={styles.button}>
        <Button
          onPress={signOut}
          title="Sign Out"
          style={styles.title}
          color={buttonColor}
          accessibilityLabel="Sign Out of Azure"
        />
      </View>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Navigator>
        <Screen name="Home" component={HomeScreen} />
        <Screen name="SignIn" component={SignInScreen} />
      </Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 4,
  },
  title: {
    textAlign: "center",
    marginVertical: 8,
  },
  text: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});
