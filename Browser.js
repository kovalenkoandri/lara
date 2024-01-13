import React from "react";
import {
  useSafeAreaInsets,
  SafeAreaView,
  useSafeAreaFrame,
} from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import {
  TextInput,
  StyleSheet,
  View,
  Keyboard,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import * as Clipboard from "expo-clipboard";
import * as Progress from "react-native-progress";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { onFetchUpdateAsync } from "./utils/checkUpdates";
import * as ScreenOrientation from "expo-screen-orientation";

const Browser = () => {
  useEffect(() => {
    !__DEV__ && onFetchUpdateAsync();
  }, []);
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();
  const [address, setAddress] = useState(
    // 'https://prom.ua/'
    // 'https://olx.ua'
    // 'https://medium.com/geekculture/first-class-push-notifications-for-expo-apps-4bd7bbb9a01a'
    "https://google.com",
  );
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(true);
  const [focused, setFocused] = useState(false);
  const [valid, setValid] = useState(true);
  const [navStateUrl, setNavStateUrl] = useState("");
  const [navStateUrlCutted, setNavStateUrlCutted] = useState("");
  const [copyBtnPressed, setCopyBtnPressed] = useState(false);
  const [pasteBtnPressed, setPasteBtnPressed] = useState(false);
 
  const [userAgent, setUserAgent] = useState("");
  const userAgentGet = async () => {
    try {
      const userAgentRef = await Constants.getWebViewUserAgentAsync();
      setUserAgent(userAgentRef);
      // console.log("userAgentRef ", userAgentRef);
    } catch (error) {
      console.log("fetch user agent error ", error);
    }
  };
  userAgentGet();
  const handleBlur = () => {
    setFocused(false);
  };
  const handleFocus = () => {
    setFocused(true);
  };
  const handleAddress = (inputAddress) => {
    setAddress(inputAddress);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(address, { method: "HEAD" });
        // console.log(JSON.stringify(response, null, 2));
        // console.log(JSON.stringify(response.url, null, 2));
        if (response) {
          setValid(true);
          // Keyboard.dismiss();
          // console.log(webviewRef.current);
        }
      } catch (error) {
        console.error("Error fetching website:", error);
        setValid(false);
      }
    };
    fetchData();
  }, [address]);

  const webviewRef = useRef(null);
  const handleNavigationStateChange = (navState) => {
    // one way to handle errors is via query string
    // if (navState.url.includes("?errors=true")) {
    //   webviewRef.current?.stopLoading();
    // }
    setNavStateUrl((oldUrl) => {
      // Calculate the desired number of characters based on a percentage of frame width
      let startValue = oldUrl;
      const desiredCharacters = Math.floor(frame.width * 0.06);
      const trimmedValue = startValue.slice(0, desiredCharacters);
      setNavStateUrlCutted(trimmedValue + "...");
      if (navState.url !== oldUrl) {
        startValue = navState.url;
        const trimmedValue = startValue.slice(0, desiredCharacters);
        setNavStateUrlCutted(trimmedValue + "...");
        return navState.url;
      }
      return oldUrl;
    });
  };
  const handleCopy = async () => {
    Keyboard.dismiss();
    await Clipboard.setStringAsync(navStateUrl);
    if (!copyBtnPressed) {
      setCopyBtnPressed(true);
    }
    setTimeout(() => {
      setCopyBtnPressed(false);
    }, 2000);
  };
  const handlePaste = async () => {
    Keyboard.dismiss();
    const text = await Clipboard.getStringAsync();
    setAddress(text);
    if (!pasteBtnPressed) {
      setPasteBtnPressed(true);
    }
    setTimeout(() => {
      setPasteBtnPressed(false);
    }, 2000);
  };
   useEffect(() => {
     // Add orientation change listener
     const subscription =
       ScreenOrientation.addOrientationChangeListener(onOrientationChange);

     // Clean up the listener when the component unmounts
     return () => {
       // Remove the orientation change listener
       ScreenOrientation.removeOrientationChangeListener(subscription);
     };
   }, []);
   const onOrientationChange = (event) => {
     webviewRef.current?.reload();
   };
  // window.ReactNativeWebView.postMessage(JSON.stringify(window.getComputedStyle(document.body).backgroundColor));
  // window.ReactNativeWebView.postMessage(JSON.stringify(document.body.style.backgroundColor
  // window.ReactNativeWebView.postMessage(JSON.stringify(document.body.style.backgroundColor = "rgba(52, 53, 65, 1.0)"));
  // window.ReactNativeWebView.postMessage(JSON.stringify(document.body.style.color = "rgba(255, 255, 255, 1.0)"));
  // window.ReactNativeWebView.postMessage(JSON.stringify(document.body.style.fontSize = "2em")));
  const INJECTED_JAVASCRIPT = `
  (function() {
        window.ReactNativeWebView.postMessage(JSON.stringify(window.location.href));
})();
    `;

  return (
    <SafeAreaView style={[{ marginTop: insets.top }, styles.safeAreaView]}>
      {isLoaded && (
        <Progress.Bar
          progress={progress}
          borderWidth={0}
          borderRadius={0}
          color="blue"
          width={null}
        />
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.pasteBtn}
          disabled={pasteBtnPressed}
          onPress={handlePaste}
        >
          {pasteBtnPressed ? (
            <Ionicons name="checkmark-done" size={24} color="white" />
          ) : (
            <FontAwesome name="paste" size={24} color="white" />
          )}
        </TouchableOpacity>
        <ScrollView>
          <TextInput
            value={address}
            onChangeText={handleAddress}
            placeholder={"Enter web-address"}
            placeholderTextColor="#e8e8e8"
            style={[styles.input]}
            multiline={focused}
            onBlur={handleBlur}
            onFocus={handleFocus}
            selection={!focused ? { start: 0, end: 3 } : undefined}
          />
        </ScrollView>
      </View>
      {!focused && (
        <View style={styles.btnContainer}>
          <TouchableOpacity
            onPress={() => {
              webviewRef.current?.goBack();
            }}
          >
            <FontAwesome name="backward" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              webviewRef.current?.goForward();
            }}
          >
            <AntDesign name="forward" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              webviewRef.current?.stopLoading();
            }}
          >
            <FontAwesome name="stop" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              webviewRef.current?.reload();
            }}
          >
            <AntDesign name="reload1" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        disabled={copyBtnPressed}
        onPress={handleCopy}
        style={[{ width: frame.width - 30 }, styles.copyBtn]}
      >
        {copyBtnPressed ? (
          <Ionicons
            name="checkmark-done"
            size={24}
            color="white"
            style={styles.iconCopy}
          />
        ) : (
          <FontAwesome
            name="copy"
            size={24}
            color="white"
            style={styles.iconCopy}
          />
        )}
        <Text
          selectable={true}
          style={[{ width: frame.width - 80 }, styles.output]}
        >
          {navStateUrlCutted}
        </Text>
      </TouchableOpacity>
      {valid ? (
        <WebView
          ref={webviewRef}
          userAgent={userAgent || ""}
          originWhitelist={["*"]}
          source={{
            uri: address,
          }}
          style={styles.webView}
          onNavigationStateChange={handleNavigationStateChange}
          onError={({ nativeEvent }) =>
            console.log("WebView error:", nativeEvent.description)
          }
          // forceDarkOn={true}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          onMessage={(event) => {
            // console.log("event.nativeEvent.data >>>>" + event.nativeEvent.data);
          }}
          startInLoadingState={true}
          onLoadStart={() => setIsLoaded(true)}
          onLoadEnd={() => setIsLoaded(false)}
          onLoadProgress={({ nativeEvent }) =>
            setProgress(nativeEvent.progress)
          }
        />
      ) : (
        <Text selectable={true} style={styles.ensureText}>
          Please, ensure{"\n"}
          <Text style={styles.ensureTextHighlighted}>{"https://\n"}</Text>
          is passed before the address
        </Text>
      )}
    </SafeAreaView>
  );
};

export default Browser;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    borderColor: "#767577",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "rgba(52, 53, 65, 1.0)",
  },
  inputContainer: {
    flexDirection: "row",
    maxHeight: 160,
    alignItems: "center",
    borderColor: "#767577",
    borderWidth: 1,
    marginLeft: 20,
  },
  pasteBtn: {
    marginRight: 20,
  },
  input: {
    padding: 4,
    color: "#e8e8e8",
    backgroundColor: "#2f2f3d",
    borderColor: "#767577",
    borderWidth: 1,
    borderRadius: 10,
    width: "90%",
    fontSize: 24,
  },
  btnContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 20,
  },
  copyBtn: {
    height: 40,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#767577",
    borderWidth: 1,
    marginLeft: "auto",
    marginRight: "auto",
  },
  iconCopy: {
    marginRight: 20,
  },
  output: {
    color: "#e8e8e8",
    backgroundColor: "#2f2f3d",
    borderColor: "#767577",
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 24,
    overflow: "hidden",
  },
  webView: {
    borderRadius: 100,
    borderColor: "#767577",
    borderWidth: 1,
  },
  ensureText: {
    fontSize: 32,
    color: "#e8e8e8",
    textAlign: "center",
    height: 160,
    textAlignVertical: "center",
  },
  ensureTextHighlighted: {
    color: "red",
  },
});
