import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

const OnboardingScreen3 = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
      <LottieView source={require("./farmer.json")} autoPlay loop style={{ width: 300, height: 300 }} />
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginTop: 20 }}>
        Collaborate with local farmers and officials
      </Text>
      <TouchableOpacity style={{ backgroundColor: "orange", padding: 10, borderRadius: 10, marginTop: 20 }} onPress={() => navigation.navigate("Login")}>
        <Text style={{ color: "white", fontSize: 18 }}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreen3;
