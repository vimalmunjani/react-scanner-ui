<div align="center">
  <img src="./logo.png" alt="React Scanner Studio Logo" width="150" height="150">
  <h1>React Scanner Studio</h1>
  <p>A portable, interactive dashboard for analyzing React component usage across your codebase.</p>

  [![npm version](https://img.shields.io/npm/v/react-scanner-studio.svg)](https://www.npmjs.com/package/react-scanner-studio)
  [![GitHub stars](https://img.shields.io/github/stars/vimalmunjani/react-scanner-studio?style=social)](https://github.com/vimalmunjani/react-scanner-studio/stargazers)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

---

## ✨ Features

- 🔍 **Component Scanning** — Leverages react-scanner to analyze React component usage across your entire codebase
- 📊 **Interactive Dashboard** — Beautiful UI for exploring component statistics, prop usage patterns, and adoption metrics
- 📦 **Portable Build** — Generate static HTML files that can be hosted anywhere or shared with your team — no server required
- ⚡ **Zero Config Setup** — Get started in seconds with the `init` command that automatically configures everything
- 🎨 **Design System Tracking** — Perfect for tracking design system component adoption across multiple projects
- 🔧 **CI/CD Ready** — Built-in CI mode for seamless integration with your continuous integration pipelines

## 📖 Documentation

Visit our documentation site for detailed usage guides and API reference:

👉 **[https://reactscanner.studio](https://reactscanner.studio)**

## 🎬 Live Demo

See React Scanner Studio in action:

👉 **[https://demo.reactscanner.studio](https://demo.reactscanner.studio)**

## 📸 Screenshots

<details>
<summary><strong>Dark Mode</strong></summary>

### Dashboard Overview
![Dashboard Dark](https://reactscanner.studio/screenshots/dashboard-dark.png)

### Component Inventory
![Component Inventory Dark](https://reactscanner.studio/screenshots/component-inventory-dark.png)

### Component Overview
![Component Overview Dark](https://reactscanner.studio/screenshots/component-overview-dark.png)

### Component Prop Insights
![Component Prop Insight Dark](https://reactscanner.studio/screenshots/component-prop-insight-dark.png)

### Component File Location
![Component File Location Dark](https://reactscanner.studio/screenshots/component-file-location-dark.png)

</details>

<details>
<summary><strong>Light Mode</strong></summary>

### Dashboard Overview
![Dashboard Light](https://reactscanner.studio/screenshots/dashboard-light.png)

### Component Inventory
![Component Inventory Light](https://reactscanner.studio/screenshots/component-inventory-light.png)

### Component Overview
![Component Overview Light](https://reactscanner.studio/screenshots/component-overview-light.png)

### Component Prop Insights
![Component Prop Insight Light](https://reactscanner.studio/screenshots/component-prop-insight-light.png)

### Component File Location
![Component File Location Light](https://reactscanner.studio/screenshots/component-file-location-light.png)

</details>

## 🚀 Quick Start

### Installation

```bash
# Using npx (no installation required)
npx react-scanner-studio init

# Or install globally
npm install -g react-scanner-studio

# Or add as a dev dependency
npm install --save-dev react-scanner-studio
```

### Usage

```bash
# 1. Initialize configuration (one-time setup)
npx react-scanner-studio init

# 2. Start the interactive dashboard
npx react-scanner-studio start

# 3. Build static files for sharing (optional)
npx react-scanner-studio build
```

That's it! The `start` command will automatically prompt you to scan your codebase if no scan report exists.

## 📋 CLI Commands

| Command | Description |
| ------- | ----------- |
| `init`  | Initialize react-scanner configuration in your project |
| `scan`  | Scan your codebase for component usage |
| `start` | Start the interactive dashboard development server |
| `build` | Build a portable, static version of the dashboard |

### Options

```bash
# Start on a custom port
react-scanner-studio start --port 8080

# Auto-open browser
react-scanner-studio start --open

# CI mode (no interactive prompts)
react-scanner-studio start --ci
react-scanner-studio build --ci
```

## 🎯 Use Cases

- **Design System Adoption** — Track how your design system components are being used across teams
- **Component Analytics** — Understand which components are most popular and which are underutilized
- **Prop Pattern Analysis** — Discover common prop combinations and usage patterns
- **Migration Planning** — Identify components that need to be migrated or deprecated
- **Documentation** — Generate shareable reports for stakeholders

## 🔧 Configuration

After running `init`, a `react-scanner.config.js` file is created in your project:

```js
module.exports = {
  crawlFrom: './src',
  includeSubComponents: true,
  importedFrom: '@mui/material',
  processors: [
    ['raw-report', { outputTo: './.react-scanner-studio/scan-report.json' }],
  ],
};
```

### Supported Component Libraries

Works with any component library or custom components:

- Material UI (`@mui/material`)
- Chakra UI (`@chakra-ui/react`)
- Ant Design (`antd`)
- Your custom design system (`@myorg/design-system`)
- Local components (`./components`)

## 📦 Deployment

Build static files and deploy anywhere:

```bash
# Build the dashboard
npx react-scanner-studio build

# Serve locally
npx serve .react-scanner-studio

# Or deploy to GitHub Pages, Netlify, Vercel, etc.
```

## 🤝 Community

- ⭐ [Star on GitHub](https://github.com/vimalmunjani/react-scanner-studio)
- 💬 [Join Discussions](https://github.com/vimalmunjani/react-scanner-studio/discussions)
- 🎮 [Join Discord](https://discord.gg/PU5xrNVd)
- 🐛 [Report Issues](https://github.com/vimalmunjani/react-scanner-studio/issues)

## 📄 License

MIT © [Vimal Munjani](https://github.com/vimalmunjani)
