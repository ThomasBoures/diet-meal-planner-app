import { useState } from 'react';
import { View } from 'react-native';
import { HelperText, Menu, TextInput } from 'react-native-paper';
import { Control, Controller } from 'react-hook-form';

export type Option<T> = {
  label: string;
  value: T;
};

export type SelectFieldProps<T, K extends keyof T> = {
  control: Control<T>;
  name: K;
  label: string;
  options: Option<T[K]>[];
  accessibilityLabel?: string;
};

export const SelectField = <T extends Record<string, unknown>, K extends keyof T>({
  control,
  name,
  label,
  options,
  accessibilityLabel,
}: SelectFieldProps<T, K>) => {
  const [visible, setVisible] = useState(false);
  return (
    <Controller
      control={control}
      name={name as string}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View>
          <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchor={
              <TextInput
                mode="outlined"
                label={label}
                value={options.find(option => option.value === value)?.label ?? ''}
                right={<TextInput.Icon icon="menu-down" />}
                editable={false}
                onPressIn={() => setVisible(true)}
                accessibilityLabel={accessibilityLabel ?? label}
              />
            }
          >
            {options.map(option => (
              <Menu.Item
                key={String(option.value)}
                onPress={() => {
                  onChange(option.value);
                  setVisible(false);
                }}
                title={option.label}
              />
            ))}
          </Menu>
          {error ? <HelperText type="error">{error.message}</HelperText> : null}
        </View>
      )}
    />
  );
};
