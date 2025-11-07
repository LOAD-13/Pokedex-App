# 📱 Pokédex - Aplicación Web Moderna

Una Pokédex interactiva y completa construida con **Astro**, **React**, **TypeScript** y **Tailwind CSS 4**. Explora, compara y construye equipos con datos en tiempo real de la [PokéAPI](https://pokeapi.co/).

![Astro](https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🌟 Características

### 🔍 Exploración de Pokémon
- **Grid interactivo** con más de 1000 Pokémon
- **Búsqueda en tiempo real** por nombre o número
- **Filtros avanzados** por tipo, generación y estadísticas
- **Carga infinita** con scroll automático
- **Modo oscuro** y diseño responsive

### 📊 Comparador de Pokémon
- Compara **2-3 Pokémon** simultáneamente
- Visualización de estadísticas con barras de progreso
- **Análisis de ventajas de tipo** automático
- **Veredicto inteligente** basado en stats y matchups
- Recomendaciones de batalla

### 👥 Team Builder
- Construye equipos de **hasta 6 Pokémon**
- **Análisis de cobertura defensiva** del equipo
- Detección de **resistencias, debilidades e inmunidades**
- **Recomendaciones inteligentes** para balancear el equipo
- Sistema de **guardado/carga** de equipos (LocalStorage)

### 📚 Enciclopedia
- **Tabla de efectividad** de los 18 tipos
- Información de **100+ habilidades** con datos reales
- Catálogo de **100+ movimientos** con estadísticas
- Búsqueda y filtrado en todas las secciones
- Datos traducidos al español cuando están disponibles

### 🎨 Detalles de Pokémon
- Vista completa con **imagen oficial y shiny**
- Toggle animado **Normal/Shiny**
- **Tabs navegables**: About, Stats, Moves, Evolution
- Cadena evolutiva interactiva con niveles
- **Movimientos aprendidos por nivel**
- Estadísticas con barras animadas

---

## 🚀 Tecnologías

- **[Astro 5.x](https://astro.build/)** - Framework web moderno
- **[React 18](https://react.dev/)** - Componentes interactivos
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Estilos utility-first
- **[PokéAPI](https://pokeapi.co/)** - Datos de Pokémon en tiempo real
- **[Material Symbols](https://fonts.google.com/icons)** - Iconografía
- **[pnpm](https://pnpm.io/)** - Gestor de paquetes rápido

---

## 📦 Instalación

### Prerrequisitos

- **Node.js** 18.x o superior
- **pnpm** (recomendado) o npm

```bash
# Instalar pnpm globalmente (si no lo tienes)
npm install -g pnpm
```

### Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/pokedex-astro.git
cd pokedex-astro
```

### Instalar dependencias

```bash
pnpm install
```

### Configurar Tailwind CSS 4

Tailwind 4 se instala automáticamente con Astro. Verifica que `src/styles/global.css` contenga:

```css
@import "tailwindcss";
```

---

## 🎮 Uso

### Desarrollo

Inicia el servidor de desarrollo:

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:4321`

### Build para producción

```bash
pnpm build
```

⚠️ **Nota**: El build puede tardar varios minutos si generas todas las páginas de Pokémon (1025). Considera reducir el número en `getStaticPaths()` para builds más rápidos durante el desarrollo.

### Vista previa de producción

```bash
pnpm preview
```

---

## 📁 Estructura del Proyecto

```
pokedex-astro/
├── public/
│   └── icons/
│       └── types/          # Iconos SVG de tipos Pokémon
│           ├── bug.svg
│           ├── fire.svg
│           ├── water.svg
│           └── ...
├── src/
│   ├── components/
│   │   ├── react/          # Componentes React interactivos
│   │   │   ├── Comparador.tsx
│   │   │   ├── Enciclopedia.tsx
│   │   │   ├── FilterButtons.tsx
│   │   │   ├── PokemonCard.tsx
│   │   │   ├── PokemonDetail.tsx
│   │   │   ├── PokemonGrid.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── TeamBuilder.tsx
│   │   │   └── TypeBadge.tsx
│   │   └── Header.astro    # Header con navegación responsive
│   ├── layouts/
│   │   └── Layout.astro    # Layout principal
│   ├── pages/
│   │   ├── index.astro     # Página principal (explorar)
│   │   ├── comparador.astro
│   │   ├── team-builder.astro
│   │   ├── enciclopedia.astro
│   │   └── pokemon/
│   │       └── [id].astro  # Página dinámica de detalle
│   ├── services/
│   │   └── pokeapi.ts      # Cliente de PokéAPI
│   ├── styles/
│   │   └── global.css      # Estilos globales + Tailwind
│   ├── types/
│   │   └── pokemon.ts      # Tipos TypeScript
│   └── utils/
│       ├── colors.ts       # Colores de tipos
│       ├── helpers.ts      # Funciones auxiliares
│       └── typeEffectiveness.ts  # Lógica de efectividad
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎨 Características Destacadas

### Diseño Responsive
- **Mobile-first** con breakpoints adaptativos
- Menú hamburguesa animado en móviles
- Grid flexible que se adapta a cualquier pantalla

### Modo Oscuro
- Modo oscuro por defecto
- Colores optimizados para ambos temas
- Transiciones suaves entre modos

### Rendimiento
- **Static Site Generation (SSG)** para páginas rápidas
- Lazy loading de imágenes
- Búsqueda optimizada con debounce (300ms)
- Carga incremental de Pokémon

### Accesibilidad
- Navegación por teclado
- Labels semánticos
- Contraste optimizado (WCAG AA)
- ARIA labels donde es necesario

---

## 🔧 Configuración Avanzada

### Cambiar número de Pokémon

En `src/pages/index.astro`:

```astro
const pokemon = await getPokemonList(151); // Gen 1 solamente
// const pokemon = await getPokemonList(1025); // Todas las generaciones
```

En `src/pages/pokemon/[id].astro`:

```astro
export async function getStaticPaths() {
  const totalPokemon = 151; // Cambia según necesites
  return Array.from({ length: totalPokemon }, (_, i) => ({
    params: { id: String(i + 1) }
  }));
}
```

### Modificar límites de Enciclopedia

En `src/pages/enciclopedia.astro`:

```astro
const [moves, abilities] = await Promise.all([
  getAllMoves(100),    // Cambia el límite aquí
  getAllAbilities(100), // Cambia el límite aquí
]);
```

### Personalizar colores

En `src/utils/colors.ts`, modifica el objeto `typeColors`:

```typescript
export const typeColors: Record<string, string> = {
  fire: '#f08030',  // Cambia estos valores
  water: '#6890f0',
  // ...
};
```

---

## 🌐 API y Rate Limiting

Esta aplicación usa la [PokéAPI](https://pokeapi.co/) pública. Ten en cuenta:

- **Sin límite de rate oficial** pero se recomienda cachear datos
- Los datos se cachean durante el build (SSG)
- En desarrollo, las peticiones van directamente a la API
- Para producción, todo está pre-generado (no hay peticiones en runtime)

### Manejo de Errores

Si experimentas errores de API durante el desarrollo:

1. **Reduce el límite** de Pokémon cargados
2. **Agrega delays** en las peticiones:

```typescript
// En src/services/pokeapi.ts
await new Promise(resolve => setTimeout(resolve, 100));
```

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Preview de producción
pnpm preview

# Limpiar caché
rm -rf .astro dist node_modules/.astro

# Reinstalar dependencias
pnpm install
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 🐛 Problemas Conocidos

### Build lento con muchos Pokémon
**Solución**: Reduce el número en `getStaticPaths()` durante desarrollo. Usa el número completo solo para producción.

### Imágenes no cargan en build
**Solución**: Verifica que las URLs de la API sean correctas y accesibles públicamente.

### Menú móvil no cierra
**Solución**: Asegúrate de que el script del Header no esté en `<script is:inline>`.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 🙏 Agradecimientos

- **[PokéAPI](https://pokeapi.co/)** - Por proporcionar datos gratuitos y completos
- **[The Pokémon Company](https://www.pokemon.com/)** - Por crear el universo Pokémon
- **Iconos de tipos** - Diseñados específicamente para este proyecto
- **Comunidad de Astro** - Por el excelente framework y documentación

---

## 👨‍💻 Autor

**Joaquín Loa Denegri**

- GitHub: [@LOAD-13](https://github.com/LOAD-13)
- Proyecto: [Pokédex Astro](https://github.com/LOAD-13/pokedex-astro)

---

## 🎯 Roadmap

- [ ] Sistema de favoritos persistente
- [ ] Compartir equipos con URLs
- [ ] Gráficos con Recharts para comparaciones
- [ ] Simulador de batalla 1v1
- [ ] Búsqueda avanzada con múltiples filtros
- [ ] PWA (Progressive Web App)
- [ ] Soporte para formas alternativas (Mega, Gigamax)
- [ ] Integración con API de TCG (cartas)

---

**⭐ Si este proyecto te resultó útil, considera darle una estrella en GitHub ⭐**