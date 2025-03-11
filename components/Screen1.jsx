import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

const OnboardingScreen1 = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
      <LottieView source={require("./farmer.json")} autoPlay loop style={{ width: 300, height: 300 }} />
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginTop: 20 }}>
        Welcome to AgriPlanner – Your Smart Farming Companion
      </Text>
      <TouchableOpacity style={{ backgroundColor: "orange", padding: 10, borderRadius: 10, marginTop: 20 }} onPress={() => navigation.navigate("Onboarding2")}>
        <Text style={{ color: "white", fontSize: 18 }}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreen1;
