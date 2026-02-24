import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeInUp, Layout } from 'react-native-reanimated';

const StationCard = ({ station, t }) => {
    const isRedLine = station.line === "Red Line";
    const lineColor = isRedLine ? '#D32F2F' : '#1976D2';

    return (
        <Animated.View
            layout={Layout.springify()}
            entering={FadeInRight.duration(500)}
            className="w-full mb-3"
        >
            <View
                className="flex-row items-center justify-between p-4 bg-white rounded-xl shadow-card border-l-4"
                style={{ borderLeftColor: lineColor, borderRadius: 12 }}
            >
                <View className="flex-row items-center space-x-3">
                    <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center border border-gray-100">
                        <FontAwesome5 name="train" size={18} color={lineColor} />
                    </View>
                    <View className="ml-3">
                        <Text className="text-[#333333] font-bold text-lg">
                            {t ? t(`stations.${station.name}`, station.name) : station.name}
                        </Text>
                        {station.code && (
                            <Text className="text-gray-500 text-xs">{station.code}</Text>
                        )}
                    </View>
                </View>

                <View className="flex-row items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                    <Text className="text-gray-600 text-xs font-medium mr-1">
                        {station.line}
                    </Text>
                    <Ionicons name="chevron-forward" size={14} color="#9CA3AF" />
                </View>
            </View>
        </Animated.View>
    );
};

export default StationCard;
