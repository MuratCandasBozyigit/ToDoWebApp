import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { Filter } from '../types';

type Props = {
  filter: Filter;
};

const COPY: Record<Filter, { title: string; body: string }> = {
  all: {
    title: 'Henüz görev yok',
    body: 'Bugün için ilk adımı yaz ve Odak’a bırak.',
  },
  active: {
    title: 'Aktif görev kalmadı',
    body: 'Hepsi tamam — kısa bir mola iyi gelir.',
  },
  completed: {
    title: 'Tamamlanan yok',
    body: 'Bir görevi işaretlediğinde burada görünecek.',
  },
};

export function EmptyState({ filter }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const copy = COPY[filter];

  useEffect(() => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [filter, opacity]);

  return (
    <Animated.View style={[styles.wrap, { opacity }]}>
      <View style={styles.mark} />
      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.body}>{copy.body}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
  },
  mark: {
    width: 56,
    height: 56,
    borderRadius: 18,
    marginBottom: 18,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: 'rgba(226, 160, 8, 0.35)',
  },
  title: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 22,
    color: colors.ink,
    marginBottom: 8,
    textAlign: 'center',
  },
  body: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
});
