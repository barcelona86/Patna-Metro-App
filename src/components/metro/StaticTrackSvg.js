import React from 'react';
import Svg, { Line, G } from 'react-native-svg';

const StaticTrackSvg = ({ width = "100%", height = 20, ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 1000 20" preserveAspectRatio="none" {...props}>
            <G>
                <Line x1="0" y1="10" x2="1000" y2="10" stroke="#9E9E9E" strokeWidth="6" />
                <Line x1="0" y1="7" x2="1000" y2="7" stroke="#757575" strokeWidth="2" />

                {/* Optional Track Dividers for realism */}
                {[...Array(50)].map((_, i) => (
                    <Line key={i} x1={i * 20} y1="13" x2={i * 20} y2="15" stroke="#424242" strokeWidth="4" />
                ))}
            </G>
        </Svg>
    );
};

export default StaticTrackSvg;