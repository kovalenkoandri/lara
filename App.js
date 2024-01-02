import { SafeAreaProvider } from "react-native-safe-area-context";
import Browser from "./Browser";

const LaraBrowser = () => {
  return (
    <SafeAreaProvider>
      <Browser />
    </SafeAreaProvider>
  );
};

export default LaraBrowser;
