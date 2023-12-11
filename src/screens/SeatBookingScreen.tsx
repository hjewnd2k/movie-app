import {
  FlatList,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {IWeekday, RootStackParamList} from '../types';
import {BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme';
import LinearGradient from 'react-native-linear-gradient';
import {AppHeader, CustomIcon} from '../components';
import EncryptedStorage from 'react-native-encrypted-storage';

const TIME_ARRAY: string[] = [
  '10:30',
  '12: 30',
  '14: 30',
  '15: 30',
  '19:30',
  '21:30',
];
const PRICE_ONE_SEAT = 5.0;

const generateDate = () => {
  const date = new Date();
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekdays: IWeekday[] = [];
  weekday.forEach((_, i) => {
    const tempDate: IWeekday = {
      date: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDate(),
      day: weekday[new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDay()],
    };
    weekdays.push(tempDate);
  });
  return weekdays;
};

const generateSeats = () => {
  const numRow = 8;
  let numColumn = 3;
  const rowArray = [];
  let start = 1;
  let reachinine = false;

  for (let i = 0; i < numRow; i++) {
    const columnArray = [];
    for (let j = 0; j < numColumn; j++) {
      const seatObject = {
        number: start,
        taken: Boolean(Math.round(Math.random())),
        selected: false,
      };
      columnArray.push(seatObject);
      start++;
    }
    if (i === 3) {
      rowArray.push(columnArray);
      continue;
    }
    if (numColumn < 9 && !reachinine) {
      numColumn += 2;
    } else {
      reachinine = true;
      numColumn -= 2;
    }
    rowArray.push(columnArray);
  }
  return rowArray;
};

const DATE_ARRAY: IWeekday[] = generateDate();

type Props = NativeStackScreenProps<RootStackParamList, 'SeatBooking'>;

const SeatBookingScreen = ({navigation, route}: Props) => {
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [twoSeatArray, setTwoSeatArray] = useState(generateSeats());
  const [selectedSeatArray, setSelectedSeatArray] = useState<number[]>([]);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);

  const handlerSelectSeat = (index: number, subIndex: number, num: number) => {
    if (twoSeatArray[index][subIndex].taken) return;

    let array = [...selectedSeatArray];
    let temp = [...twoSeatArray];
    temp[index][subIndex].selected = !temp[index][subIndex].selected;
    if (!array.includes(num)) {
      array.push(num);
    } else {
      array = array.filter(item => item !== num);
    }
    setSelectedSeatArray(array);
    setPrice(array.length * PRICE_ONE_SEAT);
    setTwoSeatArray(temp);
  };

  const handlerBookSeats = async () => {
    if (
      !selectedSeatArray.length ||
      !TIME_ARRAY[selectedTimeIndex] ||
      !DATE_ARRAY[selectedDateIndex]
    ) {
      const msg = 'Please select Seats, Date and Time of the Show';
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(
          msg,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      } else {
        Alert.alert(msg);
      }
      return;
    }
    try {
      await EncryptedStorage.setItem(
        'ticket',
        JSON.stringify({
          seatArray: selectedSeatArray,
          time: TIME_ARRAY[selectedTimeIndex],
          date: DATE_ARRAY[selectedDateIndex],
          ticketImage: route.params.posterImage,
        }),
      );
    } catch (error) {
      console.log(
        `Something went wrong while storing in BookSeats Function: ${error}`,
      );
    }
    navigation.navigate('Ticket', {
      seatArray: selectedSeatArray,
      time: TIME_ARRAY[selectedTimeIndex],
      date: DATE_ARRAY[selectedDateIndex],
      ticketImage: route.params.posterImage,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}>
      <StatusBar />
      <View>
        <ImageBackground
          source={{uri: route.params.bgImage}}
          style={styles.imageBG}>
          <LinearGradient
            colors={[COLORS.BlackRGB10, COLORS.Black]}
            style={styles.linearGradient}>
            <View style={styles.appHeaderContainer}>
              <AppHeader
                name="close"
                header=""
                action={() => navigation.goBack()}
              />
            </View>
          </LinearGradient>
        </ImageBackground>
        <Text style={styles.screenText}>Screen this side</Text>
      </View>

      <View style={styles.seatContainer}>
        <View style={styles.containerGap20}>
          {twoSeatArray.map((item, index) => (
            <View key={index} style={styles.seatRow}>
              {item.map((subItem, subIndex) => (
                <TouchableOpacity
                  key={subItem.number}
                  onPress={() =>
                    handlerSelectSeat(index, subIndex, subItem.number)
                  }>
                  <CustomIcon
                    name="seat"
                    style={[
                      styles.seatIcon,
                      subItem.taken ? {color: COLORS.Grey} : {},
                      subItem.selected ? {color: COLORS.Orange} : {},
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.seatRadioCotainer}>
          <View style={styles.radioCotainer}>
            <CustomIcon name="radio" style={styles.radioIcon} />
            <Text style={styles.radioText}>Available</Text>
          </View>
          <View style={styles.radioCotainer}>
            <CustomIcon
              name="radio"
              style={[styles.radioIcon, {color: COLORS.Grey}]}
            />
            <Text style={styles.radioText}>Taken</Text>
          </View>
          <View style={styles.radioCotainer}>
            <CustomIcon
              name="radio"
              style={[styles.radioIcon, {color: COLORS.Orange}]}
            />
            <Text style={styles.radioText}>Selected</Text>
          </View>
        </View>

        <View>
          <FlatList
            data={DATE_ARRAY}
            keyExtractor={item => item.date.toString()}
            bounces={false}
            horizontal
            contentContainerStyle={styles.containerGap24}
            renderItem={({item, index}) => (
              <TouchableOpacity onPress={() => setSelectedDateIndex(index)}>
                <View
                  style={[
                    styles.dateContainer,
                    index === 0 ? {marginLeft: SPACING.space_24} : {},
                    index === DATE_ARRAY.length - 1
                      ? {marginRight: SPACING.space_24}
                      : {},
                    index === selectedDateIndex
                      ? {backgroundColor: COLORS.Orange}
                      : {},
                  ]}>
                  <Text style={styles.dateText}>{item.date}</Text>
                  <Text style={styles.dayText}>{item.day}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.outerContainer}>
          <FlatList
            data={TIME_ARRAY}
            keyExtractor={item => item}
            bounces={false}
            horizontal
            contentContainerStyle={styles.containerGap24}
            renderItem={({item, index}) => (
              <TouchableOpacity onPress={() => setSelectedTimeIndex(index)}>
                <View
                  style={[
                    styles.timeContainer,
                    index === 0 ? {marginLeft: SPACING.space_24} : {},
                    index === TIME_ARRAY.length - 1
                      ? {marginRight: SPACING.space_24}
                      : {},
                    index === selectedTimeIndex
                      ? {backgroundColor: COLORS.Orange}
                      : {},
                  ]}>
                  <Text style={styles.timeText}>{item}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      <View style={styles.buttonPriceContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalPriceText}>Total Price</Text>
          <Text style={styles.price}>$ {price}.00</Text>
        </View>
        <TouchableOpacity onPress={handlerBookSeats}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Buy Ticket</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  imageBG: {
    width: '100%',
    aspectRatio: 3072 / 1727,
  },
  linearGradient: {
    height: '100%',
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginVertical: SPACING.space_20 * 2,
  },
  screenText: {
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_10,
    color: COLORS.White,
  },
  seatContainer: {
    marginVertical: SPACING.space_20,
  },
  containerGap20: {
    gap: SPACING.space_20,
  },
  seatRow: {
    flexDirection: 'row',
    gap: SPACING.space_20,
    justifyContent: 'center',
  },
  seatIcon: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  seatRadioCotainer: {
    flexDirection: 'row',
    marginTop: SPACING.space_36,
    marginBottom: SPACING.space_24,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  radioCotainer: {
    flexDirection: 'row',
    gap: SPACING.space_10,
    alignItems: 'center',
  },
  radioIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
  },
  radioText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
  },
  containerGap24: {
    gap: SPACING.space_24,
  },
  dateContainer: {
    width: SPACING.space_10 * 7,
    height: SPACING.space_10 * 10,
    borderRadius: BORDERRADIUS.radius_25 * 4,
    backgroundColor: COLORS.DarkGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  dayText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
  },
  outerContainer: {
    marginVertical: SPACING.space_24,
  },
  timeContainer: {
    paddingVertical: SPACING.space_10,
    borderWidth: 1,
    borderColor: COLORS.WhiteRGBA50,
    paddingHorizontal: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.DarkGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  buttonPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.space_24,
    paddingBottom: SPACING.space_24,
  },
  priceContainer: {
    alignItems: 'center',
  },
  totalPriceText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.Grey,
  },
  price: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  buttonContainer: {
    borderRadius: BORDERRADIUS.radius_25,
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_10,
    backgroundColor: COLORS.Orange,
  },
  buttonText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
  },
});

export default SeatBookingScreen;
