import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

const OnboardingScreen2 = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
      <LottieView source={require("./farmer.json")} autoPlay loop style={{ width: 300, height: 300 }} />
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginTop: 20 }}>
        Analyze soil, weather, and demand to optimize your crop cycle
      </Text>
      <TouchableOpacity style={{ backgroundColor: "orange", padding: 10, borderRadius: 10, marginTop: 20 }} onPress={() => navigation.navigate("Onboarding3")}>
        <Text style={{ color: "white", fontSize: 18 }}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreen2;
