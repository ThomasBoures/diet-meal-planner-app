import { FlatList, StyleSheet, View } from 'react-native';
import { List, Searchbar, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { useFoodsStore } from '../stores/foodsStore';

const FoodsScreen = () => {
  const { t } = useTranslation();
  const query = useFoodsStore(state => state.query);
  const setQuery = useFoodsStore(state => state.setQuery);
  const filtered = useFoodsStore(state => state.filtered);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={t('foods.search')}
        value={query}
        onChangeText={setQuery}
        accessibilityLabel={t('foods.search')}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>{t('foods.empty')}</Text>}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`${item.portion_g} g · ${item.kcal} kcal`}
            accessibilityLabel={`${item.name} ${item.kcal} calories`}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  list: {
    paddingBottom: 120,
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
  },
});

export default FoodsScreen;
