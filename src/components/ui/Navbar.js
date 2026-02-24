import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    Animated,
    Dimensions,
    StatusBar,
    Image,
    Platform
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
// import { useTheme } from '../../context/ThemeContext'; 
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const insets = useSafeAreaInsets();
    // const { activeTheme, toggleManualTheme } = useTheme(); 
    const slideAnim = useRef(new Animated.Value(width)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        if (menuOpen) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: width,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.9,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [menuOpen]);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
        setMenuOpen(false);
    };

    const menuItems = [
        { name: t('nav.home', 'Home'), icon: 'home', iconFamily: 'MaterialIcons', route: '/', gradient: ['#0B3D91', '#1a4ca3'] },
        { name: t('nav.routeFinder', 'Route Finder'), icon: 'map-search', iconFamily: 'MaterialCommunityIcons', route: '/routefinder', gradient: ['#10B981', '#059669'] },
        { name: t('nav.metroMap', 'Metro Map'), icon: 'map', iconFamily: 'MaterialIcons', route: '/map', gradient: ['#8B5CF6', '#6D28D9'] },
        { name: t('nav.fareInfo', 'Fare Info'), icon: 'currency-inr', iconFamily: 'MaterialCommunityIcons', route: '/fare-info', gradient: ['#F59E0B', '#D97706'] },
        { name: t('nav.about', 'About'), icon: 'information-outline', iconFamily: 'MaterialCommunityIcons', route: '/about', gradient: ['#EC4899', '#DB2777'] },
    ];

    const handleNavigation = (route) => {
        setMenuOpen(false);
        console.log('Navigating to:', route);
        router.push(route);
    };

    const getIcon = (item, color, size = 24) => {
        if (item.iconFamily === 'MaterialCommunityIcons') {
            return <MaterialCommunityIcons name={item.icon} size={size} color={color} />;
        }
        return <MaterialIcons name={item.icon} size={size} color={color} />;
    };

    return (
        <>
            <StatusBar backgroundColor="#0B3D91" barStyle="light-content" />

            {/* Navbar */}
            <LinearGradient
                colors={['#0B3D91', '#1a4ca3', '#2b5cb5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    paddingTop: insets.top,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                    zIndex: 1000
                }}
            >
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 12
                }}>
                    {/* Logo aur Title */}
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => router.push('/')}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={require('../../../assets/images/PatnaLogo.png')}
                            style={{ width: 60, height: 60, marginVertical: -10, marginLeft: -8 }}
                            resizeMode="contain"
                        />

                        <View style={{ marginLeft: 2 }}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: '700', letterSpacing: 0.5 }}>
                                {t('stationsDesc.appName', 'Patna Metro')}
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>
                                {t('stationsDesc.appTagline', "Bihar's capital on the move")}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Menu Button */}
                    <TouchableOpacity
                        onPress={() => setMenuOpen(true)}
                        style={{
                            padding: 10,
                            borderRadius: 12,
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.2)'
                        }}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="menu" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Mobile Menu Modal */}
            <Modal
                visible={menuOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setMenuOpen(false)}
            >
                <Animated.View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        opacity: fadeAnim
                    }}
                >
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        activeOpacity={1}
                        onPress={() => setMenuOpen(false)}
                    >
                        <Animated.View
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                width: width * 0.8,
                                backgroundColor: 'transparent',
                                transform: [{ translateX: slideAnim }]
                            }}
                        >
                            {/* Blurred Background for iOS */}
                            {Platform.OS === 'ios' ? (
                                <BlurView intensity={90} style={{ flex: 1 }} tint="dark">
                                    <MenuContent
                                        insets={insets}
                                        menuItems={menuItems}
                                        handleNavigation={handleNavigation}
                                        getIcon={getIcon}
                                        toggleLanguage={toggleLanguage}
                                        i18n={i18n}
                                        // activeTheme={activeTheme} 
                                        // toggleManualTheme={toggleManualTheme} 
                                        scaleAnim={scaleAnim}
                                        setMenuOpen={setMenuOpen}
                                        t={t}
                                    />
                                </BlurView>
                            ) : (
                                <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                                    <MenuContent
                                        insets={insets}
                                        menuItems={menuItems}
                                        handleNavigation={handleNavigation}
                                        getIcon={getIcon}
                                        toggleLanguage={toggleLanguage}
                                        i18n={i18n}
                                        // activeTheme={activeTheme}  
                                        // toggleManualTheme={toggleManualTheme}  
                                        scaleAnim={scaleAnim}
                                        setMenuOpen={setMenuOpen}
                                        t={t}
                                    />
                                </View>
                            )}
                        </Animated.View>
                    </TouchableOpacity>
                </Animated.View>
            </Modal>
        </>
    );
};

// Menu Content Component
const MenuContent = ({ insets, menuItems, handleNavigation, getIcon, toggleLanguage, i18n, scaleAnim, setMenuOpen, t }) => (  // 👈 activeTheme hata diya
    <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
        {/* Menu Header with Gradient and Accent Line */}
        <LinearGradient
            colors={['#0B3D91', '#1a4ca3', '#2b5cb5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                paddingTop: insets.top,
                height: 120,
                justifyContent: 'flex-end',
                paddingBottom: 20,
                borderBottomWidth: 4,
                borderBottomColor: '#FACC15', // Accent Line
            }}
        >
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
            }}>
                <Text style={{
                    color: 'white',
                    fontSize: 24,
                    fontWeight: 'bold',
                    letterSpacing: 0.5
                }}>
                    {t('stationsDesc.menu', 'Menu')}
                </Text>
                <TouchableOpacity
                    onPress={() => setMenuOpen(false)}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        padding: 10,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.2)'
                    }}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="close" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </LinearGradient>

        {/* Menu Items - Enhanced */}
        <ScrollView
            style={{ flex: 1, paddingTop: 16 }}
            showsVerticalScrollIndicator={false}
        >
            {menuItems.map((item, index) => (
                <Animated.View
                    key={index}
                    style={{
                        opacity: scaleAnim.interpolate({
                            inputRange: [0.9, 1],
                            outputRange: [0.5, 1]
                        }),
                        transform: [{
                            translateX: scaleAnim.interpolate({
                                inputRange: [0.9, 1],
                                outputRange: [20, 0]
                            })
                        }]
                    }}
                >
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginHorizontal: 16,
                            marginVertical: 6,
                            padding: 12,
                            borderRadius: 16,
                            backgroundColor: '#F8FAFC',
                            borderWidth: 1,
                            borderColor: '#E2E8F0',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 4,
                            elevation: 2
                        }}
                        onPress={() => handleNavigation(item.route)}
                        activeOpacity={0.7}
                    >
                        <LinearGradient
                            colors={item.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 14,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 16,
                                shadowColor: item.gradient[0],
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 6,
                                elevation: 4
                            }}
                        >
                            {getIcon(item, 'white', 24)}
                        </LinearGradient>

                        <View style={{ flex: 1 }}>
                            <Text style={{
                                color: '#1E293B',
                                fontSize: 16,
                                fontWeight: '600',
                                marginBottom: 2
                            }}>
                                {item.name}
                            </Text>
                            <Text style={{
                                color: '#64748B',
                                fontSize: 12
                            }}>
                                {t('stationsDesc.tapToExplore', 'Tap to explore')}
                            </Text>
                        </View>

                        <View style={{
                            backgroundColor: '#E2E8F0',
                            padding: 8,
                            borderRadius: 12
                        }}>
                            <MaterialIcons name="chevron-right" size={18} color="#475569" />
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            ))}

            {/* Language Section - Theme wala part hata diya */}
            <View style={{ padding: 16, marginTop: 8 }}>
                <Text style={{
                    color: '#64748B',
                    fontSize: 12,
                    fontWeight: '600',
                    letterSpacing: 1,
                    marginBottom: 12,
                    textTransform: 'uppercase'
                }}>
                    {t('stationsDesc.settings', 'Settings')}
                </Text>

                {/* Language Toggle - Enhanced */}
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#F8FAFC',
                        borderRadius: 16,
                        padding: 16,
                        marginBottom: 12,
                        borderWidth: 1,
                        borderColor: '#E2E8F0'
                    }}
                    onPress={toggleLanguage}
                    activeOpacity={0.7}
                >
                    <LinearGradient
                        colors={['#0B3D91', '#1a4ca3']}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 16
                        }}
                    >
                        <MaterialIcons name="translate" size={24} color="white" />
                    </LinearGradient>

                    <View style={{ flex: 1 }}>
                        <Text style={{
                            color: '#1E293B',
                            fontSize: 16,
                            fontWeight: '600'
                        }}>
                            {i18n.language === 'en' ? 'हिंदी' : 'English'}
                        </Text>
                        <Text style={{ color: '#64748B', fontSize: 12 }}>
                            {i18n.language === 'en' ? 'Switch to Hindi' : 'अंग्रेजी में बदलें'}
                        </Text>
                    </View>

                    <View style={{
                        backgroundColor: '#0B3D91',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20
                    }}>
                        <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                            {i18n.language === 'en' ? 'हिंदी' : 'EN'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* App Info */}
            <View style={{ padding: 24, alignItems: 'center' }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8
                }}>
                    <MaterialCommunityIcons name="heart" size={14} color="#EF4444" />
                    <Text style={{ color: '#94A3B8', fontSize: 12, marginHorizontal: 4 }}>
                        {t('stationsDesc.madeWithLove', 'Made with love in')}
                    </Text>
                    <Text style={{ color: '#0B3D91', fontSize: 12, fontWeight: '600' }}>
                        {t('stationsDesc.bihar', 'Bihar')}
                    </Text>
                </View>
                <Text style={{ color: '#94A3B8', fontSize: 11 }}>
                    {t('stationsDesc.version', 'Version')} 2.0.0 • © 2026
                </Text>
            </View>
        </ScrollView>
    </Animated.View>
);

export default Navbar;