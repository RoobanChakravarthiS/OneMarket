import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Auction = ({navigation,route}) => {
  const userId = route.params.userId;
  const username = route.params.username
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.displayCard} onPress={()=>navigation.navigate('auctionBuy',{userId,username})}><Text style={styles.text}>Buy Commodities</Text></TouchableOpacity>
      <TouchableOpacity style={styles.displayCard} onPress={()=>navigation.navigate('hostselect' ,{userId,username})}><Text style={styles.text}>Sell Commodities</Text></TouchableOpacity>
    </View>
  )
}

export default Auction;

const styles = StyleSheet.create({
  container:{
      flex:1,
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'#f0fdf4',
      gap:30
      
  },
  displayCard:{
      backgroundColor:'#66bb6a',
      width:'90%',
      height:'25%',
      borderRadius:10,
      elevation:10,
      alignItems:'center',
      justifyContent:'center',
      
  },
  text:{
    fontSize:30,
    fontWeight:'bold',
    fontStyle:'italic'
  }
})