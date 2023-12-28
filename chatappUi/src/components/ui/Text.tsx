import React from 'react';
import { StyleProp, TextStyle, TextProps } from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';
import { State } from '../../types';

interface Props extends TextProps {
  text?: string | number;
  buttonText?: boolean | false;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number | undefined;
}

const Text: React.FC<Props> = props => {
  const { text, buttonText, style, numberOfLines } = props;

  const Theme = useSelector<State>(state => state.Theme);

  const colorTextCode =
    Theme === 'Dark'
      ? '#fff'
      : Theme === 'NightBlue'
      ? '#fff'
      : Theme === 'Light'
      ? '#000'
      : '#000';

  const StyledText = styled.Text`
    font-size: 16px;
    font-family: Proxima Nova Alt Reg;
    color: ${(prop: Props) => (prop.buttonText ? '#fff' : colorTextCode)};
  `;

  return (
    <StyledText
      numberOfLines={numberOfLines}
      style={style}
      text={text}
      buttonText={buttonText}
      {...props}>
      {text}
    </StyledText>
  );
};
export default React.memo(Text);
