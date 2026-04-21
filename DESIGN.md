# Design System Documentation: The Luminous Architect

## 1. Overview & Creative North Star

### Creative North Star: The Luminous Architect
This design system is built to move beyond the "standard developer portfolio" by embracing the concept of **The Luminous Architect**. It represents the intersection of rigid technical logic (The Architect) and the fluid, ethereal nature of modern digital interfaces (The Luminous). 

Instead of a traditional grid-heavy layout, we utilize **Intentional Asymmetry** and **Visual Silence**. We treat white space not as "empty space," but as a structural element that guides the eye. By layering semi-transparent surfaces over deep, tonal charcoals, we create an interface that feels like a high-end physical object—machined, polished, and premium. We break the "template" look by using exaggerated typographic scales and overlapping elements that defy the standard box-model constraints.

---

## 2. Colors & Surface Philosophy

The palette is anchored in deep tech-tonalities, using high-contrast accents to highlight the "pulse" of the code.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined solely through background color shifts or subtle tonal transitions. 
*   *Example:* A section transition should move from `surface` (`#0c0e11`) to `surface-container-low` (`#111417`). 

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface-container` tiers to create "nested" depth:
*   **Base:** `surface` (`#0c0e11`)
*   **Recessed Content:** `surface-container-lowest` (`#000000`)
*   **Standard Cards:** `surface-container-high` (`#1d2024`)
*   **Prominent Overlays:** `surface-container-highest` (`#23262a`)

### The "Glass & Gradient" Rule
To achieve a signature feel, floating elements (like Navbars or hovered Tooltips) must use **Glassmorphism**. Use a semi-transparent `surface` color with a `backdrop-blur` of 12px–20px. 
*   **Signature Texture:** For primary CTAs, do not use flat colors. Apply a subtle linear gradient from `primary` (`#69daff`) to `primary-container` (`#00cffc`) at a 135-degree angle to provide a "lit from within" effect.

---

## 3. Typography

The typographic strategy pairs the structural precision of **Inter** with the editorial character of **Manrope**.

*   **Display & Headline (Manrope):** These are your "Brand Moments." Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero statements. The goal is an authoritative, editorial look that feels custom-designed for the content.
*   **Title & Body (Inter):** Used for functional clarity. `body-lg` (1rem) provides high legibility for project descriptions.
*   **Labels (Inter):** Use `label-md` in uppercase with 0.05em letter-spacing for technical metadata (e.g., "TECH STACK," "TIMESTAMP"), utilizing the `on-surface-variant` (`#aaabaf`) color.

---

## 4. Elevation & Depth

We convey hierarchy through **Tonal Layering** rather than traditional structural lines or heavy drop shadows.

### The Layering Principle
Depth is achieved by stacking tiers. Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a "soft lift" that feels integrated into the environment rather than hovering precariously over it.

### Ambient Shadows
When a floating effect is required (e.g., a modal or active project card):
*   **Blur:** 40px–60px.
*   **Opacity:** 4%–8%.
*   **Color:** Use the `primary` token (`#69daff`) at low opacity instead of black. This creates a "glow" rather than a "shadow," reinforcing the tech-centric identity.

### The "Ghost Border" Fallback
If a border is absolutely necessary for accessibility, use the **Ghost Border**: `outline-variant` (`#46484b`) at 15% opacity. Never use 100% opaque borders.

### Glassmorphism Implementation
For the Navbar and high-quality image containers:
*   **Background:** `surface` at 60% opacity.
*   **Blur:** 16px.
*   **Edge:** A 1px top-edge highlight using `outline-variant` at 20% opacity to mimic the "catch-light" on a piece of glass.

---

## 5. Components

### Buttons
*   **Primary:** Background gradient (`primary` to `primary-container`). Text: `on-primary-fixed` (`#002a35`). Shape: `md` (0.375rem).
*   **Secondary:** Background: `secondary-container` (`#006688`). On Hover: Transition to `secondary` (`#17c0fd`) with a 200ms ease-in-out.
*   **Tertiary:** No background. Text: `primary`. On Hover: `surface-bright` background at 10% opacity.

### Image Containers
*   **Style:** Use the `xl` (0.75rem) roundedness scale. 
*   **Overlay:** Images should have a subtle `surface-dim` gradient overlay at the bottom to ensure `title-sm` text remains readable if placed over the image.

### Chips (Tech Tags)
*   **Visuals:** `surface-container-high` background with `on-surface-variant` text. 
*   **Interaction:** On hover, the chip should scale by 1.05 and the text color should shift to `primary`.

### Input Fields
*   **State:** Default background is `surface-container-low`.
*   **Focus:** Transition background to `surface-container-highest` and add a `primary` "Ghost Border" (20% opacity). No heavy focus rings.

### Cards & Lists
*   **Rule:** Forbid divider lines. Separate list items using vertical white space (use the `md` or `lg` spacing gaps) or a subtle background shift on hover (`surface-bright`).

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins (e.g., pushing content 1/3rd from the left) to create an editorial layout.
*   **Do** use the `primary` accent sparingly to draw attention to actionable items only.
*   **Do** ensure all text on `background` uses `on-background` (`#f9f9fd`) for maximum contrast.
*   **Do** use large, high-quality images that bleed off the edge of the grid to break the "container" feel.

### Don't
*   **Don't** use 1px solid borders to separate sections.
*   **Don't** use pure black (#000000) for anything other than `surface-container-lowest` recessed areas.
*   **Don't** use standard "drop shadows" (black, high-opacity, small blur).
*   **Don't** crowd elements. If in doubt, double the padding. This system lives and breathes through its whitespace.