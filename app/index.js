import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
import Footer from '../src/components/ui/Footer';
import { StatusBar } from 'expo-status-bar';
import AnimatedMetro from '../src/components/metro/AnimatedMetro';
import RouteFinder from '../src/components/RouteFinder';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Video } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const HomeScreen = () => {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
    };

    const menuItems = [
        {
            name: t('nav.metroMap', 'Metro Map'),
            icon: 'map-search',
            route: '/map',
            iconColor: '#8B5CF6'  // Purple
        },
        {
            name: t('nav.fareInfo', 'Fare Info'),
            icon: 'currency-inr',
            route: '/fare-info',
            iconColor: '#F59E0B'  // Orange
        },
        {
            name: t('nav.about', 'About'),
            icon: 'information-outline',
            route: '/about',
            iconColor: '#EC4899'  // Pink
        },
        {
            name: i18n.language === 'en' ? 'हिंदी' : 'English',
            icon: 'translate',
            action: toggleLanguage,
            iconColor: '#0B3D91'  // Blue
        },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: '#F4F6F8' }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 0,
                    flexGrow: 1
                }}
            >
                <StatusBar style="light" backgroundColor="#0B3D91" />

                {/* TOP BANNER VIDEO */}
                <View className="w-full items-center">
                    <View style={{
                        width: '100%',
                        height: 200,
                        overflow: 'hidden',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 5
                    }}>
                        <Video
                            source={require('../assets/images/Patna.mp4')}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                            shouldPlay
                            isLooping
                            isMuted
                            useNativeControls={false}
                        />
                    </View>
                </View>

                {/* SHORTCUTS GRID */}
                <View className="flex-row flex-wrap justify-between px-6 mt-8">
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={item.route ? () => router.push(item.route) : item.action}
                            className="w-[48%] bg-white p-4 rounded-xl mb-4 items-center justify-center shadow"
                            style={{ elevation: 2 }}
                        >
                            <MaterialCommunityIcons
                                name={item.icon}
                                size={26}
                                color={item.iconColor}
                            />
                            <Text className="text-[#0B3D91] text-sm font-semibold mt-2 text-center">
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* METRO SVG */}
                <View className="items-center mb-3 mt-2">
                    <AnimatedMetro />
                </View>

                {/* ROUTE FINDER SECTION */}
                <View className="px-5 mt-2">
                    <Animated.View
                        entering={FadeInDown.delay(100).duration(600)}
                        className="bg-white rounded-2xl shadow p-4 mb-6"
                        style={{ elevation: 3 }}
                    >
                        <Text className="text-[#0B3D91] text-lg font-bold mb-3">
                            {t('home.planJourney', 'Find Your Route')}
                        </Text>

                        <RouteFinder />
                    </Animated.View>
                </View>

                {/* FOOTER */}
                <Footer />
            </ScrollView>
        </View>
    );
};

export default HomeScreen;