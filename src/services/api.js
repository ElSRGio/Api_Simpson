import axios from 'axios';

// URL base para los datos
const API_URL = 'https://thesimpsonsapi.com/api';
// URL base oficial para las imágenes (según tu documentación)
const CDN_URL = 'https://cdn.thesimpsonsapi.com/500';

const api = axios.create({
    baseURL: API_URL
});

export const getCharacters = async () => {
    try {
        // Pedimos los primeros 20 (Homer, Marge, Bart, etc.)
        const response = await api.get('/characters?limit=20');
        console.log("Datos API:", response.data);

        // La API devuelve los datos en 'docs', 'results' o directo
        let data = response.data.docs || response.data.results || response.data;
        
        if (!Array.isArray(data)) return [];

        // PROCESAMOS LOS DATOS CON EL CDN OFICIAL
        return data.map(char => {
            // Construimos la URL de la imagen usando el CDN
            // Si char.portrait_path es "/character/1.webp", el resultado será:
            // https://cdn.thesimpsonsapi.com/500/character/1.webp
            const imagePath = char.portrait_path || "";
            const finalImage = imagePath.startsWith('http') 
                ? imagePath 
                : `${CDN_URL}${imagePath}`;

            return {
                ...char,
                image: finalImage, // Propiedad lista para usar
                occupation: char.occupation || "Desconocido"
            };
        });
    } catch (error) {
        console.error("Error conectando a la API:", error);
        return [];
    }
};