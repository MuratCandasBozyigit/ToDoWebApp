import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  useFonts,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { EmptyState } from './src/components/EmptyState';
import { FilterBar } from './src/components/FilterBar';
import { TodoInput } from './src/components/TodoInput';
import { TodoItem } from './src/components/TodoItem';
import { useTodos } from './src/hooks/useTodos';
import { colors } from './src/theme/colors';

function AppContent() {
  const {
    ready,
    visibleTodos,
    filter,
    setFilter,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
  } = useTodos();

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 560,
        useNativeDriver: true,
      }),
      Animated.timing(heroTranslate, {
        toValue: 0,
        duration: 560,
        useNativeDriver: true,
      }),
    ]).start();
  }, [heroOpacity, heroTranslate]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.white} size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <View style={styles.hero}>
          <Animated.View
            style={{
              opacity: heroOpacity,
              transform: [{ translateY: heroTranslate }],
            }}
          >
            <Text style={styles.brand}>Odak</Text>
            <Text style={styles.tagline}>
              Gününü sadeleştir. Yapılacakları tek yerde tut.
            </Text>
          </Animated.View>

          <View style={styles.progressBlock}>
            <Text style={styles.progressLabel}>
              {stats.total === 0
                ? 'İlk görevini ekle'
                : `${stats.completed}/${stats.total} tamamlandı`}
            </Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width:
                      stats.total === 0
                        ? '0%'
                        : `${Math.round((stats.completed / stats.total) * 100)}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.toolbar}>
            <FilterBar value={filter} onChange={setFilter} />
            {stats.completed > 0 ? (
              <Pressable onPress={clearCompleted} hitSlop={8}>
                <Text style={styles.clear}>Temizle</Text>
              </Pressable>
            ) : (
              <Text style={styles.activeCount}>{stats.active} aktif</Text>
            )}
          </View>

          <FlatList
            data={visibleTodos}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState filter={filter} />}
            renderItem={({ item, index }) => (
              <TodoItem
                todo={item}
                index={index}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
              />
            )}
          />

          <SafeAreaView edges={['bottom']} style={styles.composer}>
            <TodoInput onAdd={addTodo} />
          </SafeAreaView>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.brand} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[colors.bgTop, colors.bgMid, colors.bgBottom]}
        locations={[0, 0.38, 1]}
        style={styles.flex}
      >
        <StatusBar style="light" />
        <AppContent />
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgBottom,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 22,
  },
  brand: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 48,
    lineHeight: 54,
    color: colors.white,
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: 8,
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.82)',
    maxWidth: 320,
  },
  progressBlock: {
    gap: 10,
  },
  progressLabel: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.78)',
  },
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  panel: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 18,
    overflow: 'hidden',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  clear: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
    color: colors.danger,
  },
  activeCount: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
    color: colors.inkMuted,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexGrow: 1,
  },
  composer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
});
