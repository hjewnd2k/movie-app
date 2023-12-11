import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, SPACING} from '../theme';
import {baseImagePath, searchMovies} from '../api/apicalls';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {IMovies, IResult, RootStackParamList} from '../types';
import {InputHeader, SubMovieCard} from '../components';

const {width} = Dimensions.get('screen');

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const SearchScreen = ({navigation}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchList, setSearchList] = useState<IResult[]>([]);

  const searchMoviesFunction = async (name: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(searchMovies(name));
      const json: IMovies = await response.json();
      setIsLoading(false);
      setSearchList(json.results);
    } catch (error) {
      console.log(`Something went wrong in searchMoviesFunction ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <SafeAreaView />
      <View style={styles.inputHeaderContainer}>
        <InputHeader searchFunction={searchMoviesFunction} />
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color={COLORS.Orange} />
        </View>
      ) : (
        <View>
          <FlatList
            data={searchList}
            bounces={false}
            numColumns={2}
            contentContainerStyle={styles.centerContainer}
            renderItem={({item, index}) => (
              <SubMovieCard
                shouldMarginateAtEnd={false}
                shouldMarginateAtAround
                cardFunction={() => {
                  navigation.push('MovieDetails', {movieId: item.id});
                }}
                cardWidth={width / 2 - SPACING.space_12 * 2}
                isFist={index === 0}
                isLast={index === searchList.length - 1}
                title={item.original_title || ''}
                imagePath={baseImagePath('w342', item.poster_path ?? '')}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    width,
    alignItems: 'center',
    backgroundColor: COLORS.Black,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputHeaderContainer: {
    display: 'flex',
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_28,
    marginBottom: SPACING.space_8 * 2,
  },
  centerContainer: {
    alignContent: 'center',
  },
});

export default SearchScreen;
