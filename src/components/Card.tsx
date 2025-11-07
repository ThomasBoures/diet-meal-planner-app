import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Card as PaperCard, useTheme } from 'react-native-paper';

export type CardProps = {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
};

export const Card = ({ title, right, children }: CardProps) => {
  const theme = useTheme();
  return (
    <PaperCard style={[styles.card, { backgroundColor: theme.colors.surface }]} accessibilityRole="summary">
      {title ? (
        <PaperCard.Title
          title={title}
          titleVariant="titleMedium"
          right={right ? () => <>{right}</> : undefined}
        />
      ) : null}
      <PaperCard.Content>{children}</PaperCard.Content>
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
  },
});
