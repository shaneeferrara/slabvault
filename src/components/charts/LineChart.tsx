/**
 * LineChart — lightweight SVG line chart (react-native-svg works on
 * iOS, Android, and web). No native-only chart libraries.
 */
import { useId } from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop, Circle } from 'react-native-svg';
import { colors } from '../../theme/tokens';

interface Props {
  data: number[];
  width: number;
  height: number;
  color?: string;
}

function buildSmoothPath(pts: Array<[number, number]>): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) {
    const [x, y] = pts[0] as [number, number];
    return `M ${x} ${y} L ${x} ${y}`;
  }
  let d = `M ${pts[0]?.[0]} ${pts[0]?.[1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i] as [number, number];
    const p1 = pts[i + 1] as [number, number];
    const mx = (p0[0] + p1[0]) / 2;
    d += ` Q ${p0[0]} ${p0[1]}, ${mx} ${(p0[1] + p1[1]) / 2}`;
  }
  const last = pts[pts.length - 1] as [number, number];
  d += ` L ${last[0]} ${last[1]}`;
  return d;
}

export function LineChart({ data, width, height, color = colors.accent }: Props) {
  const gradientId = useId().replace(/:/g, '');
  const pad = 6;
  const w = Math.max(width - pad * 2, 1);
  const h = Math.max(height - pad * 2, 1);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const pts: Array<[number, number]> = data.map((v, i) => {
    const x = pad + (i / Math.max(data.length - 1, 1)) * w;
    const y = pad + (1 - (v - min) / span) * h;
    return [x, y];
  });

  const line = buildSmoothPath(pts);
  const first = pts[0] as [number, number];
  const last = pts[pts.length - 1] as [number, number];
  const area = `${line} L ${last[0]} ${pad + h} L ${first[0]} ${pad + h} Z`;

  return (
    <View>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={0.35} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Path d={area} fill={`url(#${gradientId})`} />
        <Path d={line} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <Circle cx={last[0]} cy={last[1]} r={4} fill={color} stroke={colors.background} strokeWidth={2} />
      </Svg>
    </View>
  );
}
