import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, View} from 'react-native';
import {
  HomeScreen,
  SearchScreen,
  TicketScreen,
  UserAccountScreen,
} from '../screens';
import {COLORS, FONTSIZE, SPACING} from '../theme';
import {CustomIcon} from '../components';

const Tab = createBottomTabNavigator();

interface IPropsTabIcon {
  focused: boolean;
  color: string;
  size: number;
}

const TabNavigator = () => {
  const renderTabIcon = (props: IPropsTabIcon, name: string) => (
    <View
      style={[
        styles.activeTabBackground,
        props.focused ? {backgroundColor: COLORS.Orange} : {},
      ]}>
      <CustomIcon name={name} color={COLORS.White} size={FONTSIZE.size_30} />
    </View>
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.Black,
          borderTopWidth: 0,
          height: SPACING.space_10 * 10,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: (props: IPropsTabIcon) => renderTabIcon(props, 'video'),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: (props: IPropsTabIcon) => renderTabIcon(props, 'search'),
        }}
      />
      <Tab.Screen
        name="Ticket"
        component={TicketScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: (props: IPropsTabIcon) => renderTabIcon(props, 'ticket'),
        }}
      />
      <Tab.Screen
        name="User"
        component={UserAccountScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: (props: IPropsTabIcon) => renderTabIcon(props, 'user'),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  activeTabBackground: {
    backgroundColor: COLORS.Black,
    padding: SPACING.space_18,
    borderRadius: SPACING.space_18 * 10,
  },
});

export default TabNavigator;
