# Beniamin Cioban — Portfolio

Personal portfolio website showcasing my projects and documentation.

**Live:** [beniamincioban.com](https://beniamincioban.com)

## Tech Stack

- **React 19** with React Router (HashRouter)
- **Tailwind CSS v4** with light/dark theme
- **Vite 7** build tooling
- **highlight.js** for code syntax highlighting
- **lucide-react** icons
- **gh-pages** for deployment

## Features

- Responsive design with glass-effect navbar
- Dark / light theme toggle (persisted)
- Project showcase with carousel navigation
- Custom JSON-based documentation system with sidebar, code blocks, FAQ accordion, and deep-link scrolling
- Contact modal with clipboard copy

## Getting Started

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build      # Production build → dist/
npm run deploy     # Build + deploy to GitHub Pages
```

## Project Structure

```
src/
  components/       # Reusable UI components
    common/         # CodeBlock, ContactModal, LoadingSpinner
    documentation/  # DocSidebar, DocCard, ContentRenderer
    layout/         # Navbar, Footer
    projects/       # ProjectCard, ProjectCarousel
  context/          # ThemeContext
  hooks/            # useTheme, useFetch, useScrollSpy
  pages/            # Home, Projects, Documentation, DocumentationSelector
  styles/           # global.css, documentation.css, projects.css
public/
  data/             # JSON data files
  Images/           # Static images
  CNAME             # Custom domain
```

## Author

**Beniamin Cioban** — [@B3N14M1N](https://github.com/B3N14M1N)
