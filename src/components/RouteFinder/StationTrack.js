import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';

const StationTrack = () => {
    const translateY = useSharedValue(0);

    useEffect(() => {
        translateY.value = withRepeat(
            withTiming(24, {
                duration: 2000,
                easing: Easing.inOut(Easing.quad)
            }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    return (
        <View className="items-center justify-center my-0 h-8 w-full relative overflow-hidden">
            {/* Simple Clean Track Line */}
            <View className="h-full w-[2px] bg-gray-200 rounded-full" />

            {/* Animated Direction Indicator (Subtle) */}
            <Animated.View
                style={[
                    animatedStyle,
                    {
                        position: 'absolute',
                        top: 0,
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#0B3D91',
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.2,
                        shadowRadius: 1.41,
                        elevation: 2,
                    }
                ]}
            />
        </View>
    );
};

export default StationTrack;
