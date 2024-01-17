import { useState, useEffect } from "react";

const useFetchData = (address) => {
  const [valid, setValid] = useState(true);
console.log(address);
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

  return valid;
};

export default useFetchData;
