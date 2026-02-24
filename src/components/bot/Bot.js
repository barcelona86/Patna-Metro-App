import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
    Animated,
    Easing,
    Dimensions,
    Keyboard
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";
// import { Audio } from 'expo-av';
// import { Camera } from 'expo-camera';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../../services/api';
import stationMatcher from '../../utils/StationMatcher';

const { width, height } = Dimensions.get('window');

const Bot = ({ triggerSearch }) => {
    const { t, i18n } = useTranslation();
    const insets = useSafeAreaInsets();
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [showPopup, setShowPopup] = useState(true);
    const [isBotAwake, setIsBotAwake] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [autoSuggestions, setAutoSuggestions] = useState([]);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        if (Platform.OS === 'android') {
            const showSub = Keyboard.addListener('keyboardDidShow', (e) => setKeyboardHeight(e.endCoordinates.height));
            const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
            return () => {
                showSub.remove();
                hideSub.remove();
            };
        }
    }, []);
    // Use ref instead of state for greeting tracking
    const greetedRef = useRef(false);

    // Animation refs
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;

    const scrollViewRef = useRef();
    const router = useRouter();

    // Ref to hold the latest submit function for voice callback
    const submitRef = useRef(null);

    // Update the ref each render
    useEffect(() => {
        submitRef.current = handleTextSubmit;
    });

    const langRef = useRef("hi-IN");

    // Subscribing to Speech Recognition events
    useSpeechRecognitionEvent("start", () => setIsListening(true));
    useSpeechRecognitionEvent("end", () => setIsListening(false));
    useSpeechRecognitionEvent("result", (event) => {
        const results = event.results;
        if (results && results.length > 0) {
            const finalTranscript = results[0].transcript;
            setText(finalTranscript);
            if (event.isFinal && submitRef.current) {
                submitRef.current(finalTranscript);
            }
        }
    });
    useSpeechRecognitionEvent("error", (event) => {
        console.log("error code:", event.error, "message:", event.message);

        if (event.error === 'language-not-supported' && langRef.current === 'hi-IN') {
            console.log("Hindi package not found on device, falling back to en-IN...");
            langRef.current = 'en-IN';
            try {
                ExpoSpeechRecognitionModule.start({
                    lang: langRef.current,
                    interimResults: true,
                    maxAlternatives: 1,
                    requiresOnDeviceRecognition: false
                });
            } catch (e) {
                console.error("Fallback start failed:", e);
                setIsListening(false);
                showVoiceError();
            }
            return;
        }

        if (event.error === 'service-not-allowed') {
            console.error("Service not allowed. Ensure the Google app has microphone permissions on your device.");
            showError("Google App permission missing: Please ensure the Google app has access to the microphone in your device settings.");
            setIsListening(false);
            return;
        }

        setIsListening(false);
        showVoiceError();
    });

    // Wave animation
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(waveAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(waveAnim, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    // Pulse animation for bot icon
    useEffect(() => {
        if (!isOpen) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.15,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    })
                ])
            ).start();
        } else {
            scaleAnim.setValue(1);
        }
    }, [isOpen]);

    // Rotate animation for listening
    useEffect(() => {
        if (isListening) {
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            rotateAnim.setValue(0);
        }
    }, [isListening]);

    // Popup animation
    useEffect(() => {
        if (showPopup) {
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 5,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [showPopup]);

    // Auto wake/sleep
    useEffect(() => {
        const initialTimer = setTimeout(() => {
            setShowPopup(false);
            setIsBotAwake(true);
        }, 3000);

        let interval;
        if (isBotAwake && !isOpen) {
            interval = setInterval(() => {
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                }, 2000);
            }, 8000);
        }

        return () => {
            clearTimeout(initialTimer);
            if (interval) clearInterval(interval);
        };
    }, [isBotAwake, isOpen]);

    useEffect(() => {
        if (isOpen && !greetedRef.current && messages.length === 0) {
            greetedRef.current = true;

            const greetText = t('bot.greeting', "नमस्कार, Patna Metro में आपका स्वागत है। मैं बोधि हूँ। Mic बटन दबाकर बोलें या नीचे लिखकर बताएँ, आपको कहाँ से कहाँ जाना है।");
            addBotMessage(greetText, true);
            setSuggestions([
                "Patna Junction to PMCH",
                "Rajendra Nagar to Danapur",
                "New ISBT to Rajendra Nagar"
            ]);
        }
    }, [isOpen, messages.length]);

    // Auto-suggestions while typing
    useEffect(() => {
        if (text.length >= 2) {
            const lastWord = text.split(' ').pop();
            const suggestions = stationMatcher.getSuggestions(lastWord);
            setAutoSuggestions(suggestions);
        } else {
            setAutoSuggestions([]);
        }
    }, [text]);

    const handleBotClick = () => {
        setIsOpen(!isOpen);
        setShowPopup(false);
        setIsBotAwake(false);
        if (isSpeaking) {
            Speech.stop();
            setIsSpeaking(false);
        }
    };

    const addBotMessage = (text, shouldSpeak = false) => {
        setMessages((prev) => [...prev, { type: "bot", text, timestamp: new Date() }]);
        if (shouldSpeak) speak(text);
    };

    const addUserMessage = (text) => {
        setMessages((prev) => [...prev, { type: "user", text, timestamp: new Date() }]);
    };

    const speak = (content) => {
        setIsSpeaking(true);
        Speech.speak(content, {
            language: 'hi-IN',
            rate: 0.9,
            pitch: 1.1,
            onDone: () => setIsSpeaking(false),
            onStopped: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false)
        });
    };

    const handleMicClick = async () => {
        if (isListening) {
            try {
                ExpoSpeechRecognitionModule.stop();
                setIsListening(false);
            } catch (e) {
                console.error("Stop Error:", e);
                setIsListening(false);
            }
        } else {
            setText('');
            try {
                // Request speech recognition permissions natively
                const speechPerms = await ExpoSpeechRecognitionModule.requestPermissionsAsync();

                if (speechPerms.status !== 'granted') {
                    showError(t('bot.micPermission', 'माइक्रोफ़ोन की अनुमति के बिना मैं आपकी आवाज़ नहीं सुन सकता। कृपया सेटिंग्स में जाकर परमिशन दें।'));
                    return;
                }

                setIsListening(true);
                // Important: delay start to ensure UI updates and permissions have settled
                setTimeout(() => {
                    try {
                        langRef.current = "hi-IN"; // Reset to default on new click
                        ExpoSpeechRecognitionModule.start({
                            lang: langRef.current,
                            interimResults: true,
                            maxAlternatives: 1,
                            requiresOnDeviceRecognition: false // Force network cloud recognition fallback
                        });
                    } catch (e) {
                        console.error("Start Error inner:", e);
                        setIsListening(false);
                        showVoiceError();
                    }
                }, 100);

            } catch (e) {
                console.error("Start Error:", e);
                setIsListening(false);
                showVoiceError();
            }
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setText(suggestion);
        handleTextSubmit(suggestion);
    };

    const handleAutoSuggestionClick = (suggestion) => {
        const words = text.split(' ');
        words.pop();
        words.push(suggestion);
        setText(words.join(' ') + ' ');
        setAutoSuggestions([]);
    };

    const processRouteRequest = async (matchedStations, userText) => {
        setIsTyping(true);

        if (matchedStations.length >= 2) {
            let [source, destination] = matchedStations;

            // Normalize station names using synonyms
            source = stationMatcher.normalizeStationName(source);
            destination = stationMatcher.normalizeStationName(destination);

            // Check if source and destination are same
            if (stationMatcher.areSameStations(source, destination)) {
                showError(t('bot.sameStationError', "स्रोत और गंतव्य एक ही स्टेशन है। कृपया अलग स्टेशन चुनें।"));
                setIsTyping(false);
                setText("");
                return;
            }

            setTimeout(async () => {
                try {
                    // 🆕 Pehle /bot/voice-route try karo
                    let res;
                    let useFallback = false;

                    try {
                        res = await api.post('/bot/voice-route', {
                            source,
                            destination,
                        });
                        console.log("✅ Using /bot/voice-route for:", source, destination);
                    } catch (err) {
                        // Agar fail ho to /route use karo
                        console.log("⚠️ Falling back to /route for:", source, destination);
                        useFallback = true;
                        res = await api.post('/route', {
                            source,
                            destination,
                        });
                    }

                    setIsTyping(false);
                    const data = res.data;

                    // Station count calculate करो
                    let stationCount = 4;
                    if (data.stationsCount !== undefined && !isNaN(data.stationsCount)) {
                        stationCount = Math.max(data.stationsCount - 1, 0);
                    } else if (Array.isArray(data.stations)) {
                        stationCount = Math.max(data.stations.length - 1, 0);
                    } else if (typeof data.stations === 'number' && !isNaN(data.stations)) {
                        stationCount = Math.max(data.stations - 1, 0);
                    } else if (data.route && Array.isArray(data.route)) {
                        stationCount = Math.max(data.route.length - 1, 0);
                    }

                    const voiceTime = data.time || data.estimatedTime || 15;
                    const voiceFare = data.fare || data.fareAmount || 30;

                    // Voice response handle करो
                    let fixedVoiceResponse = data.voiceResponse;

                    // Agar fallback use हुआ या voiceResponse नहीं है तो manually बनाओ
                    if (useFallback || !fixedVoiceResponse) {
                        let interchangeText = "";
                        let firstLine = "Red Line";

                        if (data.route && Array.isArray(data.route) && data.route.length > 0) {
                            firstLine = data.route[0].line || data.route[0].color || "Red Line";

                            // Interchange detect करो
                            const linesUsed = [...new Set(data.route.map(s => s.line || s.color).filter(Boolean))];
                            if (linesUsed.length > 1) {
                                const changeIndex = data.route.findIndex((s, i) => i > 0 && (s.line || s.color) !== linesUsed[0]);
                                if (changeIndex !== -1) {
                                    const icStationName = data.route[changeIndex - 1].name || data.route[changeIndex - 1].station;
                                    interchangeText = ` ${icStationName} पर आपको ${linesUsed[1]} की मेट्रो बदलनी होगी।`;
                                }
                            }
                        }

                        fixedVoiceResponse = `आपको ${source} से ${destination} जाने के लिए, पहले आपको ${firstLine} की मेट्रो लेनी होगी।${interchangeText} इस यात्रा में कुल ${stationCount} स्टेशन, ${voiceTime} मिनट का समय और ₹${voiceFare} का किराया लगेगा। आपकी यात्रा शुभ और खुशियों से भरी हो!`;
                    }

                    addBotMessage(fixedVoiceResponse, true);

                    setMessages(prev => [...prev, {
                        type: "route-card",
                        source,
                        destination,
                        time: `${voiceTime} मिनट`,
                        fare: `₹${voiceFare}`,
                        stations: `${stationCount} स्टेशन`
                    }]);

                    setTimeout(() => {
                        router.push({
                            pathname: "/routefinder",
                            params: {
                                source,
                                destination,
                                autoSearch: 'true'
                            }
                        });
                    }, 1500);

                } catch (err) {
                    setIsTyping(false);
                    console.error(err);
                    showError(t('bot.routeError', "माफ़ कीजिए, रूट निकालने में समस्या आ रही है। कृपया थोड़ी देर में प्रयास करें।"));
                }
            }, 1500);

        } else if (matchedStations.length === 1) {
            setIsTyping(false);
            const normalizedStation = stationMatcher.normalizeStationName(matchedStations[0]);
            const singleStationText = t('bot.whereToFormat', "आपको {{station}} से कहाँ जाना है?", { station: normalizedStation });
            addBotMessage(singleStationText, true);

            // Suggest possible destinations
            setSuggestions([
                `${normalizedStation} to Patna Junction`,
                `${normalizedStation} to Danapur`,
                `${normalizedStation} to PMCH`
            ]);

        } else {
            setIsTyping(false);
            showError(t('bot.notUnderstood', "मुझे समझ नहीं आया। कृपया ऐसे बताएँ - 'पटना जंक्शन से पीएमसीएच' या 'danapur to patna junction'"));
        }
        setText("");
    };

    const showError = (errorText) => {
        addBotMessage(errorText, true);
    };

    const handleTextSubmit = (inputText = null) => {
        const messageText = inputText || text;
        if (!messageText.trim()) return;

        addUserMessage(messageText);
        setSuggestions([]);
        setAutoSuggestions([]);
        setIsTyping(true);

        setTimeout(() => {
            // Use smart matcher to find stations
            const foundStations = stationMatcher.findStations(messageText);
            processRouteRequest(foundStations, messageText);
        }, 800);
    };

    // Voice error message
    const showVoiceError = () => {
        addBotMessage(t('bot.voiceError', "आवाज़ समझने में समस्या हुई। आप चाहें तो लिखकर भी स्टेशन का नाम बता सकते हैं।"), true);
    };

    // Animation values 
    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const waveTranslate = waveAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-5, 5]
    });

    const KeyboardWrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
    const keyboardProps = Platform.OS === 'ios'
        ? { behavior: 'padding', keyboardVerticalOffset: 10 }
        : { style: { paddingBottom: keyboardHeight } };

    return (
        <View
            className="absolute right-6 z-50"
            style={{ zIndex: 9999, bottom: Math.max(24, insets.bottom + 24) }}
        >
            {/* Floating Button with AI Effects */}
            {!isOpen && (
                <View>
                    {/* AI Wave Effect */}
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: -5,
                            left: -5,
                            right: -5,
                            bottom: -5,
                            borderRadius: 30,
                            backgroundColor: 'transparent',
                            transform: [{
                                scale: scaleAnim.interpolate({
                                    inputRange: [1, 1.15],
                                    outputRange: [1, 1.2]
                                })
                            }]
                        }}
                    />

                    {/* Popup Message */}
                    {showPopup && (
                        <Animated.View
                            style={{
                                position: 'absolute',
                                bottom: 70,
                                right: 0,
                                width: 220,
                                transform: [
                                    { translateY: slideAnim },
                                    { translateX: waveTranslate }
                                ],
                                opacity: fadeAnim
                            }}
                        >
                            <LinearGradient
                                colors={['#0B3D91', '#1a4ca3']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="rounded-2xl p-3 shadow-xl"
                            >
                                <Text className="text-white text-sm font-semibold">
                                    {t('bot.popupMessage', 'नमस्ते! मैं बोधि वॉइस असिस्टेंट हूँ')}
                                </Text>
                            </LinearGradient>
                        </Animated.View>
                    )}

                    {/* Bot Button */}
                    <TouchableOpacity
                        onPress={handleBotClick}
                        activeOpacity={0.8}
                    >
                        <Animated.View
                            style={{
                                transform: [{ scale: scaleAnim }]
                            }}
                            className="w-14 h-14 justify-center items-center"
                        >
                            <Image
                                source={require('../../../assets/images/bodhi.webp')}
                                style={{
                                    width: 56,
                                    height: 56,
                                }}
                                resizeMode="cover"
                            />
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            )}

            {/* Chat Modal */}
            <Modal
                visible={isOpen}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsOpen(false)}
                statusBarTranslucent={true}
                presentationStyle="overFullScreen"
            >
                <KeyboardWrapper
                    className="flex-1 justify-end"
                    {...keyboardProps}
                >
                    <View className="flex-1 bg-black/30 justify-end">
                        <Animated.View
                            className="bg-white rounded-t-3xl overflow-hidden"
                            style={{
                                maxHeight: height * 0.85,
                                minHeight: height * 0.6
                            }}
                        >
                            {/* Header */}
                            <LinearGradient
                                colors={['#0B3D91', '#1a4ca3', '#2b5cb5']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="p-5"
                            >
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center flex-1">
                                        <View className="bg-white/20 p-2 rounded-2xl mr-3">
                                            <Image
                                                source={require('../../../assets/images/bodhi.webp')}
                                                className="w-10 h-10 rounded-full"
                                                resizeMode="cover"
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-white font-bold text-xl">
                                                {t('bot.name', 'बोधि')}
                                            </Text>
                                            <Text className="text-white/70 text-xs">
                                                {t('bot.role', 'Voice Assistant')}
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        onPress={handleBotClick}
                                        className="bg-white/20 p-2 rounded-full"
                                    >
                                        <MaterialIcons name="close" size={22} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>

                            {/* Messages */}
                            <ScrollView
                                className="flex-1 p-4 bg-gray-50"
                                ref={scrollViewRef}
                                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                                showsVerticalScrollIndicator={false}
                            >
                                {messages.map((msg, index) => {
                                    if (msg.type === 'route-card') {
                                        return (
                                            <View key={index} className="mb-3">
                                                <LinearGradient
                                                    colors={['#0B3D91', '#1a4ca3']}
                                                    className="p-4 rounded-2xl"
                                                >
                                                    <Text className="text-white font-bold text-lg mb-2">
                                                        {msg.source} → {msg.destination}
                                                    </Text>
                                                    <View className="flex-row justify-between">
                                                        <View className="items-center">
                                                            <Text className="text-white/70 text-xs">{t('bot.time', 'समय')}</Text>
                                                            <Text className="text-white font-bold">{msg.time}</Text>
                                                        </View>
                                                        <View className="items-center">
                                                            <Text className="text-white/70 text-xs">{t('bot.fare', 'किराया')}</Text>
                                                            <Text className="text-white font-bold">{msg.fare}</Text>
                                                        </View>
                                                        <View className="items-center">
                                                            <Text className="text-white/70 text-xs">{t('bot.stationsCount', 'स्टेशन')}</Text>
                                                            <Text className="text-white font-bold">{msg.stations}</Text>
                                                        </View>
                                                    </View>
                                                </LinearGradient>
                                            </View>
                                        );
                                    }

                                    return (
                                        <View
                                            key={index}
                                            className={`flex-row mb-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            {msg.type === 'bot' && (
                                                <View className="w-8 h-8 rounded-full bg-blue-100 mr-2 items-center justify-center overflow-hidden">
                                                    <Image
                                                        source={require('../../../assets/images/bodhi.webp')}
                                                        className="w-6 h-6"
                                                        resizeMode="cover"
                                                    />
                                                </View>
                                            )}
                                            <View
                                                className={`max-w-[75%] p-4 rounded-2xl ${msg.type === 'user'
                                                    ? 'bg-[#0B3D91] rounded-tr-none'
                                                    : 'bg-white rounded-tl-none shadow-sm border border-gray-100'
                                                    }`}
                                            >
                                                <Text className={`text-base ${msg.type === 'user' ? 'text-white' : 'text-gray-800'
                                                    }`}>
                                                    {msg.text}
                                                </Text>
                                                <Text className={`text-xs mt-1 ${msg.type === 'user' ? 'text-white/50' : 'text-gray-400'
                                                    }`}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                })}

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <View className="flex-row mb-3">
                                        <View className="w-8 h-8 rounded-full bg-blue-100 mr-2 items-center justify-center overflow-hidden">
                                            <Image
                                                source={require('../../../assets/images/bodhi.webp')}
                                                className="w-6 h-6"
                                                resizeMode="cover"
                                            />
                                        </View>
                                        <View className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                                            <View className="flex-row items-center space-x-1">
                                                {[0, 1, 2].map(i => (
                                                    <Animated.View
                                                        key={i}
                                                        style={{
                                                            width: 6,
                                                            height: 6,
                                                            borderRadius: 3,
                                                            backgroundColor: '#0B3D91',
                                                            opacity: waveAnim.interpolate({
                                                                inputRange: [0, 1],
                                                                outputRange: [0.3 + i * 0.2, 0.8 - i * 0.2]
                                                            })
                                                        }}
                                                    />
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </ScrollView>

                            {/* Input Area with Suggestions */}
                            <View className="bg-white border-t border-gray-200">
                                {/* Auto Suggestions while typing */}
                                {autoSuggestions.length > 0 && !isTyping && (
                                    <ScrollView
                                        horizontal
                                        className="px-4 pt-2 pb-1"
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        {autoSuggestions.map((suggestion, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => handleAutoSuggestionClick(suggestion)}
                                                className="bg-blue-50 px-3 py-1 rounded-full mr-2"
                                            >
                                                <Text className="text-blue-700 text-sm">{suggestion}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}

                                {/* Main Suggestions */}
                                {suggestions.length > 0 && !isTyping && (
                                    <View className="px-4 pt-3 pb-1">
                                        <Text className="text-xs text-gray-500 mb-1">{t('bot.try', 'Try:')}</Text>
                                        <View className="flex-row flex-wrap">
                                            {suggestions.map((suggestion, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    onPress={() => handleSuggestionClick(suggestion)}
                                                >
                                                    <Text className="text-blue-600 text-sm mr-4 mb-2">
                                                        {suggestion}
                                                        {index < suggestions.length - 1 ? "," : ""}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                )}

                                {/* Input */}
                                <View className="p-3">
                                    <View className="flex-row items-center bg-gray-100 rounded-full px-2">
                                        <TouchableOpacity
                                            onPress={handleMicClick}
                                            className={`p-3 rounded-full ${isListening ? 'bg-red-500' : ''}`}
                                        >
                                            <Animated.View style={{ transform: [{ rotate: isListening ? spin : '0deg' }] }}>
                                                <MaterialIcons
                                                    name={isListening ? "graphic-eq" : "mic"}
                                                    size={22}
                                                    color={isListening ? "white" : "#4b5563"}
                                                />
                                            </Animated.View>
                                        </TouchableOpacity>

                                        <TextInput
                                            className="flex-1 py-3 px-2 text-gray-800"
                                            placeholder={t('bot.placeholder', "यहाँ लिखें (जैसे: Patna Junction to PMCH )")}
                                            placeholderTextColor="#9CA3AF"
                                            value={text}
                                            onChangeText={setText}
                                            onSubmitEditing={() => handleTextSubmit()}
                                            returnKeyType="send"
                                        />

                                        <TouchableOpacity
                                            onPress={() => handleTextSubmit()}
                                            disabled={!text.trim()}
                                            className={`p-3 rounded-full ${text.trim() ? 'bg-[#0B3D91]' : 'bg-gray-300'}`}
                                        >
                                            <MaterialIcons name="send" size={18} color="white" />
                                        </TouchableOpacity>
                                    </View>

                                    <Text className="text-center text-gray-400 text-xs mt-2">
                                        {t('bot.tagline', 'बोधि स्मार्ट • पटना मेट्रो')}
                                    </Text>
                                </View>
                            </View>
                        </Animated.View>
                    </View>
                </KeyboardWrapper>
            </Modal>
        </View>
    );
};

export default Bot;