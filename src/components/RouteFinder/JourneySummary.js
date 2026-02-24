import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const JourneySummary = ({ time, fare, stationsCount }) => {
    const { t } = useTranslation();

    return (
        <View className="items-center w-full my-4 px-1">
            <View className="bg-white rounded-xl shadow-card p-4 w-full border border-gray-100">
                <Text className="text-center text-lg font-bold text-[#0B3D91] mb-3">
                    {t("JourneySummary.title", "Journey Summary")}
                </Text>

                <View className="space-y-3">
                    {/* Time */}
                    <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <View className="flex-row items-center space-x-2">
                            <FontAwesome5 name="clock" size={16} color="#0B3D91" />
                            <Text className="text-gray-700 font-semibold ml-2">
                                {t("JourneySummary.time", "Time")}:
                            </Text>
                        </View>
                        <Text className="text-gray-900 font-bold">
                            {time} {t("JourneySummary.minutes", "mins")}
                        </Text>
                    </View>

                    {/* Fare */}
                    <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <View className="flex-row items-center space-x-2">
                            <FontAwesome5 name="rupee-sign" size={16} color="#0B3D91" />
                            <Text className="text-gray-700 font-semibold ml-2">
                                {t("JourneySummary.fare", "Fare")}:
                            </Text>
                        </View>
                        <Text className="text-gray-900 font-bold">₹{fare}</Text>
                    </View>

                    {/* Stations */}
                    <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <View className="flex-row items-center space-x-2">
                            <FontAwesome5 name="subway" size={16} color="#0B3D91" />
                            <Text className="text-gray-700 font-semibold ml-2">
                                {t("JourneySummary.stations", "Stations")}:
                            </Text>
                        </View>
                        <Text className="text-gray-900 font-bold">{stationsCount}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default JourneySummary;
