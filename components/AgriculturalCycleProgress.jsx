import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ProgressBarAndroid,
  ProgressViewIOS,
  Platform,
} from 'react-native';


import { Image } from 'react-native-animatable';

const COLORS = {
  primaryGreen: '#287344',
  lightGray: '#F9F9F9',
  textDark: '#333',
  textMedium: '#666',
  textLight: '#777',
};

const FONTS = {
  title: 20,
  cycleName: 18,
  stage: 14,
  progressText: 12,
};

const AgriculturalCycleProgress = ({ crop }) => {
  const cycleName = crop.name || 'Agricultural Cycle';
  const currentStage =  crop.current_stage;
  const progress =  crop.progress;

  const isComplete = progress === 1;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={require('./feather.png') } style={{height:'24px',width:'24px',marginRight:'8px' }} tintColor={COLORS.primaryGreen}/>
        <Text style={styles.title}>Agricultural Cycle</Text>
      </View>
      <Text style={styles.cycleName}>{cycleName}</Text>
      <Text style={styles.stage}>Current Stage: {currentStage}</Text>

      {Platform.OS === 'android' ? (
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={progress}
          color={COLORS.primaryGreen}
          style={styles.progressBarAndroid}
        />
      ) : (
        <ProgressViewIOS
          progress={progress}
          progressTintColor={COLORS.primaryGreen}
          style={styles.progressBarIOS}
        />
      )}

      <View style={styles.progressTextContainer}>
        <Text style={styles.progressText}>
          {Math.round(progress * 100)}% Complete
        </Text>
        {/* {isComplete && (
          <Ionicons name="checkmark-circle" size={20} color="green" />
        )} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: FONTS.title,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  cycleName: {
    fontSize: FONTS.cycleName,
    color: COLORS.primaryGreen,
    marginBottom: 5,
    textAlign: 'center',
  },
  stage: {
    fontSize: FONTS.stage,
    color: COLORS.textMedium,
    marginBottom: 10,
    textAlign: 'center',
  },
  progressBarAndroid: {
    height: 10,
    borderRadius: 5,
  },
  progressBarIOS: {
    height: 10,
    borderRadius: 5,
  },
  progressTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  progressText: {
    fontSize: FONTS.progressText,
    color: COLORS.textLight,
    textAlign: 'center',
    marginRight: 5,
  },
});

export default AgriculturalCycleProgress;
