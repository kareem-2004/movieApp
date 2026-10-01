import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const API_TOKEN = process.env.EXPO_PUBLIC_TMDB_TOKEN;

const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export default function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const getMovies = async (searchText = '') => {
    try {
      setLoading(true);

      let url;

      if (searchText.trim()) {
        url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          searchText
        )}`;
      } else {
        url = 'https://api.themoviedb.org/3/movie/popular';
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          accept: 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMovies(data.results || []);
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
    getMovies();
  }, []);

  const searchMovies = () => {
    getMovies(search);
  };

  const renderMovie = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('MovieDetails', {
            movieId: item.id,
          })
        }
      >
        {item.poster_path ? (
          <Image
            source={{ uri: IMAGE_URL + item.poster_path }}
            style={styles.poster}
          />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}

        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.rating}>
          ⭐ {item.vote_average?.toFixed(1)}
        </Text>

        <Text style={styles.year}>
          {item.release_date
            ? item.release_date.substring(0, 4)
            : 'Unknown'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Popular Movies</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search movies..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={searchMovies}
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={searchMovies}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#e50914"
          style={styles.loading}
        />
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovie}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingHorizontal: 12,
  },

  heading: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 15,
  },

  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  input: {
    flex: 1,
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginRight: 8,
  },

  searchButton: {
    backgroundColor: '#e50914',
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 10,
  },

  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  list: {
    paddingBottom: 20,
  },

  row: {
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    marginBottom: 20,
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    paddingBottom: 10,
    overflow: 'hidden',
  },

  poster: {
    width: '100%',
    height: 250,
  },

  noImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },

  noImageText: {
    color: '#aaa',
  },

  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginHorizontal: 8,
  },

  rating: {
    color: '#ffd700',
    marginTop: 5,
    marginHorizontal: 8,
  },

  year: {
    color: '#aaa',
    marginTop: 3,
    marginHorizontal: 8,
  },

  loading: {
    marginTop: 50,
  },
});