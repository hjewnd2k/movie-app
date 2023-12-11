import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, SPACING} from '../theme';
import {
  InputHeader,
  MovieCard,
  SubMovieCard,
  CategoryHeader,
} from '../components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {IMovies, IResult, RootStackParamList} from '../types';
import {
  baseImagePath,
  nowPlayingMovies,
  popularMovies,
  upcomingMovies,
} from '../api/apicalls';

const {width} = Dimensions.get('window');

const getNowPlayingMoviesList = async () => {
  try {
    const response = await fetch(nowPlayingMovies);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Something went in getNowPlayingMoviesList Function', error);
  }
};

const getUpComingMoviesList = async () => {
  try {
    const response = await fetch(upcomingMovies);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Something went in getNowPlayingMoviesList Function', error);
  }
};

const getPopularMoviesList = async () => {
  try {
    const response = await fetch(popularMovies);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Something went in getNowPlayingMoviesList Function', error);
  }
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({navigation}: Props) => {
  const [nowPlayingMoviesList, setNowPlayingMoviesList] = useState<IResult[]>(
    [],
  );
  const [popularMoviesList, setPopularMoviesList] = useState<IResult[]>([]);
  const [upComingMoviesList, setUpComingMoviesList] = useState<IResult[]>([]);

  const searchMoviesFunction = async () => {
    navigation.navigate('Search');
  };

  useEffect(() => {
    (async () => {
      const tempNowPlaying: IMovies = await getNowPlayingMoviesList();
      setNowPlayingMoviesList([
        {id: 'dummy1'},
        ...tempNowPlaying?.results,
        {id: 'dummy2'},
      ]);

      const tempPopular: IMovies = await getPopularMoviesList();
      setPopularMoviesList(tempPopular?.results);

      const tempUpComing: IMovies = await getUpComingMoviesList();
      setUpComingMoviesList(tempUpComing?.results);
    })();
  }, []);

  if (
    nowPlayingMoviesList.length === 0 &&
    popularMoviesList.length === 0 &&
    upComingMoviesList.length === 0
  ) {
    return (
      <View style={styles.container}>
        <SafeAreaView />
        <StatusBar hidden />
        <View style={styles.inputHeaderContainer}>
          <InputHeader searchFunction={searchMoviesFunction} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color={COLORS.Orange} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView />
      <StatusBar hidden />
      <View style={styles.inputHeaderContainer}>
        <InputHeader searchFunction={searchMoviesFunction} />
      </View>

      <CategoryHeader title={'Now Playing'} />
      <FlatList
        data={nowPlayingMoviesList}
        bounces={false}
        snapToInterval={width * 0.7 + SPACING.space_36}
        decelerationRate={0}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.containerGap36}
        renderItem={({item, index}) => {
          if (!item.original_title) {
            return (
              <View
                style={{
                  width: (width - (width * 0.7 + SPACING.space_36 * 2)) / 2,
                }}
              />
            );
          }

          return (
            <MovieCard
              shouldMarginateAtEnd
              cardFunction={() => {
                navigation.push('MovieDetails', {movieId: item.id});
              }}
              cardWidth={width * 0.7}
              isFist={index === 0}
              isLast={index === nowPlayingMoviesList.length - 1}
              title={item.original_title}
              imagePath={baseImagePath('w780', item.poster_path ?? '')}
              genre={item.genre_ids?.slice(1, 4) ?? []}
              vote_average={item.vote_average ?? 0}
              vote_count={item.vote_count ?? 0}
            />
          );
        }}
      />
      <CategoryHeader title={'Popular'} />
      <FlatList
        data={popularMoviesList}
        bounces={false}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.containerGap36}
        renderItem={({item, index}) => (
          <SubMovieCard
            shouldMarginateAtEnd
            cardFunction={() => {
              navigation.push('MovieDetails', {movieId: item.id});
            }}
            cardWidth={width / 3}
            isFist={index === 0}
            isLast={index === popularMoviesList.length - 1}
            title={item.original_title || ''}
            imagePath={baseImagePath('w342', item.poster_path ?? '')}
          />
        )}
      />
      <CategoryHeader title={'Upcoming'} />
      <FlatList
        data={upComingMoviesList}
        bounces={false}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.containerGap36}
        renderItem={({item, index}) => (
          <SubMovieCard
            shouldMarginateAtEnd
            cardFunction={() => {
              navigation.push('MovieDetails', {movieId: item.id});
            }}
            cardWidth={width / 3}
            isFist={index === 0}
            isLast={index === upComingMoviesList.length - 1}
            title={item.original_title ?? ''}
            imagePath={baseImagePath('w342', item.poster_path ?? '')}
          />
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_28,
  },
  containerGap36: {
    gap: SPACING.space_36,
  },
});

export default HomeScreen;
