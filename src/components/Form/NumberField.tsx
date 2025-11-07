import { Controller, Control } from 'react-hook-form';
import { TextInput } from 'react-native-paper';

export type NumberFieldProps<T> = {
  control: Control<T>;
  name: keyof T;
  label: string;
  accessibilityLabel?: string;
  suffix?: string;
};

export const NumberField = <T extends Record<string, unknown>>({
  control,
  name,
  label,
  accessibilityLabel,
  suffix,
}: NumberFieldProps<T>) => (
  <Controller
    control={control}
    name={name as string}
    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
      <TextInput
        mode="outlined"
        label={label}
        value={value ? String(value) : ''}
        keyboardType="numeric"
        onBlur={onBlur}
        onChangeText={text => onChange(Number(text.replace(/[^\d.]/g, '')))}
        error={!!error}
        right={suffix ? <TextInput.Affix text={suffix} /> : undefined}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={error?.message}
      />
    )}
  />
);
