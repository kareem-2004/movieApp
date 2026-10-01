import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const API_TOKEN = process.env.EXPO_PUBLIC_TMDB_TOKEN;

const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieDetailsScreen({ route }) {
  const { movieId } = route.params;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const getMovieDetails = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}`,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            accept: 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMovie(data);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovieDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.error}>Movie not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {movie.poster_path && (
        <Image
          source={{ uri: IMAGE_URL + movie.poster_path }}
          style={styles.poster}
        />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>

        <Text style={styles.rating}>
          ⭐ {movie.vote_average?.toFixed(1)} / 10
        </Text>

        <Text style={styles.info}>
          📅 {movie.release_date || 'Unknown'}
        </Text>

        <Text style={styles.info}>
          ⏱️ {movie.runtime ? `${movie.runtime} minutes` : 'Unknown'}
        </Text>

        <Text style={styles.sectionTitle}>Genres</Text>

        <Text style={styles.text}>
          {movie.genres?.map((genre) => genre.name).join(', ') ||
            'Unknown'}
        </Text>

        <Text style={styles.sectionTitle}>Overview</Text>

        <Text style={styles.overview}>
          {movie.overview || 'No overview available.'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },

  poster: {
    width: '100%',
    height: 500,
    resizeMode: 'cover',
  },

  content: {
    padding: 20,
  },

  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  rating: {
    color: '#ffd700',
    fontSize: 18,
    marginBottom: 15,
  },

  info: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 8,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },

  text: {
    color: '#ccc',
    fontSize: 16,
  },

  overview: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 25,
  },

  error: {
    color: '#fff',
    fontSize: 18,
  },
});