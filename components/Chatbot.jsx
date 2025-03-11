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
  Modal,
} from 'react-native';

const userAvatar = 'https://i.pravatar.cc/150?img=3';
const botAvatar = 'https://i.pravatar.cc/150?img=5';

const suggestedPrompts = [
  "நான் என் விளைபொருட்களை நியாயமான விலைக்கு விற்க முடியாமல் உள்ளேன். என்ன செய்யலாம்?",
  "எனது பயிர்களுக்கு நோய்கள் தாக்கியுள்ளது. நான் என்ன செய்யலாம்?",
  "நான் கால்நடைகளை வளர்க்க விரும்புகிறேன், ஆனால் எந்த இனத்தை தேர்வு செய்வது என்று தெரியவில்லை.",
  "நான் மண் பரிசோதனை செய்ய வேண்டும். அது எதற்காக முக்கியம்?"
];

const Chatbot = () => {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollViewRef = useRef();

  const handleSend = async (selectedPrompt) => {
    const message = selectedPrompt || prompt;
    if (message.trim() === '') return;

    setShowSuggestions(false); // Close suggestions modal when selecting one

    const userMessage = {
      type: 'user',
      text: message,
      timestamp: new Date(),
    };
    setConversation(prev => [...prev, userMessage]);
    setPrompt('');
    setIsTyping(true);

    try {
      const response = await fetch('https://f71d-43-250-42-50.ngrok-free.app/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: message }),
      });

      if (!response.ok) throw new Error('Network response was not ok.');

      const data = await response.json();
      console.log('API Response:', data);

      const botMessage = {
        type: 'bot',
        text: data.response || "Sorry, I don't understand that.",
        timestamp: new Date(),
      };
      setConversation(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('API Error:', error.message);
      setConversation(prev => [...prev, { type: 'bot', text: "Sorry, I couldn't process your request.", timestamp: new Date() }]);
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

      {/* Suggested Prompts Button */}
      <TouchableOpacity style={styles.suggestionsButton} onPress={() => setShowSuggestions(true)}>
        <Text style={styles.suggestionsButtonText}>Suggestions</Text>
      </TouchableOpacity>

      {/* Modal for Suggested Prompts */}
      <Modal visible={showSuggestions} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a question:</Text>
            {suggestedPrompts.map((item, index) => (
              <TouchableOpacity key={index} style={styles.suggestionItem} onPress={() => handleSend(item)}>
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowSuggestions(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView
        style={styles.chatContainer}
        ref={scrollViewRef}
        contentContainerStyle={styles.chatContent}
      >
        {conversation.map((msg, index) => (
          <View key={index} style={[styles.messageContainer, msg.type === 'user' ? styles.userMessage : styles.botMessage]}>
            {msg.type === 'bot' && <Image source={{ uri: botAvatar }} style={styles.avatar} />}
            <View style={styles.messageContent}>
              <Text style={styles.messageText}>{msg.text}</Text>
              <Text style={styles.timestamp}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            {msg.type === 'user' && <Image source={{ uri: userAvatar }} style={styles.avatar} />}
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
          placeholderTextColor="#000"
          multiline
          
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => handleSend()}>
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
  },
  headerTitle: {
    color: '#00796b',
    fontSize: 20,
    fontWeight: 'bold',
  },
  suggestionsButton: {
    backgroundColor: '#00796b',
    padding: 10,
    margin: 10,
    borderRadius: 20,
    alignSelf: 'center',
  },
  suggestionsButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  suggestionText:{
    color:'#000'
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
  },
  messageText: {
    color: '#000',
    fontSize: 16,
  },
  typingText: {
    color: '#000',
    fontSize: 14,
    marginTop: 5,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ddd',
    // backgroundColor: '#fff',
    padding: 10,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color:'#000'
  },
  sendButton: {
    backgroundColor: '#00796b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  closeButton: {
    backgroundColor: '#00796b',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
  },
});
