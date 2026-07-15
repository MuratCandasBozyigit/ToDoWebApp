import { useEffect, useRef, useState } from 'react';
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
import type { Todo } from '../types';

type Props = {
  todo: Todo;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => boolean;
};

export function TodoItem({ todo, index, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const appear = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(todo.completed ? 1 : 0.85)).current;

  useEffect(() => {
    Animated.timing(appear, {
      toValue: 1,
      duration: 320,
      delay: Math.min(index * 40, 240),
      useNativeDriver: true,
    }).start();
  }, [appear, index]);

  useEffect(() => {
    setDraft(todo.text);
  }, [todo.text]);

  useEffect(() => {
    Animated.spring(checkScale, {
      toValue: todo.completed ? 1 : 0.85,
      friction: 6,
      tension: 140,
      useNativeDriver: true,
    }).start();
  }, [checkScale, todo.completed]);

  const handleToggle = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics unavailable on web/simulator is fine.
    }
    onToggle(todo.id);
  };

  const handleDelete = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
      // Ignore.
    }
    onDelete(todo.id);
  };

  const commitEdit = () => {
    const ok = onUpdate(todo.id, draft);
    if (!ok) setDraft(todo.text);
    setEditing(false);
  };

  return (
    <Animated.View
      style={[
        styles.row,
        {
          opacity: appear,
          transform: [
            {
              translateY: appear.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.completed }}
        accessibilityLabel={todo.text}
        onPress={handleToggle}
        style={styles.checkHit}
      >
        <Animated.View
          style={[
            styles.checkbox,
            todo.completed && styles.checkboxDone,
            { transform: [{ scale: checkScale }] },
          ]}
        >
          {todo.completed ? <Text style={styles.checkMark}>✓</Text> : null}
        </Animated.View>
      </Pressable>

      <Pressable
        style={styles.content}
        onPress={() => setEditing(true)}
        onLongPress={() => setEditing(true)}
      >
        {editing ? (
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onBlur={commitEdit}
            onSubmitEditing={commitEdit}
            autoFocus
            returnKeyType="done"
            style={[styles.text, styles.input]}
          />
        ) : (
          <Text
            style={[styles.text, todo.completed && styles.textDone]}
            numberOfLines={3}
          >
            {todo.text}
          </Text>
        )}
      </Pressable>

      <Pressable
        accessibilityLabel="Görevi sil"
        onPress={handleDelete}
        hitSlop={10}
        style={styles.deleteHit}
      >
        <Text style={styles.delete}>Sil</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  checkHit: {
    paddingVertical: 4,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  checkboxDone: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  checkMark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  content: {
    flex: 1,
  },
  text: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
    lineHeight: 22,
    color: colors.ink,
  },
  textDone: {
    color: colors.inkSoft,
    textDecorationLine: 'line-through',
  },
  input: {
    padding: 0,
    margin: 0,
  },
  deleteHit: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  delete: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
    color: colors.danger,
  },
});
