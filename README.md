# Mobile Imposter Game

A small Expo app for playing the imposter word game on mobile.

One player is the imposter and does not get the word. Everyone else gets the same Norwegian word. Players take turns saying something connected to the word, then vote someone out at the end of each round.

## Run

```bash
npm install
npm start
```

Then open the app with Expo Go, the iOS simulator, or Android emulator.

For iPhone with Expo Go, LAN is usually the most stable option:

```bash
npx expo start --clear --lan
```

## Checks

```bash
npm run lint
npx tsc --noEmit
npx expo-doctor
```

## Stack

- Expo SDK 54
- React Native
- Expo Router
- TypeScript
