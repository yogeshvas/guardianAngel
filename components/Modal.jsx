import {
  Modal as RNModal,
  ModalProps,
  KeyboardAvoidingView,
  View,
} from "react-native";

export const CustomModal = ({ isOpen, withInput, children, ...rest }) => {
  const content = (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
      }}
    >
      <View
        style={{
          width: "auto", // Adjust the width of the modal as desired
          backgroundColor: "white",
          padding: 20,
          height: "auto",
          borderRadius: 10,
          height: 350,
          width: 300,
          alignItems: "center", // Center content horizontally
        }}
      >
        {children}
      </View>
    </View>
  );

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      statusBarTranslucent
      {...rest}
    >
      {content}
    </RNModal>
  );
};
