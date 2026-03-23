# Edwisely.com UI/UX Reference Guide

This file summarizes the main UI/UX design elements from edwisely.com for compatibility in your new project.

## 1. Color Palette
- **Primary Blue:** #1B75BC
- **Accent Blue:** #61dafb
- **Dark Blue/Black:** #282c34
- **White:** #FFFFFF
- **Gray:** #F5F6FA, #E5E9F2
- **Text:** #222B45, #6C757D

## 2. Fonts
- **Primary Font:** 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif
- **Code Font:** 'source-code-pro', Menlo, Monaco, Consolas, 'Courier New', monospace

## 3. Border Radius
- **Common:** 8px, 12px, 16px (rounded corners on cards, buttons, inputs)

## 4. Box Shadows
- **Subtle shadow:** 0 2px 8px rgba(44, 62, 80, 0.08)
- **Hover shadow:** 0 4px 16px rgba(44, 62, 80, 0.12)

## 5. Animations & Transitions
- **Logo Spin:**
  ```css
  @keyframes App-logo-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .App-logo { animation: App-logo-spin infinite 20s linear; }
  ```
- **Button/Link Hover:**
  - Color transitions (e.g., background or text color fades)
  - Slight scale up or shadow on hover
  - Example:
    ```css
    .btn:hover, a:hover {
      background: #1B75BC;
      color: #fff;
      box-shadow: 0 4px 16px rgba(44,62,80,0.12);
      transition: all 0.2s;
    }
    ```

## 6. Loading Indicators
- **Spinner:** Circular spinner, blue accent (#1B75BC or #61dafb)
- **Skeletons:** Light gray blocks (#F5F6FA) for loading content

## 7. Other UI Details
- **Card backgrounds:** White (#FFF) with subtle shadow and rounded corners
- **Section backgrounds:** Alternating white and light gray (#F5F6FA)
- **Buttons:**
  - Primary: Blue background, white text, rounded corners
  - Secondary: White background, blue border/text, rounded corners

---

**Tip:** Use these styles in your CSS/SCSS or as a theme in your component library for maximum compatibility with Edwisely.com.
