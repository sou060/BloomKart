# Theme Features - BloomKart E-commerce

## Light and Dark Mode Support

BloomKart now includes comprehensive light and dark mode support across all pages and components.

### Features

#### 🌙 Dark Mode

- **Automatic Detection**: Automatically detects user's system preference
- **Manual Toggle**: Users can manually switch between light and dark themes
- **Persistent Storage**: Theme preference is saved in localStorage
- **Smooth Transitions**: All theme changes include smooth animations

#### ☀️ Light Mode

- **Default Theme**: Clean, bright interface optimized for daytime use
- **High Contrast**: Excellent readability and accessibility
- **Professional Look**: Modern, floral-themed design

### How to Use

#### Theme Toggle

- **Location**: Top navigation bar (next to cart icon)
- **Icon**: Sun icon (☀️) in dark mode, Moon icon (🌙) in light mode
- **Click**: Toggle between light and dark themes instantly

#### Automatic Behavior

- **First Visit**: Uses system preference (light/dark)
- **Return Visits**: Remembers your last selected theme
- **System Changes**: Automatically adapts to system theme changes

### Theme Variables

The application uses CSS custom properties for consistent theming:

#### Light Theme Colors

```css
--bg-primary: #ffffff
--bg-secondary: #f8f9fa
--text-primary: #212529
--text-secondary: #6c757d
--border-color: #dee2e6
--card-bg: #ffffff
--input-bg: #ffffff
```

#### Dark Theme Colors

```css
--bg-primary: #121212
--bg-secondary: #1e1e1e
--text-primary: #ffffff
--text-secondary: #b0b0b0
--border-color: #404040
--card-bg: #1e1e1e
--input-bg: #2d2d2d
```

### Components with Theme Support

#### ✅ Fully Themed Components

- **Navigation Bar**: Adaptive colors and backgrounds
- **Product Cards**: Dynamic backgrounds and text colors
- **Forms**: Input fields, buttons, and labels
- **Tables**: Headers, rows, and hover effects
- **Modals**: Content, headers, and footers
- **Dropdowns**: Menus and items
- **Pagination**: Page links and active states
- **Alerts**: Success, error, warning, and info messages
- **Buttons**: All button variants and states
- **Cards**: Headers, bodies, and hover effects

#### 🎨 Visual Enhancements

- **Smooth Transitions**: 0.3s ease transitions for all theme changes
- **Hover Effects**: Enhanced hover states for both themes
- **Shadows**: Adaptive shadow intensities
- **Gradients**: Theme-appropriate gradient colors
- **Icons**: Proper contrast in both themes

### Technical Implementation

#### Theme Context

```jsx
import { useTheme } from "../context/ThemeContext";

const { isDarkMode, toggleTheme } = useTheme();
```

#### CSS Variables

The application uses CSS custom properties for dynamic theming:

- Light theme: `:root` selector
- Dark theme: `[data-theme="dark"]` selector

#### Local Storage

Theme preference is automatically saved and restored:

```javascript
localStorage.setItem("theme", isDarkMode ? "dark" : "light");
```

### Accessibility

#### WCAG Compliance

- **Color Contrast**: Meets WCAG 2.1 AA standards in both themes
- **Focus Indicators**: Clear focus states in both themes
- **Text Scaling**: Supports browser text scaling
- **Screen Readers**: Proper ARIA labels and semantic HTML

#### User Preferences

- **System Preference**: Respects `prefers-color-scheme` media query
- **Manual Override**: Users can override system preference
- **Persistent Choice**: Remembers user's explicit choice

### Browser Support

#### Supported Browsers

- ✅ Chrome 88+
- ✅ Firefox 87+
- ✅ Safari 14+
- ✅ Edge 88+

#### Features

- **CSS Custom Properties**: Full support
- **Local Storage**: Full support
- **Media Queries**: Full support
- **Smooth Transitions**: Full support

### Future Enhancements

#### Planned Features

- **Custom Themes**: User-defined color schemes
- **Auto-switch**: Time-based theme switching
- **Animation Preferences**: Reduced motion support
- **High Contrast Mode**: Enhanced accessibility theme

#### Performance Optimizations

- **CSS-in-JS**: Potential migration for better performance
- **Theme Preloading**: Faster theme switching
- **Bundle Optimization**: Smaller CSS bundles per theme

---

_Last updated: December 2024_
