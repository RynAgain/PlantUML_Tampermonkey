# PlantUML Helper - General Style Guide

## 📋 Overview

This document serves as the comprehensive style guide for the PlantUML Helper userscript. It defines the color palette, typography, spacing, and design principles used throughout the application.

**Current Theme**: Earth Tones (v2.1.0)  
**Last Updated**: 2026-01-02

---

## 🎨 Color Palette

### Primary Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Dark Brown | `#3a3228` | rgb(58, 50, 40) | Main panel background |
| Medium Brown | `#4a3f35` | rgb(74, 63, 53) | Tabs, items, toolbars |
| Very Dark Brown | `#2a2520` | rgb(42, 37, 32) | Code blocks, canvas background |
| Dark Tan | `#5a4a3a` | rgb(90, 74, 58) | Borders, dividers |

### Accent Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Tan | `#a67c52` | rgb(166, 124, 82) | Primary buttons, active tabs, borders |
| Darker Tan | `#8b6f47` | rgb(139, 111, 71) | Button hover, gradients |
| Light Tan | `#d4a574` | rgb(212, 165, 116) | Highlights, section headers |
| Medium Tan | `#7a6547` | rgb(122, 101, 71) | Scrollbar hover |

### Text Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Cream | `#fff8e7` | rgb(255, 248, 231) | Text on dark backgrounds, buttons |
| Light Cream | `#e8dcc8` | rgb(232, 220, 200) | Primary text color |
| Light Tan Text | `#c9b896` | rgb(201, 184, 150) | Code text |
| Medium Tan Text | `#c4b5a0` | rgb(196, 181, 160) | Inactive tab text |
| Muted Text | `#b8a890` | rgb(184, 168, 144) | Labels, descriptions |

### Node Colors (Visual Editor)

| Node Type | Background | Border | Usage |
|-----------|-----------|--------|-------|
| Default | `#a67c52` | `#8b6f47` | Standard nodes |
| Actor | `#9b7653` | `#7a5f42` | Actor/user nodes |
| Class | `#6b8e23` | `#556b1f` | Class diagram nodes |
| Component | `#cd853f` | `#a0652f` | Component nodes |
| Database | `#8b4513` | `#6b3410` | Database nodes |

### State Colors

| State | Color | Hex Code | Usage |
|-------|-------|----------|-------|
| Success/Active | Olive Green | `#6b8e23` | Active buttons, success states |
| Warning | Peru | `#cd853f` | Warning states |
| Danger/Delete | Sienna | `#a0522d` | Delete buttons, error states |
| Selected | Light Tan | `#d4a574` | Selected items, highlights |

---

## 🔤 Typography

### Font Families

```css
Primary: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
Monospace: 'Courier New', monospace
```

### Font Sizes

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| Header | 16px | 600 | Panel header |
| Section Header | 14px | normal | Section titles |
| Item Title | 13px | 600 | Item titles |
| Body Text | 12px | normal | Search input, general text |
| Small Text | 11px | normal | Tabs, buttons, labels, code |
| Tiny Text | 10px | normal | Copy buttons |

---

## 📏 Spacing & Layout

### Padding

| Element | Padding | Usage |
|---------|---------|-------|
| Panel | 15px | Main content area |
| Header | 12px 15px | Panel header |
| Items | 10px | Content items |
| Toolbars | 8px | Editor toolbars |
| Code Blocks | 8px | Code display |
| Buttons | 5px 10px | Standard buttons |
| Small Buttons | 4px 10px | Copy buttons |

### Margins

| Element | Margin | Usage |
|---------|--------|-------|
| Sections | 0 0 20px 0 | Between sections |
| Tabs | 0 0 15px 0 | Below tab bar |
| Items | 0 0 8px 0 | Between items |
| Code Blocks | 5px 0 | Around code |

### Border Radius

| Element | Radius | Usage |
|---------|--------|-------|
| Panel | 8px | Main panel corners |
| Header | 6px 6px 0 0 | Panel header top corners |
| Buttons | 6px | Toggle button |
| Items | 4px | Content items, tabs, buttons |
| Small Buttons | 3px | Copy buttons |
| Circles | 50% | Actor nodes, delete buttons |
| Database | 4px 4px 15px 15px | Database nodes |

---

## 🎯 Component Styles

### Panel

```css
Background: #3a3228
Border: 2px solid #a67c52
Border Radius: 8px
Box Shadow: 0 4px 20px rgba(0,0,0,0.5)
Max Height: 85vh
Width: 450px
```

### Header

```css
Background: linear-gradient(135deg, #8b6f47 0%, #6b5638 100%)
Text Color: #fff8e7
Padding: 12px 15px
```

### Tabs

```css
Inactive Background: #4a3f35
Inactive Text: #c4b5a0
Active Background: #a67c52
Active Text: #fff8e7
Border Bottom: 2px solid #5a4a3a
```

### Buttons

```css
Primary Background: #a67c52
Primary Text: #fff8e7
Primary Hover: #8b6f47

Secondary Background: #6b5638
Secondary Text: #fff8e7
Secondary Hover: #7a6547

Active Background: #6b8e23
```

### Input Fields

```css
Background: #4a3f35
Border: 1px solid #6b5638
Text: #e8dcc8
Focus Border: #a67c52
```

### Code Blocks

```css
Background: #2a2520
Text: #c9b896
Border Radius: 4px
Font: 'Courier New', monospace
Font Size: 11px
```

---

## 🎨 Design Principles

### 1. Warm & Natural
- Use earth tones to create a comfortable, organic feel
- Avoid harsh, bright colors
- Maintain warmth throughout the palette

### 2. Readable Contrast
- Ensure sufficient contrast between text and backgrounds
- Light text on dark backgrounds
- Darker accents for emphasis

### 3. Consistent Hierarchy
- Darker = background
- Medium = content containers
- Lighter = interactive elements
- Lightest = text and highlights

### 4. Subtle Transitions
- Use smooth color transitions
- Hover states slightly darker/lighter
- Maintain visual continuity

### 5. Purposeful Color
- Each color has a specific purpose
- Consistent usage across components
- Semantic meaning (green = success, sienna = danger)

---

## 🔄 Theme Variations

### Current: Earth Tones (v2.1.0)
- Primary: Browns and tans
- Accent: Olive green
- Feel: Warm, natural, comfortable

### Future Theme Ideas

#### Ocean Blues
- Primary: Deep blues and teals
- Accent: Cyan
- Feel: Cool, calm, professional

#### Forest Greens
- Primary: Dark greens and moss
- Accent: Sage green
- Feel: Natural, fresh, organic

#### Sunset Warm
- Primary: Deep oranges and reds
- Accent: Coral
- Feel: Energetic, warm, vibrant

#### Monochrome
- Primary: Grays and blacks
- Accent: White
- Feel: Minimal, modern, clean

---

## 📝 Customization Guide

### Changing the Theme

To create a new theme, update the colors in [`JS/styles.js`](JS/styles.js):

1. **Define your palette** - Choose 3-5 main colors
2. **Update backgrounds** - Replace `#3a3228`, `#4a3f35`, `#2a2520`
3. **Update accents** - Replace `#a67c52`, `#8b6f47`, `#d4a574`
4. **Update text** - Replace `#e8dcc8`, `#fff8e7`, `#c9b896`
5. **Update nodes** - Replace node colors for visual editor
6. **Test contrast** - Ensure readability

### Quick Color Swap

Use find and replace in [`JS/styles.js`](JS/styles.js):

```
Find: #a67c52
Replace: [your new accent color]
```

Repeat for each color in the palette.

---

## 🎯 Accessibility

### Contrast Ratios

Maintain WCAG AA compliance:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

### Current Ratios
- Light Cream on Dark Brown: ~8.5:1 ✅
- Cream on Medium Brown: ~7.2:1 ✅
- Tan on Dark Brown: ~3.8:1 ✅

### Color Blindness
- Avoid relying solely on color
- Use icons and text labels
- Test with color blindness simulators

---

## 🔧 Implementation

### File Location
All styles are defined in: [`JS/styles.js`](JS/styles.js)

### Style Injection
Styles are injected once on page load via the `injectStyles()` function.

### Modular Architecture
The modular design allows easy theme updates without touching other functionality.

---

## 📚 References

- **Color Palette Tool**: [Coolors.co](https://coolors.co)
- **Contrast Checker**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Color Blindness Simulator**: [Coblis](https://www.color-blindness.com/coblis-color-blindness-simulator/)

---

## 📋 Changelog

### v2.1.0 (2026-01-02)
- Implemented earth tone theme
- Replaced blue/purple with browns and tans
- Updated all UI components
- Added olive green for success states

### v2.0.0 (2025-12-30)
- Initial modular architecture
- Original blue/purple theme

---

**Maintained by**: RynAgain  
**Repository**: https://github.com/RynAgain/PlantUML_Tampermonkey  
**Version**: 2.1.0
