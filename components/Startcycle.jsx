import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnboardingScreen1 from "./OnboardingScreen1";
import OnboardingScreen2 from "./OnboardingScreen2";
import OnboardingScreen3 from "./OnboardingScreen3";

const UserDecisionScreen = ({ navigation }) => {
  const handleSelectCrop = () => {
    navigation.navigate("Home", { cropSelected: true });
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white", paddingHorizontal: 20 }}> 
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>Get a personalized crop plan tailored to your farm</Text>
      <TouchableOpacity style={{ backgroundColor: "green", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, marginBottom: 10 }} onPress={handleSelectCrop}>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Start My Agricultural Cycle</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ backgroundColor: "gray", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 }} onPress={() => navigation.navigate("Home")}> 
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Skip for Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};