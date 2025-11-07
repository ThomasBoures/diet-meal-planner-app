import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const TIMELINE = [
  {
    title: 'Week 1 – Discovery',
    items: [
      'Sketch wireframes that outline the onboarding form and meal selection flow.',
      'Document BMI/BMR research and confirm which formulas the team will implement.',
      'Spin up a Trello board with columns for Backlog, In Progress, Review, and Done.',
    ],
  },
  {
    title: 'Week 2 – Foundations',
    items: [
      'Implement authentication placeholders (name + passcode) and persist mock user data.',
      'Complete the health data intake form and validate numeric inputs.',
      'Keep updating Trello cards with owners, due dates, and status.',
    ],
  },
  {
    title: 'Week 3 – Menu Builder',
    items: [
      'Add curated breakfast and lunch options, each with calories and macro estimates.',
      'Allow the user to choose a meal for each category and preview the assembled plan.',
      'Demo progress to stakeholders and capture feedback in Trello.',
    ],
  },
  {
    title: 'Week 4 – Polish & QA',
    items: [
      'Complete dinner and snack sections and surface calorie splits per meal.',
      'Write table-top test cases that cover healthy-weight users vs. weight-loss users.',
      'Package the Expo project (src + assets) for submission before 3rd Dec, 5 pm.',
    ],
  },
];

const FORMULAS = [
  {
    label: 'Body Mass Index (BMI)',
    expression: 'BMI = weight(kg) ÷ (height(m))²',
    notes:
      'We classify BMI under 18.5 as underweight, 18.5-24.9 as healthy, 25-29.9 as overweight, and 30+ as obese to trigger weight-loss guidance.',
  },
  {
    label: 'Basal Metabolic Rate (BMR)',
    expression: 'Mifflin-St Jeor: 10 × weight + 6.25 × height − 5 × age + s',
    notes:
      "Where s = 5 for men and -161 for women. Multiply BMR by an activity factor to estimate TDEE (total daily energy expenditure).",
  },
  {
    label: 'Calorie Target',
    expression: 'Target = max(1200, round(TDEE + deficit))',
    notes:
      'We subtract 300-750 kcal depending on the chosen intensity to keep the deficit realistic while preserving energy for training.',
  },
];

export default function ExploreScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          Project playbook
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Revisit the plan, formulas, and submission checklist for the Diet / Meal Planner App whenever you need a refresher.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Delivery timeline
        </ThemedText>
        {TIMELINE.map((phase) => (
          <View key={phase.title} style={styles.timelineBlock}>
            <ThemedText style={styles.timelineTitle}>{phase.title}</ThemedText>
            {phase.items.map((item) => (
              <View key={item} style={styles.bulletRow}>
                <View style={styles.bullet} />
                <ThemedText style={styles.bulletText}>{item}</ThemedText>
              </View>
            ))}
          </View>
        ))}
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Calculation cheatsheet
        </ThemedText>
        {FORMULAS.map((formula) => (
          <View key={formula.label} style={styles.formulaBlock}>
            <ThemedText style={styles.formulaLabel}>{formula.label}</ThemedText>
            <ThemedText style={styles.formulaExpression}>{formula.expression}</ThemedText>
            <ThemedText style={styles.formulaNotes}>{formula.notes}</ThemedText>
          </View>
        ))}
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Tips for Trello hygiene
        </ThemedText>
        <View style={styles.bulletRow}>
          <View style={styles.bullet} />
          <ThemedText style={styles.bulletText}>Add acceptance criteria and screenshots to each user story card.</ThemedText>
        </View>
        <View style={styles.bulletRow}>
          <View style={styles.bullet} />
          <ThemedText style={styles.bulletText}>Label cards by platform (UI, Logic, QA) so the workload is transparent.</ThemedText>
        </View>
        <View style={styles.bulletRow}>
          <View style={styles.bullet} />
          <ThemedText style={styles.bulletText}>Use checklists for subtasks such as API research, mock data, and QA passes.</ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 48,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    lineHeight: 22,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  timelineBlock: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d0d7de',
    padding: 12,
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  timelineTitle: {
    fontWeight: '700',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    backgroundColor: '#0a7ea4',
  },
  bulletText: {
    flex: 1,
    lineHeight: 20,
  },
  formulaBlock: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d0d7de',
    padding: 12,
    marginTop: 12,
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  formulaLabel: {
    fontWeight: '700',
  },
  formulaExpression: {
    fontFamily: Platform.select({ ios: 'menlo', default: 'monospace' }),
  },
  formulaNotes: {
    lineHeight: 20,
    color: '#5a6570',
  },
});
