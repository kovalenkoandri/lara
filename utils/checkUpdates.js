import * as Updates from 'expo-updates';
export const onFetchUpdateAsync = () => {
 const checkUpdatesExpo = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      alert(`Error fetching latest Expo update: ${error}`);
    }
    /* <TouchableOpacity
        onPress={onFetchUpdateAsync}
        style={styles.checkUpdateButton}
      >
        <Text style={styles.checkUpdateButtonText}>Check for updates</Text>
      </TouchableOpacity> */
  };
    setInterval(checkUpdatesExpo, 3600000);
};

export const checkUpdatesOnAppStart = async () => {
  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    alert(`Error fetching latest Expo update: ${error}`);
  }
  
};