
/**
 * @providesModule FlyCheckBox
 * @flow
 *
 */
import React,{PropTypes} from 'react';
import {
  StyleSheet,
  TouchableOpacity
} from 'react-native';

const Icon = require('FlyIconfonts');
const FlyDimensions = require('FlyDimensions');
const {Text} = require('FlyText');

export default function FlyCheckBox(props) {
  const iconName = props.checked ? props.checkedIconName : props.uncheckedIconName;
  const styles = StyleSheet.create({
    label: {
      fontSize: FlyDimensions.fontSizeXl,
    },
  });

  function onPress() {
    props.onPress(!props.checked);
  }

  return (

    <Icon.Button
      {...props}
      name={iconName}
      size={props.size}
      backgroundColor={props.backgroundColor}
      color={props.color}
      iconStyle={[styles.icon, props.iconStyle, props.checked && props.checkedIconStyle]}
      onPress={onPress}
      activeOpacity={props.activeOpacity}
      underlayColor={props.underlayColor}
      borderRadius={props.borderRadius}
    >
      <Text style={[styles.label, props.labelStyle]}>
        {props.label}
      </Text>
    </Icon.Button>
  );
}

FlyCheckBox.propTypes = {
  size: PropTypes.number,
  checked: PropTypes.bool,
  label: PropTypes.string,
  labelStyle: PropTypes.any,
  iconStyle: PropTypes.any,
  checkedIconStyle: PropTypes.any,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  onPress: PropTypes.func,
  underlayColor: PropTypes.string,
  activeOpacity: PropTypes.number,
  borderRadius: PropTypes.number,
  uncheckedIconName: PropTypes.string,
  checkedIconName: PropTypes.string,
};

FlyCheckBox.defaultProps = {
  size: 30,
  checked: false,
  labelStyle: {},
  iconStyle: {},
  checkedIconStyle: {},
  color: '#000',
  backgroundColor: 'rgba(0,0,0,0)',
  underlayColor: 'rgba(0,0,0,0)',
  activeOpacity: 1,
  borderRadius: 5,
  uncheckedIconName: 'check-box-outline-blank',
  checkedIconName: 'check-box',
};
