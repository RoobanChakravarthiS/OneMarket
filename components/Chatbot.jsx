import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const userAvatar = 'https://i.pravatar.cc/150?img=3'; // Replace with your user avatar URL
const botAvatar = 'https://i.pravatar.cc/150?img=5'; // Replace with your bot avatar URL

const Chatbot = () => {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  const handleSend = async () => {
    if (prompt.trim() === '') return;

    // Add user message to the conversation
    const userMessage = {
        type: 'user',
        text: prompt,
        timestamp: new Date(),
    };
    setConversation((prev) => [...prev, userMessage]);
    setPrompt('');
    setIsTyping(true);

    try {
      const response = await fetch("https://340e-65-2-93-96.ngrok-free.app/generate", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);  // Log the API response to check its format

      const botMessage = {
        type: 'bot',
        text: data.generated_text || "Sorry, I don't understand that.",
        timestamp: new Date(),
      };
      setConversation((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('API Error:', error.message);
      const errorMessage = {
        type: 'bot',
        text: "Sorry, I don't understand that.",
        timestamp: new Date(),
      };
      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [conversation, isTyping]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chatbot</Text>
      </View>
      <ScrollView
        style={styles.chatContainer}
        ref={scrollViewRef}
        contentContainerStyle={styles.chatContent}
      >
        {conversation.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              msg.type === 'user' ? styles.userMessage : styles.botMessage,
            ]}
          >
            {msg.type === 'bot' && (
              <Image source={{ uri: botAvatar }} style={styles.avatar} />
            )}
            <View style={styles.messageContent}>
              <Text style={styles.messageText}>{msg.text}</Text>
              <Text style={styles.timestamp}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            {msg.type === 'user' && (
              <Image source={{ uri: userAvatar }} style={styles.avatar} />
            )}
          </View>
        ))}
        {isTyping && (
          <View style={[styles.messageContainer, styles.botMessage]}>
            <Image source={{ uri: botAvatar }} style={styles.avatar} />
            <View style={styles.messageContent}>
              <ActivityIndicator size="small" color="#555" />
              <Text style={styles.typingText}>Bot is typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    color: '#00796b',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chatContent: {
    paddingVertical: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  messageContent: {
    maxWidth: '70%',
    backgroundColor: '#e1ffc7',
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessageContent: {
    backgroundColor: '#0084ff',
  },
  messageText: {
    color: '#333',
    fontSize: 16,
  },
  typingText: {
    color: '#555',
    fontSize: 14,
    marginTop: 5,
  },
  timestamp: {
    position: 'absolute',
    bottom: -15,
    right: 10,
    fontSize: 10,
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    color: '#333',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#00796b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});