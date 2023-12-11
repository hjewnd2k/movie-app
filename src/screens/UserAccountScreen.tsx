import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme';
import {AppHeader, SettingComponent} from '../components';

type Props = NativeStackScreenProps<RootStackParamList, 'User'>;

const UserAccountScreen = ({navigation}: Props) => {
  return (
    <View style={styles.container}>
      <SafeAreaView />
      <StatusBar hidden />
      <View style={styles.appHeaderContainer}>
        <AppHeader
          name="close"
          header="My Profile"
          action={() => navigation.goBack()}
        />
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/image/avatar.png')}
          style={styles.avatarImage}
        />
        <Text style={styles.avatarText}>John Doe</Text>
      </View>

      <View style={styles.profileContainer}>
        <SettingComponent
          icon="user"
          heading="Account"
          subHeading="Edit Profile"
          subTitle="Change Password"
        />
        <SettingComponent
          icon="setting"
          heading="Settings"
          subHeading="Theme"
          subTitle="Permissions"
        />
        <SettingComponent
          icon="dollar"
          heading="Offers & Referrals"
          subHeading="Offer"
          subTitle="Referrals"
        />
        <SettingComponent
          icon="info"
          heading="About"
          subHeading="About Movies"
          subTitle="more"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginVertical: SPACING.space_20 * 2,
  },
  profileContainer: {
    alignItems: 'center',
    padding: SPACING.space_36,
  },
  avatarImage: {
    height: SPACING.space_20 * 4,
    width: SPACING.space_20 * 4,
    borderRadius: BORDERRADIUS.radius_25 * 4,
  },
  avatarText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
  },
});

export default UserAccountScreen;
