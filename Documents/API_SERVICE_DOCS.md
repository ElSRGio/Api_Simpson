# API Service Documentation

## Overview

El archivo `src/services/api.js` es la **única fuente de verdad** para toda comunicación con la API de Simpson. Esto asegura:

- ✅ Normalización consistente de datos
- ✅ Manejo centralizado de errores
- ✅ Fácil de cambiar sin afectar componentes
- ✅ Testeable independientemente

---

## API Service

### `getCharacters(limit = 24)`

Obtiene los personajes de la API con normalización automática.

**Signature:**
```javascript
export const getCharacters = async (limit = 24) => Promise<Array>
```

**Parámetros:**
| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `limit` | number | 24 | Cantidad de personajes a obtener |

**Retorna:**
```javascript
[
  {
    id: string,           // _id o id de la API
    name: string,         // Nombre del personaje
    image: string,        // URL completa de imagen (CDN)
    status: string,       // 'Alive' o 'Unknown'
    occupation: string,   // Ocupación principal
    age: string,          // Edad del personaje
    phrases: Array        // Frases famosas
  },
  ...
]
```

**Ejemplo de uso:**
```javascript
import { getCharacters } from '../services/api';

try {
  const characters = await getCharacters(50);
  setCharacters(characters);
} catch (error) {
  console.error(error.message);
  // Error: "No se pudo conectar con Springfield. Intenta más tarde."
}
```

---

## Normalización de Datos

La API de Simpson tiene estructuras inconsistentes según la versión. El servicio normaliza automáticamente:

### Campos Normalizados

#### 1. **ID** (`id`)
```javascript
// La API usa _id o id, normalizamos a id
const id = char._id || char.id;
```

#### 2. **Nombre** (`name`)
```javascript
// Aseguramos que siempre hay un valor
const name = char.name || 'Desconocido';
```

#### 3. **Imagen** (`image`)
```javascript
// Construye la URL completa con CDN
const IMAGE_CDN = 'https://cdn.thesimpsonsapi.com/500';
const image = char.portrait_path 
  ? `${IMAGE_CDN}${char.portrait_path}` 
  : 'https://placehold.co/400x600?text=No+Image';
```

#### 4. **Estado** (`status`)
```javascript
// Valida valores conocidos
const status = char.status || 'Unknown';
// Valores esperados: 'Alive', 'Unknown', etc.
```

#### 5. **Ocupación** (`occupation`)
```javascript
// La API a veces devuelve un array, nosotros tomamos el primero
const occupation = (char.occupation && char.occupation[0]) || 'N/A';
```

#### 6. **Edad** (`age`)
```javascript
// Fallback inteligente
const age = char.age || '???';
```

#### 7. **Frases** (`phrases`)
```javascript
// Siempre un array
const phrases = char.phrases || [];
```

---

## Error Handling

Cualquier error en el servicio lanza una excepción captura**ble:

```javascript
export const getCharacters = async (limit = 24) => {
  try {
    const { data } = await apiClient.get(`/characters?limit=${limit}`);
    const results = data.docs || data.results || data;

    // Validación: la API debe devolver un array
    if (!Array.isArray(results)) {
      throw new Error('La API no devolvió un array válido');
    }

    return normalizeCharacters(results);
  } catch (error) {
    console.error("Error en API:", error.message);
    // Lanzamos un error amigable al usuario
    throw new Error("No se pudo conectar con Springfield. Intenta más tarde.");
  }
};
```

### Casos de Error Manejados

| Error | Causa | Comportamiento |
|-------|-------|----------------|
| Network timeout | API lenta o caída | Error con timeout de 10s |
| Invalid JSON | Respuesta corrupta | Capturado y relanzado |
| Array vacío | API funciona pero sin datos | Retorna `[]` válido |
| Estructura inesperada | API cambió formato | Detected y error amigable |

---

## Configuration

### Constantes Configurables

```javascript
const API_BASE_URL = 'https://thesimpsonsapi.com/api';
const IMAGE_CDN = 'https://cdn.thesimpsonsapi.com/500';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,  // 10 segundos - cambiar si necesarias más
});
```

### Cambiar la API

Si en el futuro cambias de API, **solo modificas este archivo**:

```javascript
// Antes: Simpson API
const API_BASE_URL = 'https://thesimpsonsapi.com/api';

// Después: Nueva API
const API_BASE_URL = 'https://nueva-api.com/api';

// Los componentes NO cambian ✅
```

---

## Testing (Ejemplo)

Si querés probar el servicio sin componentes:

```javascript
// test/api.test.js
import { getCharacters } from '../services/api';

describe('getCharacters', () => {
  test('Retorna array de personajes', async () => {
    const characters = await getCharacters(10);
    
    expect(Array.isArray(characters)).toBe(true);
    expect(characters.length).toBeGreaterThan(0);
  });

  test('Normaliza campos correctamente', async () => {
    const [first] = await getCharacters(1);
    
    expect(first.id).toBeDefined();
    expect(first.name).toBeDefined();
    expect(first.image).toContain('http');
    expect(first.status).toBeDefined();
  });

  test('Lanza error amigable en fallo', async () => {
    // Mock axios para simular fallo
    await expect(getCharacters(1)).rejects.toThrow(
      'No se pudo conectar con Springfield'
    );
  });
});
```

---

## Flujo de Datos

```
┌─────────────────────────────────────────┐
│ Home.jsx (Container Component)          │
│ ┌──────────────────────────────────────┤
│ │ useEffect(() => {                    │
│ │   getCharacters()  ← Fetch            │
│ │     .then(data => setCharacters)      │
│ │     .catch(err => setError)           │
│ │ })                                    │
│ └──────────────────────────────────────┤
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ api.js (Service Layer)                  │
│ ┌──────────────────────────────────────┤
│ │ 1. axios.get('/characters')           │
│ │ 2. Validar respuesta                  │
│ │ 3. normalizeCharacters(raw)           │
│ │ 4. Return normalized data ✅          │
│ │    OR throw Error ❌                  │
│ └──────────────────────────────────────┤
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Simpson API (External)                  │
│ https://thesimpsonsapi.com/api          │
│ /characters?limit=24                    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Raw Data: { docs: [...] }               │
│ (inconsistent, raw)                     │
└─────────────────────────────────────────┘
              ↓
        ✨ NORMALIZATION ✨
              ↓
┌─────────────────────────────────────────┐
│ Clean Data: [{                          │
│   id, name, image, status,              │
│   occupation, age, phrases              │
│ }, ...]                                 │
│ (consistent, ready to use)              │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Components (CharacterCard)              │
│ ✅ Datos garantizados válidos          │
│ ✅ Solo renderizar, sin lógica         │
└─────────────────────────────────────────┘
```

---

## Mejores Prácticas

### ✅ DO

```javascript
// En Home.jsx
useEffect(() => {
  getCharacters()
    .then(data => setCharacters(data))
    .catch(err => setError(err.message));
}, []);
```

```javascript
// En CharacterCard.jsx
<img src={character.image} alt={character.name} />
// Image SIEMPRE es una URL válida
```

### ❌ DON'T

```javascript
// ❌ No hagas lógica en componentes
<img src={char.portrait_path} /> // ← Puede ser null/undefined

// ❌ No modifiques datos en componentes
const modifiedChar = { ...char, name: char.name.toUpperCase() };

// ❌ No duplicables llamadas a API
useEffect(() => {
  fetch('/api/characters').then(...)  // ← Caótico
});
```

---

## Versionamiento

Si la API de Simpson cambia en el futuro:

```javascript
// v1 - Estructura actual
const getCharactersV1 = async () => { ... };

// v2 - Estructura nueva (si cambia)
const getCharactersV2 = async () => { ... };

// Mantén compatibilidad hacia atrás
export const getCharacters = getCharactersV2; // Actual
```

---

## Conclusión

El servicio `api.js` es tu **contrato** con el mundo externo (API). Cambios externos → Cambios solo aquí → Componentes no se afectan.

**Principio:** Single Responsibility + Interface estable = Código resistente al cambio 🛡️
