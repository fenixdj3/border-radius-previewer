# Border Radius Previewer

A modern, interactive tool for visualizing and customizing CSS border-radius values. Built with React, TailwindCSS, and Vite.

![Border Radius Previewer](https://img.shields.io/badge/React-18.3.1-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38bdf8)
![Vite](https://img.shields.io/badge/Vite-5.1.6-646cff)

## 🚀 Live Demo

[View Live Demo](https://fenixdj3.github.io/border-radius-previewer/)

## Features

### Core Functionality
- **Live Preview**: See your border-radius changes in real-time with smooth animations
- **Simple Mode**: Control 4 corner values (top-left, top-right, bottom-right, bottom-left)
- **Advanced Mode**: Control all 8 values (horizontal and vertical radii for each corner) to create complex shapes
- **Copy to Clipboard**: One-click copy of the generated CSS
- **Reset Function**: Quickly return to default values

### Interactive Controls
- **Draggable Handles**: Directly manipulate border-radius by dragging handles on the preview box
- **Color-Coded Sliders**: Each corner has a unique color for easy identification
- **Unit Toggle**: Switch between pixels (px) and percentages (%)
- **Box Size Control**: Adjust width and height independently (100px - 300px)
- **Grid Overlay**: Toggle a visual grid for precise adjustments

### Presets
Quickly apply common shapes:
- **Default**: Standard rounded corners
- **Circle**: Perfect circle
- **Pill**: Pill-shaped (horizontal)
- **Leaf**: Leaf-like shape
- **Egg**: Egg-shaped
- **Blob**: Organic blob shape

### UI/UX
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Custom Scrollbars**: Styled scrollbars for better aesthetics
- **Smooth Animations**: 300ms transitions for all value changes
- **Modern UI**: Clean design with gradient backgrounds and color-coded sections

## User Stories Covered

✅ User can see a box which has a border-radius property applied to it  
✅ User can change the 4 border-radius values that are applied to the box (top-left, top-right, bottom-left, bottom-right)  
✅ User can copy the resulting CSS to the clipboard  
✅ User can change all 8 possible values of the border-radius to create complex shapes  
✅ User can drag handles directly on the preview box for intuitive control  
✅ User can switch between pixel and percentage units  
✅ User can adjust the preview box size (width and height independently)  
✅ User can apply preset shapes for quick results  
✅ User can toggle a grid overlay for precise adjustments  
✅ User can switch between light and dark themes  

## Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown in the terminal (typically http://localhost:3000)

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build:
```bash
npm run preview
```

## Tech Stack

- **React 18.3.1** - UI library
- **Vite 5.1.6** - Build tool and dev server
- **TailwindCSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.344.0** - Icon library
- **clsx 2.1.0** - Utility for conditional class names
- **tailwind-merge 2.2.1** - Utility for merging Tailwind classes

## Usage Guide

### Simple Mode (4 Values)
Use the color-coded sliders to adjust the border-radius for each corner:
- **Top Left** (Indigo) - Top-left corner radius
- **Top Right** (Purple) - Top-right corner radius
- **Bottom Right** (Pink) - Bottom-right corner radius
- **Bottom Left** (Blue) - Bottom-left corner radius

Alternatively, drag the handles directly on the preview box along the edges.

### Advanced Mode (8 Values)
Switch to advanced mode to control both horizontal and vertical radii for each corner:
- **Top Left Corner** - Horizontal and vertical radii
- **Top Right Corner** - Horizontal and vertical radii
- **Bottom Right Corner** - Horizontal and vertical radii
- **Bottom Left Corner** - Horizontal and vertical radii

This enables you to create elliptical and complex shapes.

### Units
- **Pixels (px)**: Precise control with 1px increments (0-200px)
- **Percentages (%)**: Relative control with 5% increments (0-100%)

### Box Size
Adjust the preview box dimensions:
- **Width**: 100px - 300px
- **Height**: 100px - 300px

This allows you to test border-radius on different aspect ratios.

### Presets
Click any preset button to instantly apply a pre-configured shape:
- Great for inspiration or starting points
- Automatically switches to simple mode
- Can be further customized after applying

### Grid Overlay
Toggle the grid button to show a visual overlay on the preview box:
- Helps with precise alignment
- 20px grid spacing
- Semi-transparent for visibility

### Copy CSS
Click the "Copy" button next to the CSS output to copy the border-radius rule to your clipboard. The copied CSS includes the correct unit (px or %).

### Dark Mode
Toggle the theme button (sun/moon icon) to switch between light and dark themes. Your preference is maintained during the session.

## Keyboard Shortcuts
Currently, the tool is mouse/touch optimized. Keyboard shortcuts may be added in future updates.

## Browser Support
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments
- Inspired by the need for better border-radius visualization tools
- Built with modern web technologies for optimal performance
- Icons provided by Lucide React
