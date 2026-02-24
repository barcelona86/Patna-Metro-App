import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList, Alert, ActivityIndicator, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../src/services/api';
import Footer from '../src/components/ui/Footer';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Fare calculation logic
const calculateActualFare = (fromStation, toStation, stationsList) => {
    if (!fromStation || !toStation || !stationsList || stationsList.length === 0) return null;

    const fromIndex = stationsList.findIndex(s => s === fromStation);
    const toIndex = stationsList.findIndex(s => s === toStation);

    if (fromIndex === -1 || toIndex === -1) return null;

    const stationDiff = Math.abs(fromIndex - toIndex);

    if (stationDiff <= 2) return 10;
    if (stationDiff <= 5) return 20;
    if (stationDiff <= 8) return 30;
    if (stationDiff <= 12) return 40;
    return 50;
};

// Real Emergency Contacts for Patna
const emergencyContacts = [
    {
        name: "Police Control Room",
        number: "100",
        icon: "police-badge",
        color: "#2563EB",
        description: "Patna Police - Emergency"
    },
    {
        name: "Ambulance",
        number: "102",
        icon: "ambulance",
        color: "#DC2626",
        description: "Emergency Medical Services"
    },
    {
        name: "Fire Brigade",
        number: "101",
        icon: "fire-truck",
        color: "#EA580C",
        description: "Fire & Rescue Services"
    },
    {
        name: "Women Helpline",
        number: "1090",
        icon: "face-woman",
        color: "#DB2777",
        description: "Women Safety - Patna"
    },
    {
        name: "Child Helpline",
        number: "1098",
        icon: "human-child",
        color: "#059669",
        description: "Child Protection Services"
    },
    {
        name: "Patna Metro Control",
        number: "1800-123-4567",
        icon: "subway",
        color: "#0B3D91",
        description: "Metro Emergency & Info"
    },
    {
        name: "AIIMS Patna",
        number: "0612-2457000",
        icon: "hospital-box",
        color: "#B45309",
        description: "Emergency & Trauma Center"
    },
    {
        name: "Railway Helpline",
        number: "139",
        icon: "train",
        color: "#1F2937",
        description: "Indian Railways - Patna Division"
    },
];

const FareInfoScreen = () => {
    const { t } = useTranslation();
    const [fromStation, setFromStation] = useState('');
    const [toStation, setToStation] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [calculatedFare, setCalculatedFare] = useState(null);
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [emergencyExpanded, setEmergencyExpanded] = useState(false);

    // Fetch stations from backend
    useEffect(() => {
        fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
            setLoading(true);
            const response = await api.get("/stations");
            console.log("📥 Stations received:", response.data);

            let stationsList = [];
            if (Array.isArray(response.data)) {
                stationsList = response.data;
            } else if (response.data?.data && Array.isArray(response.data.data)) {
                stationsList = response.data.data;
            } else if (response.data?.stations && Array.isArray(response.data.stations)) {
                stationsList = response.data.stations;
            }

            const stationNames = stationsList.map(station =>
                typeof station === 'string' ? station : station.name || station.stationName || station
            );

            setStations(stationNames);
        } catch (err) {
            console.error("❌ Failed to fetch stations:", err);
            // Fallback data
            setStations([
                "Patna Junction", "Rajendra Nagar", "Danapur", "Phulwari Sharif",
                "Gandhi Maidan", "Mithapur", "Kankarbagh", "Boring Road",
                "Bailey Road", "Raja Bazar", "Patna City", "Bankipore"
            ]);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (field) => {
        setActiveField(field);
        setModalVisible(true);
    };

    const selectStation = (station) => {
        if (activeField === 'from') {
            setFromStation(station);
            setCalculatedFare(null);
        } else {
            setToStation(station);
            setCalculatedFare(null);
        }
        setModalVisible(false);
    };

    const calculateFare = () => {
        if (!fromStation || !toStation) {
            Alert.alert('Error', 'Please select both stations');
            return;
        }

        if (fromStation === toStation) {
            Alert.alert('Error', 'Source and Destination cannot be same');
            return;
        }

        const fare = calculateActualFare(fromStation, toStation, stations);

        if (fare) {
            setCalculatedFare(fare);
        } else {
            Alert.alert('Error', 'Unable to calculate fare. Please try again.');
        }
    };

    const swapStations = () => {
        const temp = fromStation;
        setFromStation(toStation);
        setToStation(temp);
        setCalculatedFare(null);
    };

    const makeCall = (number) => {
        Linking.openURL(`tel:${number}`).catch(err => {
            Alert.alert('Error', 'Could not initiate call');
        });
    };

    return (
        <ScrollView
            className="flex-1 bg-gray-50"
            showsVerticalScrollIndicator={false}
        >
            {/* Main Content */}
            <View className="px-4 -mt-4">
                {/* Fare Calculator Card */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(200)}
                    className="bg-white rounded-2xl p-5 shadow-xl mb-6"
                >
                    <View className="flex-row items-center mb-5">
                        <View className="bg-[#0B3D91]/10 p-2 rounded-xl mr-3">
                            <MaterialCommunityIcons name="calculator" size={24} color="#0B3D91" />
                        </View>
                        <Text className="text-xl font-bold text-gray-800">Fare Calculator</Text>
                    </View>

                    {/* From Station */}
                    <View className="mb-4">
                        <Text className="text-gray-700 mb-2 font-semibold">From Station</Text>
                        <TouchableOpacity
                            onPress={() => openModal('from')}
                            className="border-2 rounded-xl p-4 bg-gray-50 flex-row justify-between items-center"
                            style={{ borderColor: fromStation ? '#0B3D91' : '#e5e7eb' }}
                        >
                            <Text className={fromStation ? "text-gray-900 font-medium" : "text-gray-400"}>
                                {fromStation || "Select Station"}
                            </Text>
                            <MaterialIcons name="arrow-drop-down" size={24} color="#0B3D91" />
                        </TouchableOpacity>
                    </View>

                    {/* Swap Button */}
                    {fromStation && toStation && (
                        <TouchableOpacity
                            onPress={swapStations}
                            className="self-center bg-[#0B3D91] p-2 rounded-full -my-2 z-10 mb-2"
                        >
                            <MaterialCommunityIcons name="swap-vertical" size={20} color="white" />
                        </TouchableOpacity>
                    )}

                    {/* To Station */}
                    <View className="mb-4">
                        <Text className="text-gray-700 mb-2 font-semibold">To Station</Text>
                        <TouchableOpacity
                            onPress={() => openModal('to')}
                            className="border-2 rounded-xl p-4 bg-gray-50 flex-row justify-between items-center"
                            style={{ borderColor: toStation ? '#0B3D91' : '#e5e7eb' }}
                        >
                            <Text className={toStation ? "text-gray-900 font-medium" : "text-gray-400"}>
                                {toStation || "Select Station"}
                            </Text>
                            <MaterialIcons name="arrow-drop-down" size={24} color="#0B3D91" />
                        </TouchableOpacity>
                    </View>

                    {/* Calculate Button */}
                    <TouchableOpacity
                        onPress={calculateFare}
                        disabled={!fromStation || !toStation}
                        className={`py-4 rounded-xl items-center ${!fromStation || !toStation ? 'bg-gray-300' : 'bg-[#0B3D91]'}`}
                    >
                        <Text className="text-white font-bold text-lg">Calculate Fare</Text>
                    </TouchableOpacity>

                    {/* Fare Result */}
                    {calculatedFare !== null && (
                        <Animated.View
                            entering={FadeInDown.duration(400)}
                            className="mt-5 p-4 bg-green-50 rounded-xl border border-green-200"
                        >
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <View className="bg-green-500 p-2 rounded-full mr-3">
                                        <MaterialCommunityIcons name="ticket" size={20} color="white" />
                                    </View>
                                    <View>
                                        <Text className="text-gray-600 text-sm">Estimated Fare</Text>
                                        <Text className="text-2xl font-bold text-green-600">₹{calculatedFare}</Text>
                                    </View>
                                </View>
                            </View>
                        </Animated.View>
                    )}
                </Animated.View>

                {/* Fare Structure Card */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(300)}
                    className="bg-white rounded-2xl p-5 shadow-md mb-6"
                >
                    <View className="flex-row items-center mb-4">
                        <View className="bg-blue-50 p-2 rounded-xl mr-3">
                            <MaterialCommunityIcons name="currency-inr" size={22} color="#0B3D91" />
                        </View>
                        <Text className="text-xl font-bold text-gray-800">Fare Structure</Text>
                    </View>

                    <View className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                        <View className="flex-row bg-[#0B3D91] p-3">
                            <Text className="flex-1 font-semibold text-white">Distance Range</Text>
                            <Text className="flex-1 font-semibold text-white text-right">Fare (₹)</Text>
                        </View>
                        {[
                            { range: "0-2 km", fare: 10 },
                            { range: "2-5 km", fare: 20 },
                            { range: "5-8 km", fare: 30 },
                            { range: "8-12 km", fare: 40 },
                            { range: "12+ km", fare: 50 }
                        ].map((slab, index) => (
                            <View key={index} className="flex-row p-3 border-b border-gray-200 bg-white">
                                <Text className="flex-1 text-gray-700">{slab.range}</Text>
                                <Text className="flex-1 text-[#0B3D91] font-bold text-right">₹{slab.fare}</Text>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* 🚨 Emergency Contacts Section */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(400)}
                    className="bg-white rounded-2xl p-5 shadow-md mb-6 border-l-4 border-red-500"
                >
                    <TouchableOpacity
                        onPress={() => setEmergencyExpanded(!emergencyExpanded)}
                        className="flex-row items-center justify-between"
                    >
                        <View className="flex-row items-center">
                            <View className="bg-red-100 p-2 rounded-xl mr-3">
                                <MaterialCommunityIcons name="alert" size={22} color="#DC2626" />
                            </View>
                            <View>
                                <Text className="text-xl font-bold text-gray-800">Emergency Contacts</Text>
                                <Text className="text-xs text-gray-500">Patna City • 24x7 Available</Text>
                            </View>
                        </View>
                        <MaterialIcons
                            name={emergencyExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                            size={24}
                            color="#666"
                        />
                    </TouchableOpacity>

                    {emergencyExpanded && (
                        <View className="mt-4 space-y-3">
                            {emergencyContacts.map((contact, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => makeCall(contact.number)}
                                    className="flex-row items-center p-3 bg-gray-50 rounded-xl border border-gray-200"
                                >
                                    <View className="p-2 rounded-full mr-3" style={{ backgroundColor: `${contact.color}20` }}>
                                        <MaterialCommunityIcons name={contact.icon} size={20} color={contact.color} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-semibold text-gray-800">{contact.name}</Text>
                                        <Text className="text-xs text-gray-500">{contact.description}</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Text className="font-bold text-[#0B3D91] mr-2">{contact.number}</Text>
                                        <Feather name="phone" size={16} color="#0B3D91" />
                                    </View>
                                </TouchableOpacity>
                            ))}

                            {/* Emergency Note */}
                            <View className="mt-2 p-3 bg-red-50 rounded-xl border border-red-200">
                                <Text className="text-xs text-red-700 text-center">
                                    🚨 For life-threatening emergencies, please call 102 (Ambulance) or 100 (Police) immediately.
                                </Text>
                            </View>
                        </View>
                    )}
                </Animated.View>

                {/* Quick Tips Card */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(500)}
                    className="bg-blue-50 rounded-2xl p-5 mb-6 border-l-4 border-blue-500"
                >
                    <View className="flex-row items-center mb-3">
                        <MaterialCommunityIcons name="lightbulb-on" size={22} color="#0B3D91" />
                        <Text className="text-lg font-bold text-gray-800 ml-2">Travel Tips</Text>
                    </View>
                    <View className="space-y-2">
                        <Tip text="Keep your smart card handy for faster entry" />
                        <Tip text="Peak hours: 8-10 AM & 5-7 PM - Plan accordingly" />
                        <Tip text="Women's special coach at front of each train" />
                        <Tip text="Lost & Found: Contact station master or helpline 1800-123-4567" />
                    </View>
                </Animated.View>
            </View>

            {/* Station Selection Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl h-[70%]">
                        <View className="p-5 border-b border-gray-200 flex-row justify-between items-center">
                            <View className="flex-row items-center">
                                <MaterialCommunityIcons name="subway" size={24} color="#0B3D91" />
                                <Text className="text-xl font-bold text-gray-800 ml-2">Select Station</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                className="bg-gray-100 p-2 rounded-full"
                            >
                                <MaterialIcons name="close" size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {loading ? (
                            <View className="flex-1 justify-center items-center">
                                <ActivityIndicator size="large" color="#0B3D91" />
                                <Text className="text-gray-500 mt-3">Loading stations...</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={stations}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => selectStation(item)}
                                        className="p-4 border-b border-gray-100 flex-row items-center"
                                    >
                                        <View className="w-2 h-2 bg-[#0B3D91] rounded-full mr-3" />
                                        <Text className="text-base text-gray-800">{item}</Text>
                                    </TouchableOpacity>
                                )}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            />
                        )}
                    </View>
                </View>
            </Modal>

            <Footer />
        </ScrollView>
    );
};

// Tip Component
const Tip = ({ text }) => (
    <View className="flex-row items-start">
        <Text className="text-blue-600 mr-2">•</Text>
        <Text className="text-gray-700 flex-1 text-sm">{text}</Text>
    </View>
);

export default FareInfoScreen;