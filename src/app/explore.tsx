import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const tips = [
  'Gå rundt bordet og si én ting som passer til ordet.',
  'Imposteren må blende inn uten å vite ordet.',
  'Stem ut én mistenkelig spiller når runden er ferdig.',
  'Hvis imposteren blir stemt ut, vinner de sivile med én gang.',
  'Hvis en sivil blir stemt ut, fortsetter resten å spille.',
  'Imposteren vinner når bare én sivil er igjen.',
];

export default function ExploreScreen() {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.kicker}>Kort guide</Text>
            <Text style={styles.title}>Spill smart. Hør normal ut.</Text>
            <Text style={styles.subtitle}>
              Bruk denne siden når gruppen trenger en rask forklaring av spillet.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Regler</Text>
            {tips.map((tip, index) => (
              <View key={tip} style={styles.row}>
                <Text style={styles.number}>{index + 1}</Text>
                <Text style={styles.rowText}>{tip}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#16211A',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: 18,
    padding: 20,
    paddingBottom: 116,
  },
  header: {
    gap: 10,
    paddingTop: 14,
  },
  kicker: {
    color: '#F8F0E3',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: '#F8F0E3',
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 46,
  },
  subtitle: {
    color: '#D7CBBB',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 23,
  },
  card: {
    borderRadius: 8,
    backgroundColor: '#F8F0E3',
    padding: 18,
    gap: 14,
    borderWidth: 2,
    borderColor: '#172116',
  },
  cardTitle: {
    color: '#172116',
    fontSize: 22,
    fontWeight: '900',
  },
  row: {
    minHeight: 48,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  number: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#F25C54',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 30,
    textAlign: 'center',
  },
  rowText: {
    flex: 1,
    color: '#172116',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
});
