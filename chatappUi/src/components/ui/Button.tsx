import React, { useCallback } from 'react';
import { StyleProp, ViewStyle, TouchableOpacity } from 'react-native';

interface ButtonProps {
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: Function | void;
  onLongPress?: Function | void;
  children?: JSX.Element | JSX.Element[];
  activeOpacity?: number;
}

const Button: React.FC<ButtonProps> = props => {
  const { style, onPress, onLongPress, children, disabled, activeOpacity } = props;

  const onButtonLongPress = useCallback(() => {
    if (disabled) {
      return;
    }

    if (typeof onLongPress !== 'function') {
      return;
    }
    onLongPress();
  }, [disabled, onLongPress]);

  const onButtonPress = useCallback(() => {
    if (disabled) {
      return;
    }

    if (typeof onPress !== 'function') {
      return;
    }
    onPress();
  }, [disabled, onPress]);

  return (
    <TouchableOpacity
      onPress={onButtonPress}
      onLongPress={onButtonLongPress}
      activeOpacity={activeOpacity ? activeOpacity : 0.8}
      disabled={disabled}
      style={style}>
      {children}
    </TouchableOpacity>
  );
};

Button.defaultProps = {
  activeOpacity: 0.8,
};

export default Button;
