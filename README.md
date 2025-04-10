# 📊 D3.js with Svelte 5

This repository contains a collection of exercises and projects using D3.js with Svelte 5, showcasing data visualization implementations using TypeScript.

View in Live the repository here: omvidana.github.io/D3/

## 🚀 What you'll find here

Basic examples to learn D3.js fundamentals
Visualizations like:
Bar charts
Data binding examples
Dynamic transitions and updates
Interactive graphs
Manipulation of scales, axes, data, and SVG elements

## 🛠️ Technologies

Svelte 5
TypeScript
D3.js (version 7)
SvelteKit (for routing and project structure)

## 📦 Installation

    ```bash
    # create a new project in the current directory
    npx sv create
    # create a new project in my-app
    npx sv create my-app
    # Navigate to project directory (if you created my-app)
    cd my-app
    # Install dependencies
    npm install
    # Install D3.js and its types
    npm install d3
    npm install --save-dev @types/d3
    ```

## 🏃‍♂️ Running the project

    ```bash
    # Start development server
    npm run dev
    # or start with network access
    npm run dev -- --host
    # Build for production
    npm run build
    ```

## 📁 Project Structure
```
src/
├── lib/
│   ├── components/    # Svelte components with D3 visualizations
│   └── index.ts      # Component exports
├── routes/           # SvelteKit pages
└── app.html         # Main HTML template
```

## 💻 Component Structure

Each visualization is contained in a single `.svelte` file that includes:
- TypeScript for logic and D3 manipulation
- HTML for structure
- CSS for styling

Example:
```svelte
<script lang="ts">
  import * as d3 from 'd3';
  // TypeScript code here
</script>

<!-- HTML structure -->
<div class="chart-container">
  <!-- D3 will inject SVG here -->
</div>

<style>
  /* CSS styles here */
</style>
```

Instead of having a .css file, .html and .js /.ts per example it uses one .svelte component.

## 📝 Note

This project uses Svelte 5's new features including:

- Use of `$effect` for creating the main `svg`
- Use of `$state` for storing reactive values
- TypeScript for type safety
- SvelteKit for routing and project structure

---

Made with ❤️ using Svelte 5 and D3.js
