# 📖 Quick Reference - Simpson API

## 🎯 TL;DR - Cambios Principales

### Antes ❌
```
- 152 líneas de código caótico
- 8 variables de estado
- Datos sin normalizar
- Error handling silencioso
- Componentes con múltiples responsabilidades
```

### Después ✅
```
- 87 líneas de código limpio
- 5 variables de estado
- Datos normalizados garantizados
- Error handling explícito
- Componentes con responsabilidad única
```

---

## 🔧 Los 5 Archivos Clave

### 1. `src/services/api.js` - LA FUENTE DE VERDAD

```javascript
// ✅ Lo que hace:
export const getCharacters = async (limit = 24) => {
  // 1. Fetch con timeout
  // 2. Valida estructura
  // 3. Normaliza datos
  // 4. Retorna limpio o lanza error
}

// ✅ Cómo usarlo:
try {
  const chars = await getCharacters(50);
  setCharacters(chars);
} catch (error) {
  setError(error.message);
}
```

### 2. `src/pages/Home.jsx` - ORQUESTADOR

```javascript
// ✅ Estado:
const [characters, setCharacters] = useState([]);  // Datos
const [loading, setLoading] = useState(true);      // Fetch state
const [error, setError] = useState(null);          // Error state
const [selected, setSelected] = useState(null);    // Modal
const [searchTerm, setSearchTerm] = useState('');  // Filter

// ✅ Derivado (NO es estado):
const filtered = characters.filter(c => 
  c.name.toLowerCase().includes(searchTerm.toLowerCase())
);

// ✅ Responsabilidades:
// - Fetch en useEffect
// - Manejo de errores
// - Filtrado
// - Coordinación de layout
```

### 3. `src/components/characters/CharacterCard.jsx` - RENDERIZADOR

```javascript
// ✅ Props (lo único que recibe):
export const CharacterCard = ({ character, onClick }) => {
  // ✅ Responsabilidad ÚNICA: Renderizar tarjeta
  // ❌ NO: Lógica, NO: Estado, NO: Fetch
}

// ✅ Características:
// - Imagen con ratio 3:4
// - Lazy loading
// - Hover effects
// - Status badge
```

### 4. `src/components/layout/Header.jsx` - ENCABEZADO

```javascript
// ✅ Simple y limpio:
export const Header = ({ searchTerm, onSearchChange }) => {
  return (
    <header className="sticky top-0 ...">
      {/* Título + Búsqueda */}
    </header>
  );
}

// ✅ Props específicas
// ✅ Sticky CSS puro
// ✅ Nada de lógica
```

### 5. `src/index.css` - ESTILOS GLOBALES

```css
/* ✅ Scrollbar visible y estilizado */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { @apply bg-black; }
::-webkit-scrollbar-thumb { @apply bg-yellow-400; }

/* ✅ Base limpia */
body { @apply bg-blue-400 text-black; }
```

---

## 📊 Flujo de Datos Visual

```
                   Fetch
                     │
                     ▼
            ┌─────────────────┐
            │   api.js        │
            │ getCharacters() │
            └────────┬────────┘
                     │ (normalized)
                     ▼
            ┌─────────────────┐
            │   Home.jsx      │
            │ setCharacters() │
            └────────┬────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
     Header      CardGrid     Modal
     (sticky)    (lazy img)   (onClick)
```

---

## 🎯 5 Conceptos Clave

### 1️⃣ Normalización

```javascript
// API devuelve esto (caótico):
{ _id: 1, portrait_path: "/x.webp", occupation: [...] }

// api.js lo convierte a esto (limpio):
{ id: 1, image: "https://cdn.../x.webp", occupation: "..." }

// ✅ Componentes SOLO ven datos limpios
```

### 2️⃣ Separación de Responsabilidades

```
api.js          ← Solo Fetch + Normalización
Home.jsx        ← Solo Lógica + Estado
CharacterCard   ← Solo Renderizar
Header.jsx      ← Solo UI
```

### 3️⃣ Single Source of Truth

```javascript
// ❌ Problema anterior:
const [characters, setCharacters] = useState([]);
const [filtered, setFiltered] = useState([]);
// Dos estados = peuvent desincronizarse

// ✅ Solución:
const [characters, setCharacters] = useState([]);
const filtered = characters.filter(...);  // Derivado
// Un estado = Siempre sincronizado
```

### 4️⃣ Error Handling

```javascript
// ❌ Antes: Silencioso
try { ... } catch (error) { return []; }

// ✅ Ahora: Explícito
try { ... } 
catch (error) { 
  throw new Error("Mensaje al usuario");
}
```

### 5️⃣ Responsabilidad Única

```javascript
// ❌ Componente hace TODO:
<Component /> ← Fetch + State + Render + Lógica

// ✅ Cada cosa en su lugar:
api.js ← Fetch
Home.jsx ← State
CharacterCard ← Render
```

---

## 🚀 Cómo Agregar Features

### Agregar un nuevo filtro

```javascript
// 1. Agregar al estado (Home.jsx):
const [statusFilter, setStatusFilter] = useState('All');

// 2. Actualizar filtered:
const filtered = characters.filter(c => 
  c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
  (statusFilter === 'All' || c.status === statusFilter)
);

// 3. Pasar al componente:
<Header searchTerm={...} onSearchChange={...} statusFilter={...} />

// ✅ Listo, sin romper nada
```

### Agregar favoritos

```javascript
// 1. Agregar al estado (Home.jsx):
const [favorites, setFavorites] = useState([]);

// 2. Función para agregar:
const toggleFavorite = (charId) => {
  if (favorites.includes(charId)) {
    setFavorites(favorites.filter(id => id !== charId));
  } else {
    setFavorites([...favorites, charId]);
  }
};

// 3. Pasar a CharacterCard:
<CharacterCard 
  character={char} 
  onClick={() => setSelected(char)}
  onFavorite={() => toggleFavorite(char.id)}
  isFavorite={favorites.includes(char.id)}
/>

// ✅ Feature nueva sin romper lo existente
```

### Agregar paginación

```javascript
// 1. Agregar al estado:
const [page, setPage] = useState(1);
const ITEMS_PER_PAGE = 24;

// 2. En useEffect:
useEffect(() => {
  getCharacters(ITEMS_PER_PAGE * page)
    .then(data => setCharacters(data))
    .catch(err => setError(err.message));
}, [page]);

// 3. Componente paginación:
<Pagination page={page} onNext={() => setPage(p => p + 1)} />

// ✅ Feature nueva lista
```

---

## ⚡ Performance Tips

### ✅ Usar Lazy Loading

```jsx
// ❌ Antes:
<img src={url} />

// ✅ Después:
<img src={url} loading="lazy" />
```

### ✅ Derivar en lugar de Sincronizar

```javascript
// ❌ Antes:
useEffect(() => setFiltered(...), [characters, search]);

// ✅ Después:
const filtered = characters.filter(...);
```

### ✅ CSS en lugar de JS

```javascript
// ❌ Antes:
useEffect(() => {
  window.addEventListener('scroll', ...);
}, []);

// ✅ Después:
<div className="sticky top-0">...</div>
```

---

## 🧪 Testing Quick Guide

### Test CharacterCard

```javascript
import { render, screen } from '@testing-library/react';
import { CharacterCard } from './CharacterCard';

test('Renderiza tarjeta', () => {
  const char = { id: 1, name: 'Homer', image: 'url', status: 'Alive' };
  render(<CharacterCard character={char} onClick={jest.fn()} />);
  expect(screen.getByText('Homer')).toBeInTheDocument();
});
```

### Test api.js

```javascript
import { getCharacters } from './api';

test('Normaliza datos correctamente', async () => {
  const result = await getCharacters(1);
  
  expect(result[0].id).toBeDefined();
  expect(result[0].image).toContain('http');
  expect(result[0].status).toBeDefined();
});
```

---

## 🐛 Debugging Tips

### Ver qué se renderiza

```javascript
// Agregar en Home.jsx:
console.log('Personajes:', characters);
console.log('Filtrados:', filtered);
console.log('Seleccionado:', selected);
```

### Ver qué data viene de API

```javascript
// Agregar en api.js:
console.log('Raw data:', data);
console.log('Normalized:', normalizeCharacters(data));
```

### Network Inspector (DevTools)

```
1. Abre DevTools (F12)
2. Ve a Network
3. Filtra por XHR
4. Haz refresh
5. Haz click en la request
6. Ve Response para ver la data raw
```

---

## 📋 Checklist de Código Limpio

Antes de hacer commit:

- [ ] ¿Cada componente tiene UNA responsabilidad?
- [ ] ¿No hay estado duplicado?
- [ ] ¿Los errores son capturados y mostrados?
- [ ] ¿El código está documentado?
- [ ] ¿No hay consola.log de debug?
- [ ] ¿Funciona en móvil y desktop?
- [ ] ¿Las imágenes cargan rápido (lazy)?

---

## 🎓 Niveles de Crecimiento

```
Nivel 1 - Funciona
  └─ "El código hace lo que quiero"

Nivel 2 - Limpio
  └─ "Otro dev lo puede entender"

Nivel 3 - Profesional ✅ AQUÍ
  └─ "Está bien arquitecturado"

Nivel 4 - Universitario
  └─ "+ Testing + CI/CD + Documentación"

Nivel 5 - Senior
  └─ "Puede escalar a millones de usuarios"
```

---

## 📞 Referencia Rápida

| Necesito... | Archivo | Función |
|------------|---------|---------|
| Fetch personajes | `api.js` | `getCharacters()` |
| Cambiar estado | `Home.jsx` | `useState()` |
| Renderizar tarjeta | `CharacterCard.jsx` | Componente |
| Buscar | `Home.jsx` | `searchTerm` state |
| Mostrar errores | `Home.jsx` | `error` state |
| Estilos globales | `index.css` | Tailwind |
| Encabezado | `Header.jsx` | Componente |

---

## 🔗 Documentación Completa

Para más detalles, lee:

1. **Conceptos**: [REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md)
2. **Técnico**: [API_SERVICE_DOCS.md](./API_SERVICE_DOCS.md)
3. **Visual**: [ARQUITECTURA_VISUAL.md](./ARQUITECTURA_VISUAL.md)
4. **Checklist**: [CHECKLIST_COMPLETADO.md](./CHECKLIST_COMPLETADO.md)

---

**¡Ahora ya sabes cómo funciona todo!** 🚀
