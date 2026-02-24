import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Footer from '../src/components/ui/Footer';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const AboutScreen = () => {
    const { t } = useTranslation();
    const [expandedFact, setExpandedFact] = useState(null);

    const openLink = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const keyFacts = [
        {
            icon: "ruler",
            title: t("aboutPage.totalLength", "Total Length"),
            value: t("aboutPage.totalLengthValue", "32.497 km"),
            color: "#3B82F6",
            detail: t("aboutPage.facts.totalLengthDetail", "Elevated: 22.5 km • Underground: 9.997 km")
        },
        {
            icon: "subway-variant",
            title: t("aboutPage.lines", "Lines"),
            value: t("aboutPage.linesValue", "2 (Red & Blue)"),
            color: "#EF4444",
            detail: t("aboutPage.facts.linesDetail", "Red Line: 14.45 km • Blue Line: 16.94 km")
        },
        {
            icon: "cash",
            title: t("aboutPage.projectCost", "Project Cost"),
            value: t("aboutPage.projectCostValue", "₹13,365.77 Crore"),
            color: "#10B981",
            detail: t("aboutPage.facts.costDetail", "Central Govt: ₹6,682 Cr • State Govt: ₹6,683 Cr")
        },
        {
            icon: "calendar-check",
            title: t("aboutPage.expectedCompletion", "Completion"),
            value: t("aboutPage.expectedCompletionValue", "2026 (Phase 1)"),
            color: "#F59E0B",
            detail: t("aboutPage.facts.completionDetail", "Phase 2 approval expected by 2027")
        },
    ];

    const stats = [
        { label: t("aboutPage.stats.stations", "Stations"), value: "26", icon: "train" },
        { label: t("aboutPage.stats.ridership", "Daily Ridership"), value: "50k+", icon: "account-group" },
        { label: t("aboutPage.stats.status", "Project Status"), value: "40%", icon: "percent" },
        { label: t("aboutPage.stats.team", "Team Members"), value: "500+", icon: "account-multiple" },
    ];

    return (
        <ScrollView
            className="flex-1 bg-gray-50"
            showsVerticalScrollIndicator={false}
        >

            {/* Stats Cards */}
            <View className="px-4 mt-6">
                <Animated.View
                    entering={FadeInUp.duration(600).delay(200)}
                    className="bg-white rounded-2xl p-5 shadow-xl flex-row flex-wrap justify-between"
                >
                    {stats.map((stat, index) => (
                        <View key={index} className="items-center w-[22%]">
                            <View className="bg-[#0B3D91]/10 p-2 rounded-full mb-2">
                                <MaterialCommunityIcons name={stat.icon} size={20} color="#0B3D91" />
                            </View>
                            <Text className="text-lg font-bold text-gray-800">{stat.value}</Text>
                            <Text className="text-xs text-gray-500">{stat.label}</Text>
                        </View>
                    ))}
                </Animated.View>
            </View>

            {/* Main Content */}
            <View className="p-5">
                {/* Overview Card */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(300)}
                    className="bg-white rounded-2xl p-6 shadow-sm mb-5"
                >
                    <View className="flex-row items-center mb-4">
                        <View className="bg-[#0B3D91]/10 p-2 rounded-xl mr-3">
                            <MaterialCommunityIcons name="information" size={24} color="#0B3D91" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-800">
                            {t("aboutPage.overviewTitle", "Project Overview")}
                        </Text>
                    </View>
                    <Text className="text-gray-600 leading-6 text-base">
                        {t("aboutPage.overviewPara1", "The Patna Metro is a mass rapid transit system currently under construction in the city of Patna, Bihar. It aims to reduce traffic congestion and provide a reliable, eco-friendly mode of transport for the growing population.")}
                    </Text>

                    {/* Quick Highlights */}
                    <View className="flex-row mt-5 pt-4 border-t border-gray-100">
                        <View className="flex-1 items-center">
                            <Text className="text-2xl font-bold text-[#0B3D91]">25</Text>
                            <Text className="text-xs text-gray-500">{t("aboutPage.stats.stations", "Stations")}</Text>
                        </View>
                        <View className="flex-1 items-center border-l border-r border-gray-200">
                            <Text className="text-2xl font-bold text-[#0B3D91]">32.5</Text>
                            <Text className="text-xs text-gray-500">{t("aboutPage.stats.kmLength", "km Length")}</Text>
                        </View>
                        <View className="flex-1 items-center">
                            <Text className="text-2xl font-bold text-[#0B3D91]">2026</Text>
                            <Text className="text-xs text-gray-500">{t("aboutPage.stats.launch", "Launch")}</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Interactive Cards */}
                <Text className="text-2xl font-bold text-gray-800 mb-4 px-1">
                    {t("aboutPage.keyFactsTitle", "Key Facts")}
                </Text>

                {keyFacts.map((fact, index) => (
                    <Animated.View
                        key={index}
                        entering={FadeInDown.duration(500).delay(400 + index * 100)}
                    >
                        <TouchableOpacity
                            onPress={() => setExpandedFact(expandedFact === index ? null : index)}
                            activeOpacity={0.7}
                            className="bg-white rounded-xl p-5 mb-3 shadow-sm"
                        >
                            <View className="flex-row items-center">
                                <View className="p-3 rounded-xl mr-4" style={{ backgroundColor: `${fact.color}15` }}>
                                    <MaterialCommunityIcons name={fact.icon} size={24} color={fact.color} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm text-gray-500">{fact.title}</Text>
                                    <Text className="text-xl font-bold text-gray-800">{fact.value}</Text>
                                </View>
                                <Feather
                                    name={expandedFact === index ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="#9CA3AF"
                                />
                            </View>

                            {expandedFact === index && (
                                <View className="mt-3 pt-3 border-t border-gray-100">
                                    <Text className="text-gray-600 text-sm">{fact.detail}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                ))}

                {/* Timeline Section */}
                <View className="mt-5 mb-8">
                    <Text className="text-2xl font-bold text-gray-800 mb-4 px-1">
                        {t("aboutPage.projectTimelineTitle", "Project Timeline")}
                    </Text>
                    <View className="bg-white rounded-2xl p-1 shadow-sm">
                        <TimelineEvents t={t} />
                    </View>
                </View>

                {/* Developer Card */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(800)}
                    className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100"
                >
                    <View className="items-center">
                        {/* Profile Image */}
                        <View className="mb-4">
                            <Image
                                source={require('../assets/images/Rachit.jpg')}
                                className="w-20 h-20 rounded-full border-3 border-[#0B3D91]"
                                style={{
                                    resizeMode: 'cover',
                                    width: 150,
                                    height: 150
                                }}
                            />
                        </View>

                        {/* Name & Title */}
                        <Text className="text-2xl font-bold text-gray-800 mb-1">
                            Rachit Sharma
                        </Text>
                        <View className="flex-row items-center mb-3">
                            <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                            <Text className="text-sm text-gray-500">
                                {t('aboutPage.developer.title', 'Full Stack Developer')}
                            </Text>
                        </View>

                        {/* Description */}
                        <Text className="text-gray-600 text-center mb-5 leading-5 px-2">
                            {t('aboutPage.developer.description', "Crafting the digital experience for Patna Metro with passion and precision. Bringing Bihar's first metro to your fingertips.")}
                        </Text>

                        {/* Social Icons */}
                        <View className="flex-row justify-center space-x-4">
                            <TouchableOpacity
                                onPress={() => Linking.openURL('https://github.com/rachitsharma300')}
                                className="bg-gray-100 p-3 rounded-full w-12 h-12 items-center justify-center"
                            >
                                <FontAwesome5 name="github" size={20} color="#333" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => Linking.openURL('https://twitter.com/rachitsharma300')}
                                className="bg-gray-100 p-3 rounded-full w-12 h-12 items-center justify-center"
                            >
                                <FontAwesome5 name="twitter" size={20} color="#1DA1F2" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => Linking.openURL('https://www.instagram.com/rachitsharma300')}
                                className="bg-gray-100 p-3 rounded-full w-12 h-12 items-center justify-center"
                            >
                                <FontAwesome5 name="instagram" size={20} color="#E4405F" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => Linking.openURL('https://linkedin.com/in/rachitsharma300')}
                                className="bg-gray-100 p-3 rounded-full w-12 h-12 items-center justify-center"
                            >
                                <FontAwesome5 name="linkedin" size={20} color="#0077B5" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => Linking.openURL('https://rachitsharma300.github.io/rachit-portfolio/')}
                                className="bg-gray-100 p-3 rounded-full w-12 h-12 items-center justify-center"
                            >
                                <FontAwesome5 name="globe" size={20} color="#331a6fff" />
                            </TouchableOpacity>
                        </View>

                        {/* Small Stats */}
                        <View className="flex-row mt-5 pt-4 border-t border-gray-100 w-full justify-around">
                            <View className="items-center">
                                <Text className="text-sm font-bold text-[#0B3D91]">5+</Text>
                                <Text className="text-xs text-gray-500">Projects</Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-sm font-bold text-[#0B3D91]">3+</Text>
                                <Text className="text-xs text-gray-500">Years</Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-sm font-bold text-[#0B3D91]">10+</Text>
                                <Text className="text-xs text-gray-500">Features</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* Official Website Button */}
                <TouchableOpacity
                    onPress={() => openLink("www.patnametromap.in/")}
                    className="mb-10"
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#0B3D91', '#1a4ca3']}
                        className="py-4 rounded-xl items-center flex-row justify-center"
                    >
                        <MaterialCommunityIcons name="web" size={20} color="white" />
                        <Text className="text-white font-semibold text-lg ml-2">
                            {t("aboutPage.officialWebsiteButton", "Visit Website")}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <Footer />
        </ScrollView>
    );
};

// Timeline Events Component
const TimelineEvents = ({ t }) => {
    const events = (t('aboutPage.timeline.events', { returnObjects: true }) || []);

    return (
        <View className="pl-4 border-l-2 border-blue-200 ml-4 space-y-8 my-6">
            {Array.isArray(events) && events.map((event, index) => (
                <View key={index} className="relative">
                    {/* Dot */}
                    <View className="absolute -left-[22px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white" />

                    <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <Text className="text-blue-600 font-bold mb-1">{event.date}</Text>
                        <Text className="text-lg font-semibold text-gray-800 mb-1">{event.title}</Text>
                        <Text className="text-gray-600 leading-5">{event.description}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

// Social Icon Component
const SocialIcon = ({ icon, url }) => (
    <TouchableOpacity
        onPress={() => Linking.openURL(url)}
        className="bg-white/10 w-12 h-12 rounded-full items-center justify-center"
    >
        <FontAwesome5 name={icon} size={20} color="white" />
    </TouchableOpacity>
);

export default AboutScreen;