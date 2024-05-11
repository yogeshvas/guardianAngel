import { useEffect, useState } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
const useAppwrite = (fn) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const fetchData = async () => {
    setIsloading(true);
    try {
      const response = await fn();
      setData(response);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        position: "bottom",
        bottomOffset: 90,
        text2: error.message,
        visibilityTime: 5000, // 5 seconds
      });
    } finally {
      setIsloading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const refetch = () => fetchData();
  return { data, isLoading, refetch };
};

export default useAppwrite;
