import { Controller, Control } from 'react-hook-form';
import { TextInput } from 'react-native-paper';

export type TextFieldProps<T> = {
  control: Control<T>;
  name: keyof T;
  label: string;
  accessibilityLabel?: string;
};

export const TextField = <T extends Record<string, unknown>>({
  control,
  name,
  label,
  accessibilityLabel,
}: TextFieldProps<T>) => (
  <Controller
    control={control}
    name={name as string}
    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
      <TextInput
        mode="outlined"
        label={label}
        value={(value as string) ?? ''}
        onBlur={onBlur}
        onChangeText={onChange}
        error={!!error}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={error?.message}
      />
    )}
  />
);
