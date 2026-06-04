import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../../styles/theme';
import { styles } from './ScoreRing.styles';

interface ScoreRingProps {
  score: number;
  size?: number;
}

function getScoreColor(score: number): string {
  if (score <= 35) return colors.accent3;
  if (score <= 65) return colors.warn;
  return colors.danger;
}

export function ScoreRing({ score, size = 120 }: ScoreRingProps) {
  const ringRadius = 45;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const scoreColor = getScoreColor(score);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Circle
          cx="60"
          cy="60"
          r={ringRadius}
          fill="none"
          stroke="rgba(58,155,220,0.1)"
          strokeWidth="10"
        />
        <Circle
          cx="60"
          cy="60"
          r={ringRadius}
          fill="none"
          stroke={scoreColor}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
      </Svg>
      <View style={StyleSheet.absoluteFill as any}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[styles.scoreNum, { color: scoreColor }]}>{score}</Text>
          <Text style={styles.scoreSub}>/100</Text>
        </View>
      </View>
    </View>
  );
}
