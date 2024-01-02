import { WebView } from "react-native-webview";
import {
  TextInput,
  StyleSheet,
  View,
  Button,
  SafeAreaView,
  Keyboard,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import * as Clipboard from "expo-clipboard";
import * as Progress from "react-native-progress";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

const windowDimensions = Dimensions.get("window");

const LaraBrowser = () => {
  // const { userAgentRef } = useAppSelector((state) => state.gpt);
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
  const [multiline, setMultiline] = useState(false);
  const [topEl, setTopEl] = useState(true);
  const [navStateUrl, setNavStateUrl] = useState("");
  const [navStateUrlCutted, setNavStateUrlCutted] = useState("");
  const [copyBtnPressed, setCopyBtnPressed] = useState(false);
  const [pasteBtnPressed, setPasteBtnPressed] = useState(false);
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
  });
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
    setMultiline(false);
    setTopEl(true);
    setFocused(false);
  };
  const handleFocus = () => {
    setMultiline(true);
    setTopEl(false);
    setFocused(true);
  };
  const handleAddress = (inputAddress) => {
    setAddress(inputAddress);
  };
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({ window });
    });
    return () => subscription?.remove();
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(address, { method: "HEAD" });
        // console.log(JSON.stringify(response, null, 2));
        // console.log(JSON.stringify(response.url, null, 2));
        if (response) {
          setValid(true);
          // Keyboard.dismiss();
          // console.log(ref.current);
        }
      } catch (error) {
        console.error("Error fetching website:", error);
        setValid(false);
      }
    };
    fetchData();
  }, [address]);

  const ref = useRef(null);
  const handleNavigationStateChange = (navState) => {
    console.log("navState.url ", navState.url);
    // one way to handle errors is via query string
    if (navState.url.includes("?errors=true")) {
      ref.current?.stopLoading();
    }
    setNavStateUrl((oldUrl) => {
      let startValue = oldUrl;
      const trimmedValue = startValue.slice(0, 24);
      setNavStateUrlCutted(trimmedValue + "...");
      if (navState.url !== oldUrl) {
        startValue = navState.url;
        const trimmedValue = startValue.slice(0, 24);
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
    <SafeAreaView style={styles.safeAreaView}>
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
            style={[styles.input]}
            multiline={multiline}
            onBlur={handleBlur}
            onFocus={handleFocus}
            selection={!focused && { start: 0, end: 8 }}
          />
        </ScrollView>
      </View>
      {topEl && (
        <View style={styles.btnContainer}>
          <TouchableOpacity
            onPress={() => {
              ref.current?.goBack();
            }}
          >
            <FontAwesome name="backward" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              ref.current?.goForward();
            }}
          >
            <AntDesign name="forward" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              ref.current?.stopLoading();
            }}
          >
            <FontAwesome name="stop" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              ref.current?.reload();
            }}
          >
            <AntDesign name="reload1" size={24} color="white" />
          </TouchableOpacity>
          {/* <Button
          title="clearCache"
          onPress={() => {
            ref.current?.clearCache();
          }}
        ></Button> */}
          {/* <Button
          title="requestFocus"
          onPress={() => {
            ref.current?.requestFocus();
          }}
        ></Button> */}
          {/* <Button
          title="clearHistory"
          onPress={() => {
            ref.current?.clearHistory();
          }}
        ></Button> */}
          {/* <Button
          title="clearFormData"
          onPress={() => {
            ref.current?.clearFormData();
          }}
        ></Button> */}
          <TouchableOpacity
            disabled={copyBtnPressed}
            onPress={handleCopy}
            style={[{ width: dimensions.window.width - 30 }, styles.copyBtn]}
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
              style={[{ width: dimensions.window.width - 80 }, styles.output]}
            >
              {navStateUrlCutted}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {valid ? (
        <WebView
          ref={ref}
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
            console.log("event.nativeEvent.data >>>>" + event.nativeEvent.data);
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

export default LaraBrowser;
