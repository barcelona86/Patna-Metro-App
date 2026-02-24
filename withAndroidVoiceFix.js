const { withProjectBuildGradle, withAppBuildGradle, withAndroidManifest } = require('@expo/config-plugins');

const withAndroidVoiceFix = (config) => {
    // Fix 1: Completely exclude ALL legacy com.android.support libraries
    config = withProjectBuildGradle(config, (config) => {
        if (config.modResults.language === 'groovy') {
            const buildGradlePatch = `
allprojects {
    configurations.all {
        exclude group: 'com.android.support'
    }
}`;
            if (!config.modResults.contents.includes("exclude group: 'com.android.support'")) {
                config.modResults.contents += buildGradlePatch;
            }
        }
        return config;
    });

    // Fix 2: Add packagingOptions to handle any META-INF collisions
    config = withAppBuildGradle(config, (config) => {
        if (config.modResults.language === 'groovy') {
            const appBuildGradlePatch = `
android {
    packagingOptions {
        pickFirst 'META-INF/androidx.appcompat_appcompat.version'
        pickFirst 'META-INF/androidx.recyclerview_recyclerview.version'
        pickFirst 'META-INF/android.arch.lifecycle_viewmodel.version'
        pickFirst 'META-INF/android.arch.core_runtime.version'
        pickFirst 'META-INF/androidx.core_core.version'
        pickFirst 'META-INF/androidx.customview_customview.version'
        pickFirst 'META-INF/androidx.drawerlayout_drawerlayout.version'
        pickFirst 'META-INF/androidx.fragment_fragment.version'
        pickFirst 'META-INF/androidx.legacy_legacy-support-core-ui.version'
        pickFirst 'META-INF/androidx.legacy_legacy-support-core-utils.version'
        pickFirst 'META-INF/androidx.loader_loader.version'
        pickFirst 'META-INF/androidx.localbroadcastmanager_localbroadcastmanager.version'
        pickFirst 'META-INF/androidx.print_print.version'
        pickFirst 'META-INF/androidx.swiperefreshlayout_swiperefreshlayout.version'
        pickFirst 'META-INF/androidx.vectordrawable_vectordrawable-animated.version'
        pickFirst 'META-INF/androidx.vectordrawable_vectordrawable.version'
        pickFirst 'META-INF/androidx.versionedparcelable_versionedparcelable.version'
        pickFirst 'META-INF/androidx.viewpager_viewpager.version'
    }
}
`;
            if (!config.modResults.contents.includes("pickFirst 'META-INF/androidx.appcompat_appcompat.version'")) {
                config.modResults.contents += appBuildGradlePatch;
            }
        }
        return config;
    });

    // Fix 3: Add intents queries to AndroidManifest for Android 11+ SpeechRecognizer
    config = withAndroidManifest(config, (config) => {
        const manifest = config.modResults;
        if (!manifest.manifest.queries) {
            manifest.manifest.queries = [];
        }

        let hasSpeechQuery = false;
        if (manifest.manifest.queries.length > 0 && manifest.manifest.queries[0].intent) {
            hasSpeechQuery = manifest.manifest.queries[0].intent.some(i =>
                i.action && i.action.some(a => a.$['android:name'] === 'android.speech.RecognitionService')
            );
        }

        if (!hasSpeechQuery) {
            const speechIntent = {
                action: [{ $: { 'android:name': 'android.speech.RecognitionService' } }]
            };

            if (manifest.manifest.queries.length === 0) {
                manifest.manifest.queries.push({ intent: [speechIntent] });
            } else {
                if (!manifest.manifest.queries[0].intent) {
                    manifest.manifest.queries[0].intent = [];
                }
                manifest.manifest.queries[0].intent.push(speechIntent);
            }
        }
        return config;
    });

    return config;
};

module.exports = withAndroidVoiceFix;
