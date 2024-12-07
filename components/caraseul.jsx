import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import Images from './SliderData';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

const Carousel = (props) => {
  const x = useSharedValue(0);
  const flatListRef = React.useRef(null);

  // Automated scrolling
  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = Math.round(x.value / props.itemWidth);
      const nextIndex = (currentIndex + 1) % data.length;
      flatListRef.current?.scrollTo({ x: nextIndex * props.itemWidth, animated: true });
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [x.value, props.itemWidth]);

  // Animated scroll handler
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  // Slider data
  const data = [
    { name: 'apple', description: 'A juicy apple' },
    { name: 'banana', description: 'A ripe banana' },
    { name: 'tomato', description: 'A ripe tomato' },
    { name: 'potato', description: 'A ripe potato' },
  ];

  return (
    <Animated.ScrollView
      ref={flatListRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      bounces={false}
      scrollEventThrottle={16}
      onScroll={onScroll}
    >
      {data.map((item, index) => (
        <View key={index} style={[styles.card, { width: props.itemWidth }]}>
          <View style={styles.container}>
            <Image style={styles.image} source={Images[item.name]} />
          </View>
          <TouchableOpacity
            onPress={() => {
              props.setCurr(index);
              console.log(props.curr);
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>SELECT</Text>
          </TouchableOpacity>
        </View>
      ))}
    </Animated.ScrollView>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    height: '80%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: 20,
    width: '100%',
    height: '80%',
    aspectRatio: 16 / 9,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#dce775',
    width: '80%',
    height: '16%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: '100%',
    width:'100%',
    backgroundColor: '#66bb6a',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
  },
});
