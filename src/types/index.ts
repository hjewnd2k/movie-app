export interface IWeekday {
  date: number;
  day: string;
}

export interface ITicketParams {
  seatArray?: number[];
  time?: string;
  date?: IWeekday;
  ticketImage?: string;
}

export interface IMovieDetailsParams {
  movieId: number | string;
}

export interface ISeatBookingParams {
  bgImage: string;
  posterImage: string;
}

export type RootStackParamList = {
  Tab: any;
  Home: any;
  Search: any;
  Ticket: ITicketParams;
  User: any;
  MovieDetails: IMovieDetailsParams;
  SeatBooking: ISeatBookingParams;
};

export interface IMovies {
  dates: IDates;
  page: number;
  results: IResult[];
  total_pages: number;
  total_results: number;
}

export interface IDates {
  maximum: string;
  minimum: string;
}

export interface IResult {
  adult?: boolean;
  backdrop_path?: string;
  genre_ids?: number[];
  id: number | string;
  original_language?: string;
  original_title?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string;
  release_date?: string;
  title?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
}

export interface IMoviesDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: any;
  budget: number;
  genres: IGenre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: IProductionCompany[];
  production_countries: IProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: ISpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IGenre {
  id: number;
  name: string;
}

export interface IProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface IProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface ISpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface IMovieCastDetails {
  id: number;
  cast: ICast[];
  crew: ICrew[];
}

export interface ICast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface ICrew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string;
  credit_id: string;
  department: string;
  job: string;
}
