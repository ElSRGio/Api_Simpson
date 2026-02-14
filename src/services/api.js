import axios from 'axios';

const API_BASE_URL = 'https://thesimpsonsapi.com/api';
const IMAGE_CDN = 'https://cdn.thesimpsonsapi.com/500';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});


const normalizeCharacters = (results) => {
  return results.map(char => ({
    id: char._id || char.id,
    name: char.name || 'Desconocido',
    image: char.portrait_path 
      ? `${IMAGE_CDN}${char.portrait_path}` 
      : 'https://placehold.co/400x600?text=No+Image',
    status: char.status || 'Unknown',
    occupation: (char.occupation && char.occupation[0]) || 'N/A',
    age: char.age || '???',
    phrases: char.phrases || []
  }));
};


export const getCharacters = async (limit = 24) => {
  try {
    const { data } = await apiClient.get(`/characters?limit=${limit}`);
    const results = data.docs || data.results || data;

    if (!Array.isArray(results)) {
      throw new Error('La API no devolvió un array válido');
    }

    return normalizeCharacters(results);
  } catch (error) {
    console.error("Error en API:", error.message);
    throw new Error("No se pudo conectar con Springfield. Intenta más tarde.");
  }
};