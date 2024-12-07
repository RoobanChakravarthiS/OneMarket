import { StyleSheet, Image, View, Text, useWindowDimensions, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import pics from './pics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
} from 'react-native-reanimated';

const Slider = (props) => {

  const { width } = useWindowDimensions();
  const SIZE = width * 0.7;
  const spacer = (width - SIZE) / 2;
  const x = useSharedValue(0);
  const flatListRef = React.useRef(null);
  
  // Automated scrolling
  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = Math.round(x.value / SIZE);
      const nextIndex = (currentIndex + 1) % (data.length);
      flatListRef.current?.scrollTo({ x: nextIndex * SIZE, animated: true });
    }, 5000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [x.value, SIZE]);

  // Animated scroll handler
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  // Slider data
  const data = Object.keys(pics).map((key, index) => ({
    key: index.toString(),
    image: pics[key],
  }));

  // Add spacer items
  const newData = [{ key: 'spacer-left' }, ...data, { key: 'spacer-right' }];

  return (
    <Animated.ScrollView
      ref={flatListRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      bounces={false}
      scrollEventThrottle={33}
      snapToInterval={SIZE}
      decelerationRate="fast"
      onScroll={onScroll}
    >
      {newData.map((item, index) => {
        if (!item.image) {
          return <View style={{ width: spacer }} key={item.key} />;
        }

        const animatedStyle = useAnimatedStyle(() => {
          const scale = interpolate(
            x.value,
            [
              (index - 2) * SIZE,
              (index - 1) * SIZE,
              index * SIZE,
            ],
            [0.8, 1, 0.8]
          );
          return {
            transform: [{ scale }],
          };
        });

        return (
          <Animated.View key={item.key} style={[{ width: SIZE }, animatedStyle]}>
            <View style={styles.card}>
              <View style={styles.container}>
                <Image style={styles.image} source={item.image} />
              </View>
              <TouchableOpacity onPress={() =>  props.setCurr(index - 1) } style={styles.button}>
                <Text style={styles.buttonText}>SELECT</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        );
      })}
    </Animated.ScrollView>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    height: '80%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    borderRadius: 20,
    width: '30%',
    height: '80%',
    aspectRatio: 16 / 9,
  },
  button: {
    backgroundColor: '#fafdf4',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    height: '100%',
    width: '100%',
    backgroundColor: '#029429',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: "100%",
  },
});
