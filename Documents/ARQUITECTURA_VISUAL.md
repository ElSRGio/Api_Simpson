# 🏗️ Arquitectura Visual - Simpson API

## Flujo de Datos (Data Flow)

```
┌─────────────────────────────────────────────────────────────────┐
│                        🌐 Simpson API                            │
│                https://thesimpsonsapi.com/api                    │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Raw API Response    │
                    │  {docs: [...]}       │
                    │  (inconsistent)      │
                    └──────────────────────┘
                               │
                               ▼
        ╔══════════════════════════════════════════╗
        ║  src/services/api.js                     ║
        ║  ─────────────────────────────────────   ║
        ║  getCharacters(limit = 24)               ║
        ║    ├─ fetch data                         ║
        ║    ├─ validate structure ✅              ║
        ║    ├─ normalizeCharacters()              ║
        ║    │  └─ map raw → normalized           ║
        ║    └─ throw error on failure ❌          ║
        ║                                          ║
        ║  Returns: [{ id, name, image, ... }]    ║
        ║  Throws: Error with message              ║
        ╚══════════════════════════════════════════╝
                               │
                               ▼
        ┌──────────────────────────────────────┐
        │  Normalized Data (clean & safe)      │
        │  [{                                  │
        │    id: string,                       │
        │    name: string,                     │
        │    image: string (full URL),         │
        │    status: 'Alive' | 'Unknown',      │
        │    occupation: string,               │
        │    age: string,                      │
        │    phrases: Array                    │
        │  }, ...]                             │
        └──────────────────────────────────────┘
                               │
                               ▼
        ╔══════════════════════════════════════════╗
        ║  src/pages/Home.jsx                      ║
        ║  (Container Component)                   ║
        ║  ─────────────────────────────────────   ║
        ║  Responsabilidades:                      ║
        ║  ✓ State management                      ║
        ║  ✓ Data fetching (useEffect)             ║
        ║  ✓ Error handling                        ║
        ║  ✓ Filtering logic                       ║
        ║  ✓ Layout coordination                   ║
        ║                                          ║
        ║  State:                                  ║
        ║  ├─ characters: []                       ║
        ║  ├─ loading: boolean                     ║
        ║  ├─ error: string | null                 ║
        ║  ├─ selected: character | null           ║
        ║  └─ searchTerm: string                   ║
        ║                                          ║
        ║  Derived:                                ║
        ║  └─ filtered = characters.filter(...)    ║
        ╚══════════════════════════════════════════╝
                 │              │              │
      ┌──────────┴──────────┬───┴──────┬──────┴─────────┐
      ▼                     ▼          ▼                ▼
  ┌─────────┐          ┌────────┐  ┌──────┐      ┌──────────┐
  │ Header  │          │ Grid   │  │Modal │      │ Footer   │
  │ Sticky  │          │ Cards  │  │      │      │ Static   │
  └─────────┘          └────────┘  └──────┘      └──────────┘
      │                     │          │
      │                     ▼          │
      │           ╔═════════════════╗  │
      │           ║ CharacterCard   ║  │
      │           ║ (Presentational)║  │
      │           ║ ────────────────║  │
      │           ║ Props:          ║  │
      │           ║ - character     ║  │
      │           ║ - onClick       ║  │
      │           ║                 ║  │
      │           ║ Job: Render     ║  │
      │           ║ nothing else ✅ ║  │
      │           ╚═════════════════╝  │
      │                     │          │
      │                     ▼          ▼
      │              User Sees Card   Modal Opens
      └──────────────────────────────────────────▶ User
                       & Scrolls
```

---

## Componentes & Responsabilidades

### 🔧 Capa de Servicios

```
┌─────────────────────────────────────────────┐
│ src/services/api.js                         │
├─────────────────────────────────────────────┤
│ Responsabilidad: Comunicación con API       │
│                                             │
│ Expone:                                     │
│  • getCharacters(limit)                     │
│                                             │
│ Internamente:                               │
│  • apiClient (axios instance)               │
│  • normalizeCharacters() (private)          │
│  • Error handling (try-catch)               │
│                                             │
│ NO sabe de:                                 │
│  • React                                    │
│  • UI components                            │
│  • State management                         │
└─────────────────────────────────────────────┘
```

### 📦 Container Component

```
┌──────────────────────────────────────────────────┐
│ src/pages/Home.jsx                               │
├──────────────────────────────────────────────────┤
│ Tipo: Container / Smart Component                │
│                                                  │
│ Responsabilidades:                               │
│  ✓ Fetch data (useEffect)                        │
│  ✓ Manage state                                  │
│  ✓ Handle errors                                 │
│  ✓ Filter data                                   │
│  ✓ Coordinate children                           │
│                                                  │
│ State:                                           │
│  • characters: Character[]                       │
│  • loading: boolean                              │
│  • error: string | null                          │
│  • selected: Character | null                    │
│  • searchTerm: string                            │
│                                                  │
│ Computed:                                        │
│  • filtered: Character[] (derived)               │
│                                                  │
│ Passes to children:                              │
│  • Header: searchTerm, onSearchChange            │
│  • CharacterCard: character, onClick             │
│  • CharacterDetails: character                   │
└──────────────────────────────────────────────────┘
```

### 🎨 Presentational Components

```
┌────────────────────────────────────────┐
│ Presentational Components               │
├────────────────────────────────────────┤
│                                        │
│ CharacterCard                          │
│ ├─ Props: character, onClick           │
│ ├─ Only renders                        │
│ └─ No state                            │
│                                        │
│ CharacterDetails                       │
│ ├─ Props: character                    │
│ ├─ Shows modal content                 │
│ └─ No state                            │
│                                        │
│ Header                                 │
│ ├─ Props: searchTerm, onSearchChange   │
│ ├─ Shows sticky header                 │
│ └─ No state                            │
│                                        │
│ Footer                                 │
│ ├─ Props: (none)                       │
│ ├─ Static content                      │
│ └─ No state                            │
└────────────────────────────────────────┘
```

---

## Estado Management

### 🎯 Single Source of Truth

```
Home.jsx
│
├─ characters: Character[] ◄── ÚNICA FUENTE DE VERDAD
│  │
│  ├─ filtered = characters.filter(...) ✓ DERIVADO
│  │
│  ├─ Pasa a CharacterCard.jsx ──────────────────┐
│  │                                              │
│  └─ Pasa a CharacterDetails.jsx (modal) ───┐   │
│                                             │   │
│                              CharacterCard │   │
│                              (Presentational)   │
│                                                 │
│                              CharacterDetails   │
│                              (Modal)            │
│
```

### ✅ Antes (Problema)

```
Home.jsx
├─ characters: []      ◄── ORIGINAL
├─ filtered: []        ◄── DUPLICADO ❌
│
⚠️ Problema: ¿Cuál es la verdad?
   Los dos pueden desincronizarse
   Pueden entrar en conflicto
   Complejidad innecesaria
```

### ✅ Después (Solución)

```
Home.jsx
├─ characters: []                    ◄── ÚNICA VERDAD ✅
│  └─ filtered = filtered()          ◄── SIEMPRE SINCRONIZADO

✓ Beneficio: Automáticamente consistente
✓ Menos bugs
✓ Menos código
```

---

## Control Flow

### 1. Inicialización

```
App monta
   │
   ▼
Home.jsx renderiza
   │
   ▼
useEffect se ejecuta
   │
   ▼
getCharacters() ─────────► api.js ─────► Simpson API
   │                       │
   │◄──────────────────────┘
   │ (normalized data)
   │
   ▼
setCharacters(data)
   │
   ▼
Home re-renderiza con datos ✅
   │
   ▼
CharacterCard.jsx renderiza 24 tarjetas
```

### 2. Usuario Busca

```
Usuario escribe en búsqueda
   │
   ▼
onSearchChange dispara
   │
   ▼
setSearchTerm(value)
   │
   ▼
Home re-renderiza
   │
   ▼
filtered = characters.filter(...) se recalcula
   │
   ▼
Grid se actualiza con resultados ✅
```

### 3. Usuario Clickea Tarjeta

```
Usuario hace click en CharacterCard
   │
   ▼
onClick dispara
   │
   ▼
setSelected(character)
   │
   ▼
Home re-renderiza
   │
   ▼
Modal se renderiza (condicionalmente) ✅
   │
   ▼
CharacterDetails renderiza detalles
```

### 4. Usuario Cierra Modal

```
Usuario clickea botón X o backdrop
   │
   ▼
onClick dispara
   │
   ▼
setSelected(null)
   │
   ▼
Home re-renderiza
   │
   ▼
Modal no cumple condición ─────► No renderiza ✅
```

---

## Normalización Visual

### Raw Data (Caótico)

```javascript
{
  "_id": "630f61e20fa86a7b56b7dae0",
  "portrait_path": "/character/1.webp",
  "name": "Homer Simpson",
  "occupation": ["Nuclear Safety Inspector"],
  "status": "Alive",
  "age": "39"
  // A veces faltan campos
  // A veces están en diferentes estructuras
}
```

### Normalized Data (Limpio)

```javascript
{
  id: "630f61e20fa86a7b56b7dae0",
  image: "https://cdn.thesimpsonsapi.com/500/character/1.webp",
  name: "Homer Simpson",
  occupation: "Nuclear Safety Inspector",
  status: "Alive",
  age: "39",
  phrases: []
  // SIEMPRE los mismos campos
  // SIEMPRE valores válidos
  // SIEMPRE estructura idéntica
}
```

---

## Error Handling

### Flujo con Error

```
getCharacters()
   │
   ├─ Network Error ──────────────────────┐
   ├─ Invalid JSON ────────────────────────┤
   ├─ Wrong structure ─────────────────────┼─► catch(error)
   └─ API timeout ────────────────────────┘
                                           │
                                           ▼
                                  throw new Error(
                                    "No se pudo conectar..."
                                  )
                                           │
                                           ▼
                                  Home.jsx catch
                                           │
                                           ▼
                                  setError(err.message)
                                           │
                                           ▼
                                  UI muestra error ✅
```

---

## Responsividad

### Grid Responsivo Automático

```
Pantalla: 320px (Móvil)
┌───────────────────────────────┐
│ [Card] [Card]                 │
│ [Card] [Card]                 │
│ [Card] [Card]                 │
└───────────────────────────────┘
grid-cols-2

─────────────────────────────────

Pantalla: 768px (Tablet)
┌─────────────────────────────────────┐
│ [Card] [Card] [Card]                │
│ [Card] [Card] [Card]                │
└─────────────────────────────────────┘
md:grid-cols-3

─────────────────────────────────────

Pantalla: 1024px (Laptop)
┌────────────────────────────────────────────────┐
│ [Card] [Card] [Card] [Card]                    │
│ [Card] [Card] [Card] [Card]                    │
└────────────────────────────────────────────────┘
lg:grid-cols-4

─────────────────────────────────────

Pantalla: 1536px (Desktop)
┌──────────────────────────────────────────────────────────┐
│ [Card] [Card] [Card] [Card] [Card] [Card]               │
│ [Card] [Card] [Card] [Card] [Card] [Card]               │
└──────────────────────────────────────────────────────────┘
xl:grid-cols-6
```

---

## Performance Optimizaciones

### 1. Lazy Loading de Imágenes

```html
<!-- Antes: Carga TODAS las imágenes -->
<img src="..." />

<!-- Después: Carga solo cuando se ven -->
<img src="..." loading="lazy" />
```

### 2. Computed Values (No Estado)

```javascript
// ❌ Antes: 2 estados sincronizados
const [characters, setCharacters] = useState([]);
const [filtered, setFiltered] = useState([]);

useEffect(() => {
  setFiltered(characters.filter(...));
}, [characters]);  // ← Recalcula cada vez

// ✅ Después: 1 estado, 1 derivado
const [characters, setCharacters] = useState([]);
const filtered = characters.filter(...);  // ← Directo
```

### 3. Sticky Header (CSS, no JS)

```javascript
// ❌ Antes: Listener en cada scroll
useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => removeEventListener('scroll', handleScroll);
}, []);

// ✅ Después: CSS puro
<div className="sticky top-0">Header</div>
```

---

## Patrones Usados

### Container/Presentational (Smart/Dumb)

```
                   Smart Component
                   (Home.jsx)
                   │
                   ├─ State
                   ├─ Lógica
                   ├─ Fetch
                   └─ Error handling
                        │
            ┌───────────┼───────────┐
            ▼           ▼           ▼
        Header       CardGrid    Footer
       (Dumb)       (Dumb)       (Dumb)
        Props       Props         Props
        Only        Only          Only
```

### Single Responsibility

```
api.js ════ API Communication
  ├─ Fetch
  ├─ Validate
  ├─ Normalize
  └─ Error handling

Home.jsx ══ Orchestration
  ├─ State
  ├─ Filtering
  ├─ Layout
  └─ Event handling

CharacterCard.jsx ══ Rendering
  ├─ Display image
  ├─ Show text
  ├─ Handle click
  └─ Nothing else
```

---

## Conclusión Visual

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Tu app ahora es un sistema coordinado:            │
│                                                     │
│  🔧 Servicios ──► 📦 Contenedores ──► 🎨 Vista   │
│   (Logic)         (State)              (Render)    │
│                                                     │
│  Cada parte es:                                     │
│  ✓ Responsable de UNA cosa                         │
│  ✓ Fácil de entender                               │
│  ✓ Fácil de testear                                │
│  ✓ Fácil de mantener                               │
│  ✓ Fácil de escalar                                │
│                                                     │
│  ¡Felicidades! 🎓 Eres Ingeniero/a. 🚀            │
│                                                     │
└─────────────────────────────────────────────────────┘
```
