import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    cancelAnimation
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const InterchangeIcon = ({ size = 40, onClick, animated = true }) => {
    const rotation = useSharedValue(0);

    useEffect(() => {
        if (animated) {
            rotation.value = withRepeat(
                withTiming(360, {
                    duration: 1500,
                    easing: Easing.linear
                }),
                -1,
                false
            );
        } else {
            cancelAnimation(rotation);
            rotation.value = 0;
        }
    }, [animated]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    return (
        <TouchableOpacity
            onPress={onClick}
            activeOpacity={0.8}
            className="items-center justify-center rounded-full bg-yellow-400 border-2 border-yellow-600 shadow-sm"
            style={{ width: size, height: size }}
        >
            <Animated.View style={animated ? animatedStyle : {}}>
                <MaterialCommunityIcons name="swap-horizontal" size={size * 0.6} color="black" />
            </Animated.View>
        </TouchableOpacity>
    );
};

export default InterchangeIcon;
