import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native"
import { negotiations } from "./dummyData"

const NegotiationListScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate("NegotiationChat", { negotiation: item })}
      activeOpacity={0.7} // Smooth touch effect
    >
      <Image source={require('./profile.png')} style={styles.avatar} />
      <View style={styles.itemInfo}>
        <Text style={styles.userName}>{item.user}</Text>
        <Text style={styles.productName}>{item.product}</Text>
      </View>
      <Text style={styles.price}>₹{item.negotiatedPrice || item.initialPrice}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Enhanced Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Negotiations</Text>
      </View>

      <FlatList 
        data={negotiations} 
        renderItem={renderItem} 
        keyExtractor={(item) => item.id.toString()} 
        contentContainerStyle={styles.listContent} 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  // Header Styling
  headerContainer: {
    backgroundColor: "#287344",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },

  // List & Item Styling
  listContent: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },

  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },

  userName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#2c3e50",
  },
  productName: {
    fontSize: 14,
    color: "#7f8c8d",
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#287344",
  },
})

export default NegotiationListScreen
