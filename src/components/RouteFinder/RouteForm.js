import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    SafeAreaView,
    TextInput,
    ActivityIndicator
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence
} from 'react-native-reanimated';

const RouteForm = ({
    stations,
    selected,
    loading,
    onSelectChange,
    onFindRoute,
    onReverseRoute,
}) => {
    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const [activeField, setActiveField] = useState(null); // 'source' or 'destination'
    const rotation = useSharedValue(0);

    const handleOpenModal = (field) => {
        setActiveField(field);
        setModalVisible(true);
    };

    const handleSelectStation = (stationName) => {
        if (activeField) {
            onSelectChange(activeField, stationName);
        }
        setModalVisible(false);
        setActiveField(null);
    };

    const handleReverse = () => {
        rotation.value = withSequence(
            withSpring(rotation.value + 180, { damping: 10, stiffness: 100 })
        );
        onReverseRoute();
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    const getStationName = (name) => t(`stations.${name}`, name);

    return (
        <View className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
            {/* Source Input */}
            <View className="mb-4">
                <Text className="text-sm font-bold text-gray-700 mb-2 flex-row items-center">
                    <MaterialIcons name="location-on" size={16} color="#ef4444" style={{ marginRight: 4 }} />
                    {t("RouteFinder.sourceStation", "Source Station")}
                </Text>
                <TouchableOpacity
                    onPress={() => handleOpenModal('source')}
                    className="flex-row items-center justify-between border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 active:bg-gray-100"
                >
                    <Text className={`text-base font-medium ${selected.source ? 'text-gray-900' : 'text-gray-400'}`}>
                        {selected.source ? getStationName(selected.source) : t("RouteFinder.selectSource", "Select Source")}
                    </Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color="#9ca3af" />
                </TouchableOpacity>
            </View>

            {/* Reverse Button (Centered and overlapping slightly) */}
            <View className="items-center -my-3 z-10">
                <TouchableOpacity
                    onPress={handleReverse}
                    className="bg-blue-600 p-3 rounded-full shadow-lg border-4 border-white"
                >
                    <Animated.View style={animatedStyle}>
                        <MaterialIcons name="swap-vert" size={24} color="white" />
                    </Animated.View>
                </TouchableOpacity>
            </View>

            {/* Destination Input */}
            <View className="mb-6">
                <Text className="text-sm font-bold text-gray-700 mb-2 flex-row items-center">
                    <MaterialIcons name="flag" size={16} color="#10b981" style={{ marginRight: 4 }} />
                    {t("RouteFinder.destinationStation", "Destination Station")}
                </Text>
                <TouchableOpacity
                    onPress={() => handleOpenModal('destination')}
                    className="flex-row items-center justify-between border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 active:bg-gray-100"
                >
                    <Text className={`text-base font-medium ${selected.destination ? 'text-gray-900' : 'text-gray-400'}`}>
                        {selected.destination ? getStationName(selected.destination) : t("RouteFinder.selectDestination", "Select Destination")}
                    </Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color="#9ca3af" />
                </TouchableOpacity>
            </View>

            {/* Find Route Button */}
            <TouchableOpacity
                onPress={onFindRoute}
                disabled={loading}
                className={`flex-row items-center justify-center p-4 rounded-xl shadow-card ${loading ? 'bg-gray-400' : 'bg-[#0B3D91]'
                    }`}
            >
                {loading ? (
                    <ActivityIndicator color="white" className="mr-2" />
                ) : (
                    <MaterialIcons name="search" size={24} color="white" style={{ marginRight: 8 }} />
                )}
                <Text className="text-white font-bold text-lg">
                    {loading ? t("RouteFinder.calculatingRoute", "Calculating...") : t("RouteFinder.findRoute", "Find Route")}
                </Text>
            </TouchableOpacity>

            {/* Station Selection Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl h-[70%] shadow-2xl overflow-hidden">
                        <View className="bg-gray-50 p-4 border-b border-gray-100 flex-row justify-between items-center">
                            <Text className="text-lg font-bold text-primary">
                                {activeField === 'source' ? t("RouteFinder.selectSource") : t("RouteFinder.selectDestination")}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={stations}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelectStation(item.name)}
                                    className="p-4 border-b border-gray-100 active:bg-blue-50 flex-row items-center"
                                >
                                    <View className={`w-3 h-3 rounded-full mr-3 ${item.line === 'Red Line' ? 'bg-[#D32F2F]' : 'bg-[#1976D2]'}`} />
                                    <Text className="text-base text-gray-800 font-medium">
                                        {getStationName(item.name)}
                                    </Text>
                                    {selected[activeField] === item.name && (
                                        <MaterialIcons name="check" size={20} color="#0B3D91" style={{ marginLeft: 'auto' }} />
                                    )}
                                </TouchableOpacity>
                            )}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default RouteForm;
