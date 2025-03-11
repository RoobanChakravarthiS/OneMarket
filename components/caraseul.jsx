import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import Images from './SliderData';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  withTiming,
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
      {data.map((item, index) => {
        // Animated styles for each card
        const cardStyle = useAnimatedStyle(() => {
          const scale = interpolate(
            x.value,
            [
              (index - 1) * props.itemWidth,
              index * props.itemWidth,
              (index + 1) * props.itemWidth,
            ],
            [0.9, 1, 0.9],
            'clamp'
          );
          const opacity = interpolate(
            x.value,
            [
              (index - 1) * props.itemWidth,
              index * props.itemWidth,
              (index + 1) * props.itemWidth,
            ],
            [0.5, 1, 0.5],
            'clamp'
          );
          return {
            transform: [{ scale: withTiming(scale, { duration: 300 }) }],
            opacity: withTiming(opacity, { duration: 300 }),
          };
        });

        return (
          <Animated.View key={index} style={[styles.card, cardStyle, { width: props.itemWidth }]}>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={Images[item.name]} />
              <View style={styles.overlay}>
                <Text style={styles.description}>{item.description}</Text>
              </View>
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
          </Animated.View>
        );
      })}
    </Animated.ScrollView>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  card: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '80%',
    borderRadius: 25,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
  },
  description: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    width: '80%',
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});