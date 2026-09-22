# Positive animated frontend refresh

## Goal

Keep the current EduAlert PCMB layout, information, filters, cards, and actions unchanged while making the experience warmer, more polished, and more motivating.

## Visual refresh

- Enrich the existing navy, saffron, and teal design tokens with warmer page surfaces, clearer borders, and softer depth.
- Improve the header, summary counters, sticky filters, exam cards, timeline rows, and detail panels without moving or removing content.
- Keep the dense, scan-friendly three-column dashboard and current mobile stacking.

## Motion

- Add a reusable intersection-based reveal so sections and exam cards fade and rise gently as they enter the viewport.
- Stagger cards subtly, add restrained lift and shadow feedback on hover, and animate active filters and alert controls.
- Respect reduced-motion preferences and avoid motion that distracts from deadlines.

## Technical details

- Add one small client-safe scroll reveal component using `IntersectionObserver`.
- Apply semantic animation, surface, and shadow tokens in the global stylesheet.
- Update the dashboard card and exam detail presentation classes only; business logic, data, URLs, and page structure remain unchanged.
- Verify desktop and mobile rendering, scrolling reveals, interactions, and browser console output.
