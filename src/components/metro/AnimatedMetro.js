import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, Dimensions, StyleSheet } from 'react-native';
import AnimatedTrainComponent from './AnimatedTrainComponent';
import StaticTrackSvg from './StaticTrackSvg';

const { width } = Dimensions.get('window');

const AnimatedMetro = () => {
    // Metro train width is modeled at ~800.
    // We want the train to spawn purely off-screen left (-800) and completely traverse out of screen right (`width` boundary).
    const trainWidth = 800;

    // Position Ref
    const translateX = useRef(new Animated.Value(-trainWidth)).current;



    useEffect(() => {
        const loopForwardAndBackward = () => {
            Animated.sequence([
                // First pass: Move Right off-screen
                Animated.timing(translateX, {
                    toValue: width,
                    duration: 7000,
                    easing: Easing.inOut(Easing.ease), // Smooth gentle acceleration/deceleration
                    useNativeDriver: true,
                }),

                // Second Pass: Move Left recursively off-screen backward (Without Flipping)
                Animated.timing(translateX, {
                    toValue: -trainWidth,
                    duration: 7000,
                    easing: Easing.inOut(Easing.ease), // Smooth ease for reversing speed
                    useNativeDriver: true,
                }),
            ]).start(({ finished }) => {
                if (finished) {
                    loopForwardAndBackward(); // Trigger perpetual loop smoothly
                }
            });
        };

        loopForwardAndBackward();

        // Cleanup
        return () => {
            translateX.stopAnimation();
        };
    }, [translateX]);

    return (
        <View style={styles.container}>
            {/* Animated Train Layer */}
            <Animated.View
                style={[
                    styles.trainWrapper,
                    {
                        transform: [
                            { translateX }     // Lateral Movement Only
                        ]
                    }
                ]}
            >
                {/* Responsive Train Element */}
                <AnimatedTrainComponent />
            </Animated.View>

            {/* Absolute Placed Static Track (Underneath visually) */}
            <View style={styles.trackWrapper}>
                <StaticTrackSvg />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 80, // Reduced container height
        overflow: 'hidden',
        justifyContent: 'flex-end',
        position: 'relative',
        backgroundColor: 'transparent',
    },
    trainWrapper: {
        position: 'absolute',
        top: 0,
        height: 70, // Matches height footprint of exactly the train SVG box
        width: 800, // Matching mapped width mapping tightly to its internal coordinates
    },
    trackWrapper: {
        width: '100%',
        height: 20, // Lower end profile just for the Track
        position: 'absolute',
        bottom: 0,
    }
});

export default AnimatedMetro;
