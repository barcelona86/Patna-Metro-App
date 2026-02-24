import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import StationCard from './StationCard';
import StationTrack from './StationTrack';
import InterchangeIcon from '../metro/InterchangeIcon';

const RouteStations = ({ route }) => {
    const { t } = useTranslation();

    console.log("Route Stations received:", route?.length);

    if (!route || route.length === 0) return null;

    return (
        <View className="mt-8 px-4 w-full pb-10">
            <Text className="text-xl font-bold mb-6 text-center text-gray-800">
                {t("routeStations.title", "Your Journey Route")}
            </Text>

            <View className="items-center w-full">
                {route.map((station, index) => {
                    const nextStation = route[index + 1];
                    const isInterchange = nextStation && station.line !== nextStation.line;

                    return (
                        <View key={index} className="w-full flex items-center">
                            {/* Station Card */}
                            <StationCard
                                station={station}
                                t={t}
                            />

                            {/* Interchange Indicator */}
                            {isInterchange && (
                                <View className="flex-col items-center my-2">
                                    <InterchangeIcon size={32} animated={false} />
                                    <Text className="text-xs font-bold text-yellow-700 mt-1 bg-yellow-100 px-2 py-0.5 rounded-md">
                                        Interchange to {nextStation.line}
                                    </Text>
                                </View>
                            )}

                            {/* Track Connector (if not last station) */}
                            {index < route.length - 1 && (
                                <StationTrack />
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default RouteStations;
