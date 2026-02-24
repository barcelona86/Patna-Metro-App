import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import RouteFinder from '../src/components/RouteFinder';
import Footer from '../src/components/ui/Footer';
import AnimatedMetro from '../src/components/metro/AnimatedMetro';

const RouteFinderScreen = () => {
    const { source, destination } = useLocalSearchParams();
    const { t } = useTranslation();

    return (
        <ScrollView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white pt-6 pb-4 items-center justify-center shadow-sm border-b border-gray-200">
                <View style={{
                    height: 80,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white'
                }}>
                    <AnimatedMetro />
                </View>
            </View>

            {/* Route Finder Component */}
            <View className="px-4 -mt-2">
                <Text className="text-2xl font-bold text-[#0B3D91] mb-3 mt-4">
                    {t('home.planJourney', 'Find Your Route')}
                </Text>
                <RouteFinder source={source} destination={destination} />
            </View>

            {/* Service Timings Card */}
            <View className="px-4 mt-8">
                <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <View className="flex-row items-center mb-4 border-b border-gray-100 pb-3">
                        <MaterialCommunityIcons name="clock-outline" size={24} color="#0B3D91" />
                        <Text className="text-[#0B3D91] text-lg font-bold ml-2">
                            {t('serviceTimings')}
                        </Text>
                    </View>

                    <View className="flex-row justify-between items-center py-2">
                        <Text className="text-gray-600 font-medium text-base">{t('firstTrain')}</Text>
                        <Text className="text-gray-900 font-bold text-base">6:00 AM</Text>
                    </View>

                    <View className="flex-row justify-between items-center py-2 border-t border-gray-50">
                        <Text className="text-gray-600 font-medium text-base">{t('lastTrain')}</Text>
                        <Text className="text-gray-900 font-bold text-base">10:30 PM</Text>
                    </View>

                    <View className="flex-row justify-between items-center py-2 border-t border-gray-50">
                        <Text className="text-gray-600 font-medium text-base">{t('frequency')}</Text>
                        <Text className="text-[#1976D2] font-semibold text-base py-1 px-3 bg-blue-50 rounded-lg">
                            5–7 {t('mins')}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Interchange Info Section */}
            <View className="px-4 mt-6">
                <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <View className="flex-row items-center mb-4 border-b border-gray-100 pb-3">
                        <MaterialCommunityIcons name="transit-connection-variant" size={24} color="#0B3D91" />
                        <Text className="text-[#0B3D91] text-lg font-bold ml-2">
                            {t('keyInterchanges')}
                        </Text>
                    </View>

                    {/* Patna Junction */}
                    <View className="flex-row items-start py-3">
                        <View className="mt-1 mr-3 h-8 w-8 rounded-full bg-blue-50 items-center justify-center">
                            <MaterialCommunityIcons name="train-variant" size={18} color="#0B3D91" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 font-bold text-base mb-1">{t('stations.Patna Junction')}</Text>
                            <View className="flex-row items-center">
                                <View className="h-3 w-3 rounded-full bg-[#1976D2]" />
                                <Text className="text-gray-600 text-xs ml-1 mr-2 font-medium">{t('blueLine')}</Text>
                                <MaterialCommunityIcons name="swap-horizontal" size={16} color="#9ca3af" />
                                <View className="h-3 w-3 rounded-full bg-[#D32F2F] ml-2" />
                                <Text className="text-gray-600 text-xs ml-1 font-medium">{t('redLine')}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Khemnichak */}
                    <View className="flex-row items-start py-3 border-t border-gray-50">
                        <View className="mt-1 mr-3 h-8 w-8 rounded-full bg-blue-50 items-center justify-center">
                            <MaterialCommunityIcons name="subway-variant" size={18} color="#0B3D91" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 font-bold text-base mb-1">{t('stations.Khemni Chak')}</Text>
                            <View className="flex-row items-center">
                                <View className="h-3 w-3 rounded-full bg-[#1976D2]" />
                                <Text className="text-gray-600 text-xs ml-1 mr-2 font-medium">{t('blueLine')}</Text>
                                <MaterialCommunityIcons name="swap-horizontal" size={16} color="#9ca3af" />
                                <View className="h-3 w-3 rounded-full bg-[#D32F2F] ml-2" />
                                <Text className="text-gray-600 text-xs ml-1 font-medium">{t('redLine')}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Patna Metro - Key Stats Section */}
            <View className="px-4 mt-6">
                <Text className="text-lg font-bold text-gray-800 mb-3">
                    {t('metroStats.title')}
                </Text>

                {/* Elevated vs Underground Cards */}
                <View className="flex-row flex-wrap justify-between mb-4">
                    <View className="w-[48%] bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <View className="flex-row items-center mb-2">
                            <MaterialCommunityIcons name="arrow-up-bold-circle" size={22} color="#D97706" />
                            <Text className="text-amber-800 font-bold text-base ml-1">{t('metroStats.elevated')}</Text>
                        </View>
                        <Text className="text-gray-900 font-bold text-2xl">13</Text>
                        <Text className="text-gray-600 text-xs">{t('metroStats.stations')}</Text>
                    </View>

                    <View className="w-[48%] bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <View className="flex-row items-center mb-2">
                            <MaterialCommunityIcons name="arrow-down-bold-circle" size={22} color="#0B3D91" />
                            <Text className="text-blue-800 font-bold text-base ml-1">{t('metroStats.underground')}</Text>
                        </View>
                        <Text className="text-gray-900 font-bold text-2xl">13</Text>
                        <Text className="text-gray-600 text-xs">{t('metroStats.stations')}</Text>
                    </View>
                </View>

                {/* Total Stats */}
                <View className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-gray-500 text-xs">{t('metroStats.totalStations')}</Text>
                            <Text className="text-gray-900 font-bold text-xl">26</Text>
                        </View>
                        <View>
                            <Text className="text-gray-500 text-xs">{t('metroStats.totalLength')}</Text>
                            <Text className="text-gray-900 font-bold text-xl">32.5 {t('metroStats.km')}</Text>
                        </View>
                        <View>
                            <Text className="text-gray-500 text-xs">{t('metroStats.corridors')}</Text>
                            <Text className="text-gray-900 font-bold text-xl">2</Text>
                        </View>
                    </View>
                </View>

                {/* Busiest & Famous Stations */}
                <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
                    <View className="flex-row items-center mb-4 border-b border-gray-100 pb-3">
                        <MaterialCommunityIcons name="star-circle" size={24} color="#F59E0B" />
                        <Text className="text-[#0B3D91] text-lg font-bold ml-2">
                            {t('metroStats.busiestStations')}
                        </Text>
                    </View>

                    {['Patna Junction', 'Gandhi Maidan', 'PMCH', 'Patna Zoo', 'New ISBT'].map((station, index) => (
                        <View key={index} className={`flex-row items-start py-2 ${index > 0 ? 'border-t border-gray-50' : ''}`}>
                            <View className="mt-1 mr-3 h-7 w-7 rounded-full bg-blue-50 items-center justify-center">
                                <MaterialCommunityIcons name="train" size={16} color="#0B3D91" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-bold text-base">
                                    {t(`stations.${station}`)}
                                </Text>
                                <Text className="text-gray-500 text-xs">
                                    {t(`stationsDesc.${station.replace(/\s+/g, '')}`)}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            <Footer />
        </ScrollView>
    );
};

export default RouteFinderScreen;