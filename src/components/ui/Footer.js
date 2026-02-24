import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FontAwesome5, MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// import { getVisitCount } from '../../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();
    // const [visitCount, setVisitCount] = useState(null);

    // useEffect(() => {
    //     getVisitCount()
    //         .then((count) => setVisitCount(count))
    //         .catch((err) => {
    //             console.log("Visit count unavailable:", err);
    //             setVisitCount(null);
    //         });
    // }, []);

    // const openLink = (url) => {
    //     Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
    // };

    return (
        <LinearGradient
            colors={['#0B3D91', '#1a4ca3']}
            className="w-full"
        >
            <View className="px-5 pt-8 pb-2">
                {/* Main Footer Content */}
                <View className="flex-col">
                    {/* Brand Section with Icon */}
                    <View className="flex-row items-center mb-6">
                        <View className="mr-1">
                            <Image
                                source={require('../../../assets/images/PatnaLogo.png')}
                                style={{ width: 62, height: 62 }}
                                resizeMode="contain"
                            />
                        </View>
                        <View>
                            <Text className="text-2xl font-bold text-white">{t('footer.appName', 'Patna Metro')}</Text>
                            <Text className="text-white/60 text-xs">{t('footer.appTagline', "Bihar's capital on the move")}</Text>
                        </View>
                    </View>

                    {/* Metro Highlights */}
                    <View className="mb-8">
                        <View className="flex-row flex-wrap justify-between">
                            <HighlightItem
                                icon="clock-outline"
                                value="06:00 - 22:00"
                                label={t('footer.highlights.operatingHours', 'Operating Hours')}
                            />
                            <HighlightItem
                                icon="train"
                                value="25+"
                                label={t('footer.highlights.stations', 'Stations')}
                            />
                            <HighlightItem
                                icon="currency-inr"
                                value="₹10 - ₹50"
                                label={t('footer.highlights.fareRange', 'Fare Range')}
                            />
                            <HighlightItem
                                icon="access-point"
                                value="5-7 min"
                                label={t('footer.highlights.frequency', 'Frequency')}
                            />
                            <HighlightItem
                                icon="subway-variant"
                                value={t('footer.highlights.lines', '2 Lines')}
                                label={t('footer.highlights.lineColors', 'Red & Blue')}
                            />
                            <HighlightItem
                                icon="calendar-check"
                                value="2025"
                                label={t('footer.highlights.phase1Launch', 'Phase 1 Launch')}
                            />
                        </View>
                    </View>

                    {/* Contact & Social Section */}
                    <View className="bg-white/5 rounded-2xl p-5 mb-6">
                        <Text className="text-white font-semibold text-lg mb-4">{t('footer.connectWithUs', 'Connect With Us')}</Text>

                        {/* Contact Info */}
                        <View className="space-y-3 mb-5">
                            <ContactRow
                                icon="map-pin"
                                text={t('footer.address', 'Patna Metro Rail Corporation, Bailey Road, Patna')}
                                IconComponent={Feather}
                            />
                            <ContactRow
                                icon="phone"
                                text="+91 9871 874 041"
                                IconComponent={Feather}
                            />
                            <ContactRow
                                icon="mail"
                                text="rachitsharma300.dev@gmail.com"
                                IconComponent={Feather}
                            />
                        </View>

                        {/* Social Icons */}
                        <View className="flex-row justify-center space-x-6">
                            <SocialIcon
                                name="github"
                                url="https://github.com/rachitsharma300"
                                IconComponent={FontAwesome5}
                            />
                            <SocialIcon
                                name="twitter"
                                url="https://x.com/rachitsharma300"
                                IconComponent={FontAwesome5}
                            />
                            <SocialIcon
                                name="globe"
                                url="https://rachitsharma300.github.io/rachit-portfolio/"
                                IconComponent={FontAwesome5}
                            />
                            <SocialIcon
                                name="linkedin"
                                url="https://linkedin.com/in/rachitsharma300"
                                IconComponent={FontAwesome5}
                            />
                        </View>
                    </View>

                    {/* Metro Status -- temp rev for clean UI */}
                    {/* <View className="flex-row items-center justify-between mb-4 bg-white/5 rounded-xl p-3">
                        <View className="flex-row items-center">
                            <View className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                            <Text className="text-white/80 text-xs">Metro Status:</Text>
                        </View>
                        <Text className="text-green-400 text-xs font-semibold">● Operational</Text>
                        <Text className="text-white/40 text-xs">| Last updated: Today</Text>
                    </View> */}
                </View>

                {/* Footer Bottom */}

                {/* Developer  */}
                <View className="items-center mt-3">
                    {/* Made with love line */}
                    <View className="flex-row justify-center items-center">
                        <Text className="text-white/40 text-xs">
                            {t('footer.madeBy', 'Made with ❤️ by Rachit Sharma')}
                        </Text>
                    </View>

                    {/* Copyright  */}
                    <View className="flex-row justify-center items-center mt-1">
                        <Text className="text-white/40 text-xs">
                            © {currentYear} {t('footer.appName', 'Patna Metro')}
                        </Text>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

// Highlight Item Component - New!
const HighlightItem = ({ icon, value, label }) => (
    <View className="w-[30%] items-center mb-4">
        <View className="bg-white/10 p-2 rounded-full mb-2">
            <MaterialCommunityIcons name={icon} size={18} color="#FACC15" />
        </View>
        <Text className="text-white font-bold text-sm">{value}</Text>
        <Text className="text-white/50 text-xs text-center">{label}</Text>
    </View>
);

// Contact Row Component
const ContactRow = ({ icon, text, IconComponent }) => (
    <View className="flex-row items-center">
        <IconComponent name={icon} size={14} color="#FACC15" style={{ width: 24 }} />
        <Text className="text-white/70 text-sm flex-1">{text}</Text>
    </View>
);

// Social Icon Component
const SocialIcon = ({ name, url, IconComponent }) => (
    <TouchableOpacity
        onPress={() => Linking.openURL(url)}
        className="bg-white/10 w-10 h-10 rounded-full items-center justify-center"
    >
        <IconComponent name={name} size={18} color="white" />
    </TouchableOpacity>
);

export default Footer;