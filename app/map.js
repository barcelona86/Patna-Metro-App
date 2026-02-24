import React, { useState } from 'react';
import { View, Image, Text, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
    const [isLoading, setIsLoading] = useState(true);

    // Zoom and pan values
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    // Pinch to zoom
    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
            if (scale.value < 1) {
                scale.value = withSpring(1);
                savedScale.value = 1;
            } else if (scale.value > 3) {
                scale.value = withSpring(3);
                savedScale.value = 3;
            } else {
                savedScale.value = scale.value;
            }
        });

    // Pan to move
    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = savedTranslateX.value + e.translationX;
            translateY.value = savedTranslateY.value + e.translationY;
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    // Double tap to reset
    const doubleTapGesture = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            scale.value = withSpring(1);
            savedScale.value = 1;
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
            savedTranslateX.value = 0;
            savedTranslateY.value = 0;
        });

    // Combine gestures
    const composed = Gesture.Simultaneous(pinchGesture, panGesture, doubleTapGesture);

    // Animated style
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value }
        ]
    }));

    // Reset function
    const resetMap = () => {
        scale.value = withSpring(1);
        savedScale.value = 1;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
    };

    return (
        <View className="flex-1 bg-gray-100">
            {/* Map Container */}
            <View className="flex-1 overflow-hidden">
                <GestureDetector gesture={composed}>
                    <Animated.View style={[animatedStyle, { width: '100%', height: '100%' }]}>
                        <View style={{ width: '100%', height: '100%' }}>
                            {isLoading && (
                                <View className="absolute inset-0 justify-center items-center z-10 bg-white/80">
                                    <ActivityIndicator size="large" color="#0B3D91" />
                                    <Text className="text-[#0B3D91] mt-2 font-medium">Loading Map...</Text>
                                </View>
                            )}
                            <Image
                                source={require('../assets/images/PatnaMap.webp')}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="contain"
                                onLoadStart={() => setIsLoading(true)}
                                onLoadEnd={() => setIsLoading(false)}
                            />
                        </View>
                    </Animated.View>
                </GestureDetector>

                {/* Only Reset Button - No Zoom Indicator */}
                <TouchableOpacity
                    onPress={resetMap}
                    className="absolute top-10 right-4 bg-white p-3 rounded-full shadow-lg"
                    style={{ elevation: 5 }}
                >
                    <MaterialCommunityIcons name="refresh" size={24} color="#0B3D91" />
                </TouchableOpacity>
            </View>

            {/* Simple Instructions - No Legend */}
            <View className="bg-white py-3 px-4 border-t border-gray-200">
                <Text className="text-xs text-gray-500 text-center">
                    Double tap to reset • Pinch to zoom
                </Text>
            </View>
        </View>
    );
};

export default MapScreen;