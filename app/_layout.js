import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import "../global.css";
import '../src/utils/i18n';
import Bot from '../src/components/bot/Bot';
import Navbar from '../src/components/ui/Navbar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <StatusBar style="light" backgroundColor="#0B3D91" />
                <Navbar />
                <Stack screenOptions={{
                    headerStyle: {
                        backgroundColor: '#0B3D91',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    contentStyle: {
                        backgroundColor: '#FFFFFF',
                    }
                }}>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen
                        name="routefinder"
                        options={{
                            title: 'Route Finder',
                            headerShown: false
                        }}
                    />
                    <Stack.Screen
                        name="map"
                        options={{
                            title: 'Network Map',
                            headerShown: false
                        }}
                    />
                    <Stack.Screen
                        name="fare-info"
                        options={{
                            title: 'Fare Information',
                            headerShown: false
                        }}
                    />
                    <Stack.Screen
                        name="about"
                        options={{
                            title: 'About Project',
                            headerShown: false
                        }}
                    />
                </Stack>
                <Bot />
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}