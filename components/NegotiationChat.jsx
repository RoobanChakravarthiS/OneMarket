"use client";

import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";

const NegotiationChatScreen = ({ route }) => {
  const { negotiation } = route.params;
  const [messages, setMessages] = useState(negotiation.messages);
  const [customPrice, setCustomPrice] = useState("");

  const addMessage = (message, sender) => {
    setMessages([...messages, { sender, message }]);
  };

  const handleResponse = (response) => {
    if (response === "custom" && customPrice) {
      addMessage(`₹${customPrice}`, "vendor");
      setCustomPrice("");
    } else {
      addMessage(response, "vendor");
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "user" ? styles.userContainer : styles.vendorContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.sender === "user" ? styles.userBubble : styles.vendorBubble,
        ]}
      >
        <Text
          style={item.sender === "user" ? styles.userText : styles.vendorText}
        >
          {item.message}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerText}>{negotiation.user}</Text>
          <Text style={styles.subHeaderText}>{negotiation.product}</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.infoButtonText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Quick Responses & Counter Offer */}
      <View style={styles.inputArea}>
        <View style={styles.quickResponseRow}>
          <TouchableOpacity
            style={[styles.quickResponseButton, { backgroundColor: "#4CAF50" }]}
            onPress={() => handleResponse("Yes")}
          >
            <Text style={[styles.quickResponseText, { color: "white" }]}>
              ✅ Accept
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickResponseButton, { backgroundColor: "#E74C3C" }]}
            onPress={() => handleResponse("No")}
          >
            <Text style={[styles.quickResponseText, { color: "white" }]}>
              ❌ Decline
            </Text>
          </TouchableOpacity>
        </View>

        {/* Price Counter Offer */}
        <View style={styles.priceInputContainer}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput
            style={styles.priceInput}
            value={customPrice}
            onChangeText={setCustomPrice}
            placeholder="Enter counter offer"
            placeholderTextColor="#95a5a6"
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: customPrice ? "#287344" : "#bdc3c7" },
            ]}
            onPress={() => handleResponse("custom")}
            disabled={!customPrice}
          >
            <Text style={styles.sendButtonText}>📩</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#287344",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  subHeaderText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  infoButtonText: {
    color: "white",
    fontSize: 20,
  },
  chatContainer: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 8,
  },
  userContainer: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  vendorContainer: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: 20,
    padding: 14,
  },
  userBubble: {
    backgroundColor: "#287344",
    borderBottomRightRadius: 4,
  },
  vendorBubble: {
    backgroundColor: "white",
    borderBottomLeftRadius: 4,
    elevation: 2,
  },
  userText: {
    color: "white",
    fontSize: 16,
  },
  vendorText: {
    color: "#2c3e50",
    fontSize: 16,
  },
  inputArea: {
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
  },
  quickResponseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  quickResponseButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  quickResponseText: {
    fontWeight: "500",
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "600",
    color: "#287344",
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    color: "#2c3e50",
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    fontSize: 20,
    color: "white",
  },
});

export default NegotiationChatScreen;
