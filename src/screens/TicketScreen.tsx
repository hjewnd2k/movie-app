import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ITicketParams, RootStackParamList} from '../types';
import EncryptedStorage from 'react-native-encrypted-storage';
import {AppHeader, CustomIcon} from '../components';
import {BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme';
import LinearGradient from 'react-native-linear-gradient';
import DashedLine from 'react-native-dashed-line';

type Props = NativeStackScreenProps<RootStackParamList, 'Ticket'>;

const TicketScreen = ({navigation, route}: Props) => {
  const [ticketData, setTicketData] = useState<ITicketParams>(route.params);

  useEffect(() => {
    (async () => {
      try {
        const ticket = await EncryptedStorage.getItem('ticket');
        if (ticket) {
          setTicketData(JSON.parse(ticket));
        }
      } catch (error) {
        console.error(`Something went wrong while getting the Data ${error}`);
      }
    })();
  }, [route.params]);

  if (!ticketData) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.appHeaderContainer}>
          <AppHeader
            name="close"
            header="My Tickets"
            action={() => navigation.goBack()}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.appHeaderContainer}>
        <AppHeader
          name="close"
          header="My Tickets"
          action={() => navigation.goBack()}
        />
      </View>

      <View style={styles.ticketContainer}>
        <ImageBackground
          source={{uri: ticketData?.ticketImage}}
          style={styles.ticketBGImage}>
          <LinearGradient
            colors={[COLORS.OrangeRGBA0, COLORS.Orange]}
            style={styles.linearGradient}>
            <View style={[styles.blackCircle, styles.leftBottom_40]} />
            <View style={[styles.blackCircle, styles.rightBottom_40]} />
          </LinearGradient>
        </ImageBackground>
        <DashedLine
          dashLength={10}
          dashColor={COLORS.Orange}
          style={styles.linear}
        />
        <View style={styles.ticketFooter}>
          <View style={[styles.blackCircle, styles.leftTop_40]} />
          <View style={[styles.blackCircle, styles.rightTop_40]} />
          <View style={styles.ticketDateContainer}>
            <View>
              <Text style={styles.dateTitle}>{ticketData?.date?.date}</Text>
              <Text style={styles.subTitle}>{ticketData?.date?.day}</Text>
            </View>
            <View>
              <CustomIcon name="clock" style={styles.clockIcon} />
              <Text style={styles.subTitle}>{ticketData?.time}</Text>
            </View>
          </View>
          <View style={styles.ticketSeatContainer}>
            <View style={styles.subTitleContainer}>
              <Text style={styles.subHeading}>Hall</Text>
              <Text style={styles.subTitle}>02</Text>
            </View>
            <View style={styles.subTitleContainer}>
              <Text style={styles.subHeading}>Row</Text>
              <Text style={styles.subTitle}>04</Text>
            </View>
            <View style={styles.subTitleContainer}>
              <Text style={styles.subHeading}>Seats</Text>
              <Text style={styles.subTitle}>
                {ticketData?.seatArray?.slice(0, 4)?.join(', ')}
              </Text>
            </View>
          </View>
          <Image
            source={require('../assets/image/barcode.png')}
            style={styles.barcodeImage}
          />
        </View>
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
  ticketContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  ticketBGImage: {
    alignSelf: 'center',
    width: SPACING.space_10 * 30,
    aspectRatio: 2 / 3,
    borderTopLeftRadius: BORDERRADIUS.radius_25,
    borderTopRightRadius: BORDERRADIUS.radius_25,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  linearGradient: {
    height: '70%',
  },
  linear: {
    width: SPACING.space_10 * 30,
    alignSelf: 'center',
  },
  ticketFooter: {
    backgroundColor: COLORS.Orange,
    width: SPACING.space_10 * 30,
    alignItems: 'center',
    paddingBottom: SPACING.space_36,
    alignSelf: 'center',
    borderBottomLeftRadius: BORDERRADIUS.radius_25,
    borderBottomRightRadius: BORDERRADIUS.radius_25,
  },
  ticketDateContainer: {
    flexDirection: 'row',
    gap: SPACING.space_36,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.space_10,
  },
  dateTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  subTitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  clockIcon: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
    paddingBottom: SPACING.space_10,
  },
  ticketSeatContainer: {
    flexDirection: 'row',
    gap: SPACING.space_36,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.space_10,
  },
  subTitleContainer: {
    alignItems: 'center',
  },
  subHeading: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.White,
  },
  barcodeImage: {
    height: SPACING.space_10 * 5,
    aspectRatio: 158 / 52,
  },
  blackCircle: {
    height: SPACING.space_20 * 4,
    width: SPACING.space_20 * 4,
    borderRadius: BORDERRADIUS.radius_25 * 4,
    backgroundColor: COLORS.Black,
    position: 'absolute',
  },
  leftBottom_40: {
    left: -40,
    bottom: -40,
  },
  rightBottom_40: {
    right: -40,
    bottom: -40,
  },
  leftTop_40: {
    left: -40,
    top: -40,
  },
  rightTop_40: {
    right: -40,
    top: -40,
  },
});

export default TicketScreen;
