module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest-setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|react-clone-referenced-element|@react-navigation|@react-native-async-storage/async-storage|expo(nent)?|@expo|expo-font|expo-asset|expo-constants|expo-haptics|@expo/vector-icons)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
