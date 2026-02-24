import React from 'react';
import Svg, { Rect, Circle, Path, G, Line, Text } from 'react-native-svg';

const RenderEngine = ({ xOffset, isBack = false }) => {
    const transform = `translate(${xOffset}, 0) ${isBack ? 'scale(-1, 1) translate(-170, 0)' : ''}`;

    return (
        <G transform={transform}>
            {/* Base Shape (Warm Beige) */}
            <Path d="M 20 50 Q 5 50 5 30 Q 5 10 20 10 L 170 10 L 170 50 Z" fill="#E6A15C" />

            {/* Maroon Upper Stripe */}
            <Path d="M 20 10 L 170 10 L 170 24 L 8 24 Q 4 15 20 10 Z" fill="#8B1E2D" />

            {/* Dark Charcoal Front Cabin */}
            <Path d="M 20 50 Q 5 50 5 30 Q 5 10 20 10 L 45 10 L 35 50 Z" fill="#2C2C2C" />

            {/* Front Windshield */}
            <Path d="M 15 30 Q 10 20 20 12 L 35 12 L 28 30 Z" fill="#1A1A1A" />

            {/* Roof line */}
            <Rect x="20" y="6" width="150" height="4" rx="2" fill="#BDBDBD" />
            {/* Undercarriage dark trim */}
            <Rect x="15" y="47" width="155" height="3" fill="#424242" />

            {/* Headlight */}
            <Circle cx="10" cy="40" r="2" fill="#FFFFCC" />
            <Path d="M 8 40 L 0 35 L 0 45 Z" fill="#FFFFCC" opacity="0.4" />

            {/* Patna Metro Text Highlight */}
            <Text
                transform={isBack ? "scale(-1, 1)" : ""}
                x={isBack ? "-105" : "105"}
                y="19"
                fill="#FFFFFF"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
            >
                PATNA METRO
            </Text>

            {/* Windows */}
            <Rect x="55" y="24" width="22" height="14" rx="2" fill="#1A1A1A" />
            <Rect x="100" y="24" width="22" height="14" rx="2" fill="#1A1A1A" />
            <Rect x="145" y="24" width="20" height="14" rx="2" fill="#1A1A1A" />

            {/* Door 1 */}
            <Rect x="82" y="20" width="14" height="27" rx="1" fill="#C4C4C4" />
            <Line x1="89" y1="20" x2="89" y2="47" stroke="#333" strokeWidth="0.5" />
            <Rect x="83.5" y="24" width="4.5" height="12" rx="0.5" fill="#1A1A1A" />
            <Rect x="90" y="24" width="4.5" height="12" rx="0.5" fill="#1A1A1A" />

            {/* Door 2 */}
            <Rect x="127" y="20" width="14" height="27" rx="1" fill="#C4C4C4" />
            <Line x1="134" y1="20" x2="134" y2="47" stroke="#333" strokeWidth="0.5" />
            <Rect x="128.5" y="24" width="4.5" height="12" rx="0.5" fill="#1A1A1A" />
            <Rect x="135" y="24" width="4.5" height="12" rx="0.5" fill="#1A1A1A" />

            {/* Texture / Patterns (Subtle cultural geometrics) */}
            <Path d="M 50 45 L 60 45 L 55 35 Z" fill="#8B1E2D" opacity="0.3" />
            <Path d="M 60 45 L 70 45 L 65 35 Z" fill="#FFFFFF" opacity="0.4" />

            {/* Wheels */}
            <Circle cx="50" cy="55" r="5" fill="#333333" />
            <Circle cx="50" cy="55" r="2" fill="#777777" />
            <Circle cx="70" cy="55" r="5" fill="#333333" />
            <Circle cx="70" cy="55" r="2" fill="#777777" />

            <Circle cx="130" cy="55" r="5" fill="#333333" />
            <Circle cx="130" cy="55" r="2" fill="#777777" />
            <Circle cx="150" cy="55" r="5" fill="#333333" />
            <Circle cx="150" cy="55" r="2" fill="#777777" />
        </G>
    );
};

const RenderCoach = ({ xOffset }) => {
    return (
        <G transform={`translate(${xOffset}, 0)`}>
            {/* Main Body (Warm Beige) */}
            <Rect x="0" y="10" width="170" height="40" fill="#E6A15C" />

            {/* Maroon Stripe */}
            <Rect x="0" y="10" width="170" height="14" fill="#8B1E2D" />

            {/* Roof line */}
            <Rect x="0" y="6" width="170" height="4" rx="2" fill="#BDBDBD" />
            {/* Undercarriage dark trim */}
            <Rect x="0" y="47" width="170" height="3" fill="#424242" />

            {/* Windows */}
            <Rect x="15" y="24" width="22" height="14" rx="2" fill="#1A1A1A" />
            <Rect x="60" y="24" width="22" height="14" rx="2" fill="#1A1A1A" />
            <Rect x="105" y="24" width="22" height="14" rx="2" fill="#1A1A1A" />
            <Rect x="150" y="24" width="15" height="14" rx="2" fill="#1A1A1A" />

            {/* Door 1 */}
            <Rect x="42" y="20" width="14" height="27" rx="1" fill="#C4C4C4" />
            <Line x1="49" y1="20" x2="49" y2="47" stroke="#333" strokeWidth="0.5" />
            <Rect x="43.5" y="24" width="4.5" height="12" rx="0.5" fill="#1A1A1A" />
            <Rect x="50" y="24" width="4.5" height="12" rx="0.5" fill="#1A1A1A" />

            {/* Door 2 */}
            <Rect x="87" y="20" width="14" height="27" rx="1" fill="#C4C4C4" />
            <Line x1="94" y1="20" x2="94" y2="47" stroke="#333" strokeWidth="0.5" />
            <Rect x="88.5" y="24" width="4.5" height="12" rx="0.5" fill="#1A1A1A" />
            <Rect x="95" y="24" width="4.5" height="12" rx="0.5" fill="#1A1A1A" />

            {/* Door 3 */}
            <Rect x="132" y="20" width="14" height="27" rx="1" fill="#C4C4C4" />
            <Line x1="139" y1="20" x2="139" y2="47" stroke="#333" strokeWidth="0.5" />
            <Rect x="133.5" y="24" width="4.5" height="12" rx="0.5" fill="#1A1A1A" />
            <Rect x="140" y="24" width="4.5" height="12" rx="0.5" fill="#1A1A1A" />

            {/* Texture / Patterns */}
            <Path d="M 20 45 L 30 45 L 25 35 Z" fill="#8B1E2D" opacity="0.3" />
            <Path d="M 30 45 L 40 45 L 35 35 Z" fill="#FFFFFF" opacity="0.4" />
            <Path d="M 105 45 L 115 45 L 110 35 Z" fill="#8B1E2D" opacity="0.3" />

            {/* Wheels */}
            <Circle cx="25" cy="55" r="5" fill="#333333" />
            <Circle cx="25" cy="55" r="2" fill="#777777" />
            <Circle cx="45" cy="55" r="5" fill="#333333" />
            <Circle cx="45" cy="55" r="2" fill="#777777" />

            <Circle cx="125" cy="55" r="5" fill="#333333" />
            <Circle cx="125" cy="55" r="2" fill="#777777" />
            <Circle cx="145" cy="55" r="5" fill="#333333" />
            <Circle cx="145" cy="55" r="2" fill="#777777" />
        </G>
    );
};

const RenderConnector = ({ xOffset }) => {
    return (
        <G transform={`translate(${xOffset}, 0)`}>
            <Rect x="0" y="25" width="10" height="20" fill="#2C2C2C" />
            <Rect x="0" y="20" width="10" height="30" fill="#1A1A1A" opacity="0.8" />
            <Line x1="0" y1="40" x2="10" y2="40" stroke="#000" strokeWidth="2" />
            <Line x1="0" y1="44" x2="10" y2="44" stroke="#000" strokeWidth="2" />
        </G>
    );
};

const AnimatedTrainComponent = ({ width = 800, height = 70, ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 800 70" {...props}>
            <G transform="translate(10, 5)">
                {/* Total length is exactly ~710px, giving it perfect breathing room in the 800px box */}
                <RenderEngine xOffset={0} />
                <RenderConnector xOffset={170} />
                <RenderCoach xOffset={180} />
                <RenderConnector xOffset={350} />
                <RenderCoach xOffset={360} />
                <RenderConnector xOffset={530} />
                <RenderEngine xOffset={540} isBack={true} />
            </G>
        </Svg>
    );
};

export default AnimatedTrainComponent;
