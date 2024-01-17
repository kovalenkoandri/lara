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
  Animated,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import * as Clipboard from "expo-clipboard";
import * as Progress from "react-native-progress";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import Constants from "expo-constants";
import { onFetchUpdateAsync } from "./utils/checkUpdates";
import * as ScreenOrientation from "expo-screen-orientation";
import { INJECTED_DARK, INJECTED_LIGHT } from "./injected";

const Browser = () => {
  // useEffect(() => {
  //   !__DEV__ && onFetchUpdateAsync();
  // }, []);
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();
  const [address, setAddress] = useState(
    // "https://prom.ua/",
    // "https://olx.ua",
    // "https://au.yahoo.com"
    // "yandex.ru"
    // "https://chat.openai.com"
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
  const [clearInputBtnPressed, setClearInputBtnPressed] = useState(false);

  const [showNavBar, setShowNavBar] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const darkModeRef = useRef(true);
  const [userAgent, setUserAgent] = useState("");

  const slideAnim = useRef(new Animated.Value(0)).current;

  const slideIn = () => {
    // Will change slideAnim value to 1 in 500 ms
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const slideOut = () => {
    // Will change slideAnim value to 0 in 500 ms
    Animated.timing(slideAnim, {
      toValue: 25,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handlePressNavBar = () => {
    setFocused(false);
    slideIn();
    setShowNavBar(true);
  };

  useEffect(() => {
    const timeoutslideOutId = setTimeout(() => {
      slideOut(); // why it runs twice
    }, 150000);
    const timeoutNavBarId = setTimeout(() => {
      setShowNavBar(false);
    }, 150700);

    return () => {
      clearTimeout(timeoutslideOutId);
      clearTimeout(timeoutNavBarId);
    };
  }, [showNavBar]);

  const userAgentGet = async () => {
    try {
      const userAgentRef = await Constants.getWebViewUserAgentAsync();
      setUserAgent(userAgentRef);
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
    setNavStateUrl((oldUrl) => {
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
    setFocused(false);
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
    setFocused(false);
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
  const handleClearInput = () => {
    setAddress("https://");
    setNavStateUrlCutted("https://");
    setNavStateUrl("https://");

    if (!clearInputBtnPressed) {
      setClearInputBtnPressed(true);
    }
    setTimeout(() => {
      setClearInputBtnPressed(false);
    }, 2000);
  };
  const handleInjectJavaScript = () => {
    darkModeRef.current = !darkModeRef.current;
    setDarkMode((mode) => !mode);
    darkModeRef.current
      ? webviewRef.current?.injectJavaScript(INJECTED_DARK)
      : webviewRef.current?.injectJavaScript(INJECTED_LIGHT);
  };
  return (
    <SafeAreaView style={[{ marginTop: insets.top }, styles.safeAreaView]}>
      <TouchableOpacity onPress={() => setFocused(false)}>
        {isLoaded && (
          <Progress.Bar
            progress={progress}
            borderWidth={0}
            borderRadius={0}
            color="blue"
            width={null}
          />
        )}
        {showNavBar && (
          <Animated.View
            style={{
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 25], // The outputRange for slideAnim.interpolate should match the toValue of the Animated.timing function
                  }),
                },
              ],
            }}
          >
            <View style={[{ width: frame.width - 30 }, styles.inputContainer]}>
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
              <TouchableOpacity
                onPress={async () => {
                  try {
                    setFocused(true);
                    await handleCopy();
                    await handlePaste();
                    setFocused(true);
                  } catch (error) {
                    console.log("error on page update " + error);
                  }
                }}
              >
                <Text
                  selectable={true}
                  style={[
                    {
                      width: !focused ? frame.width - 80 : 1,
                      height: !focused ? "auto" : 1,
                    },
                    styles.output,
                  ]}
                >
                  {navStateUrlCutted}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={clearInputBtnPressed}
                onPress={handleClearInput}
              >
                {clearInputBtnPressed ? (
                  <Ionicons name="checkmark-done" size={24} color="white" />
                ) : (
                  <AntDesign name="delete" size={24} color="white" />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity disabled={copyBtnPressed} onPress={handleCopy}>
                {copyBtnPressed ? (
                  <Ionicons name="checkmark-done" size={24} color="white" />
                ) : (
                  <FontAwesome name="copy" size={24} color="white" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setFocused(false);
                  webviewRef.current?.goBack();
                }}
              >
                <FontAwesome name="backward" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setFocused(false);
                  webviewRef.current?.goForward();
                }}
              >
                <AntDesign name="forward" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setFocused(false);
                  webviewRef.current?.stopLoading();
                }}
              >
                <FontAwesome name="stop" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setFocused(false);
                  webviewRef.current?.reload();
                }}
              >
                <AntDesign name="reload1" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setFocused(false);
                  handleInjectJavaScript();
                }}
              >
                {darkMode ? (
                  <Fontisto name="night-clear" size={24} color="white" />
                ) : (
                  <Feather name="sun" size={24} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </TouchableOpacity>
      {valid ? (
        <TouchableOpacity onPress={handlePressNavBar} style={{ flex: 1 }}>
          <WebView
            // onTouchStart={(e) => console.log("Touch Start:", e.nativeEvent)}
            // onTouchMove={(e) => console.log("Touch Move:", e.nativeEvent)}
            ref={webviewRef}
            userAgent={
              address.startsWith("https://chat.openai.com") ? userAgent : ""
            }
            originWhitelist={["http://*", "https://*", "intent://*"]}
            source={{
              uri: address,
            }}
            style={styles.webView}
            onNavigationStateChange={handleNavigationStateChange}
            onError={({ nativeEvent }) =>
              console.log("WebView error:", nativeEvent.description)
            }
            injectedJavaScript={INJECTED_DARK} // on app load
            onMessage={(event) => {
              console.log(
                "event.nativeEvent.data >>>>" + event.nativeEvent.data,
              );
            }}
            startInLoadingState={true}
            onLoadStart={() => setIsLoaded(true)}
            onLoadEnd={() => setIsLoaded(false)}
            onLoadProgress={({ nativeEvent }) =>
              setProgress(nativeEvent.progress)
            }
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handlePressNavBar} style={{ flex: 1 }}>
          <Text selectable={true} style={styles.ensureText}>
            Please, ensure{"\n"}
            <Text style={styles.ensureTextHighlighted}>{"https://\n"}</Text>
            is passed before the address
          </Text>
        </TouchableOpacity>
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
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 20,
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
    width: "99%",
    fontSize: 24,
  },
  btnContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 20,
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
    marginRight: -20,
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
