import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInUp } from 'react-native-reanimated';
import api from '../../services/api';

import RouteForm from './RouteForm';
import JourneySummary from './JourneySummary';
import RouteStations from './RouteStations';

const RouteFinder = forwardRef(({ source, destination }, ref) => {
    const { t } = useTranslation();
    const [stations, setStations] = useState([]);
    const [selected, setSelected] = useState({
        source: source || "",
        destination: destination || "",
    });
    const [route, setRoute] = useState([]);
    const [journeyDetails, setJourneyDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useImperativeHandle(ref, () => ({
        triggerSearch: () => {
            getRoute();
        },
    }));

    useEffect(() => {
        setSelected({ source, destination });
        // Optional: Auto-search if props provided
        // if (source && destination) getRoute(); 
    }, [source, destination]);

    useEffect(() => {
        fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
            const response = await api.get("/stations");
            setStations(response.data);
        } catch (err) {
            console.error("Failed to fetch stations:", err);
            setError("Failed to load stations. Please check your connection.");
        }
    };

    const fetchJourneyDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const [routeRes, timeRes, fareRes] = await Promise.all([
                api.get(`/stations/route?source=${selected.source}&destination=${selected.destination}`),
                api.get(`/estimated-time?source=${selected.source}&destination=${selected.destination}`),
                api.get(`/fare?source=${selected.source}&destination=${selected.destination}`),
            ]);

            const details = {
                route: routeRes.data,
                time: Math.round(timeRes.data.estimated_time_minutes),
                fare: fareRes.data,
                stationsCount: Math.max(routeRes.data.length - 1, 0),
            };

            setRoute(details.route);
            setJourneyDetails({
                time: details.time,
                fare: details.fare,
                stationsCount: details.stationsCount,
            });
        } catch (error) {
            console.error("Error finding route:", error);
            setError("Failed to calculate route. Please try again.");
            Alert.alert("Error", "Failed to calculate route. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getRoute = () => {
        if (!selected.source || !selected.destination) {
            Alert.alert("Invalid Selection", "Please select both source and destination stations.");
            return;
        }
        fetchJourneyDetails();
    };

    const handleSelect = (field, value) => {
        setSelected((prev) => ({ ...prev, [field]: value }));
        setJourneyDetails(null);
        setRoute([]);
        setError(null);
    };

    const reverseRoute = () => {
        setSelected((prev) => ({
            source: prev.destination,
            destination: prev.source,
        }));
        setJourneyDetails(null);
        setRoute([]);
        setError(null);
    };

    return (
        <View style={{ minHeight: 280 }}>
            {/* Header Banner Placeholder - Removed for clean look */}

            <Animated.View entering={FadeInUp.delay(200).duration(500)}>
                {/* Error Message Display */}
                {error && (
                    <View className="mb-4 p-4 bg-red-100 rounded-lg border border-red-200">
                        <Text className="text-red-700 font-medium text-center">{error}</Text>
                    </View>
                )}

                <RouteForm
                    stations={stations}
                    selected={selected}
                    loading={loading}
                    onSelectChange={handleSelect}
                    onFindRoute={getRoute}
                    onReverseRoute={reverseRoute}
                />

                {journeyDetails && !loading && (
                    <JourneySummary
                        time={journeyDetails.time}
                        fare={journeyDetails.fare}
                        stationsCount={journeyDetails.stationsCount}
                    />
                )}

                {route.length > 0 && !loading && (
                    <RouteStations route={route} />
                )}
            </Animated.View>
        </View>
    );
});

export default RouteFinder;
