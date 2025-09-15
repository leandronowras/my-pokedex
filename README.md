# Pokédex 

This project is a real-time interactive Pokédex built with TypeScript and Next.js, powered by the [PokéAPI](https://pokeapi.co/).

With it, you can browse through Pokémon, search your favorites, apply filters, and dive into detailed pages featuring stats, evolutions, and more. <br><br>
Think of it as your own digital Professor Oak, but without the lab coat.<br>

## ✨ Main Features

### 📋 Pokémon List
- Displays all Pokémon ordered by **ID**.
- Each Pokémon shows:
  - Name ✅
  - Generation ✅
  - Types ✅

### 🎛️ Filters
- **Filter by type** (e.g., Water, Fire, Grass…). ✅  
- **Filter by generation** (e.g., Kanto, Johto, Hoenn…). ✅  

### 🔍 Real-time Search
- Instant search filtering as you type. ✅  
- Includes **evolutions** in the results.  
  (Example: searching *Pikachu* will also show *Pichu* and *Raichu*). ✅  

### 📄 Pokémon Detail Page
Clicking on a Pokémon opens a dedicated detail page with:
- Name ✅  
- Official artwork ✅  
- Generation ✅  
- Types ✅  
- Evolutions (with images) ✅  
- Base stats ✅  
- Ability to navigate between evolutions (current evolution is highlighted). ✅  

### 🔙 State Persistence
- When navigating back to the list, filters, search term, and pagination are preserved. ✅  
- (Note: state is not persisted after a full browser reload).  

## 🛠️ Tech Stack
- [Next.js](https://nextjs.org/) 
- [TypeScript](https://www.typescriptlang.org/)  
- [shadcn/ui](https://ui.shadcn.com/)
- [PokéAPI](https://pokeapi.co/)  
- [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
- [T3 Stack](https://create.t3.gg/) 
  - tRPC 
  - Zod
  - Tailwind 

## 🚀 Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/pokedex-nextjs.git
cd pokedex-nextjs
```

### 2. Install dependencies

```
npm install
```

### 3. Start development server


```bash
npm run dev
```

App will be running at:
👉 http://localhost:3000

### 4. Build for production

```bash
npm run build
npm run start
```

