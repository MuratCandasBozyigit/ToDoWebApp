# Odak — Todo Uygulaması

iOS, Android ve web’de çalışan basit bir yapılacaklar listesi.

## Özellikler

- Görev ekleme, tamamlama, düzenleme ve silme
- Tümü / Aktif / Bitti filtreleri
- İlerleme çubuğu ve tamamlananları temizleme
- Cihazda kalıcı saklama (`AsyncStorage`)
- Expo ile iOS ve Android desteği

## Çalıştırma

```bash
npm install
npx expo start
```

Açılan menüden:

- `i` — iOS simülatör
- `a` — Android emülatör
- `w` — web tarayıcı
- Telefonda **Expo Go** ile QR kodu okutarak da çalıştırabilirsin

## Mobil derleme (isteğe bağlı)

```bash
npx eas build --platform ios
npx eas build --platform android
```

EAS hesabı ve `eas.json` yapılandırması gerekir.
