import { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';

type Props = {
  onAdd: (text: string) => boolean;
};

export function TodoInput({ onAdd }: Props) {
  const [text, setText] = useState('');
  const scale = useRef(new Animated.Value(1)).current;

  const submit = async () => {
    const ok = onAdd(text);
    if (!ok) return;

    setText('');
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Ignore.
    }

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.94,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 160,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.wrap}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Yeni bir görev yaz..."
        placeholderTextColor={colors.inkSoft}
        returnKeyType="done"
        onSubmitEditing={submit}
        style={styles.input}
        accessibilityLabel="Yeni görev"
      />
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPress={submit}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Görev ekle"
        >
          <Text style={styles.buttonText}>Ekle</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 8,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
  },
  input: {
    flex: 1,
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: colors.ink,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    color: colors.ink,
  },
});
