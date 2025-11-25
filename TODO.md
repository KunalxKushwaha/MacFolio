# Task: Create Text File Window Component

## Completed Steps

- Created `src/windows/text.jsx` as `TextFileWindow` component wrapped with `WindowWrapper`.
- The component reads `txtfile` window data from `useWindowStore` and renders `name`, optional `image`, optional `subtitle`, and description paragraphs.
- Created `src/windows/index.js` exporting the existing window components and the new `TextFile` component.
- Updated `src/App.jsx` to import and include the `TextFile` window component in the main app component.

## Next Steps

- Test the app by opening a text file in Finder and verify that the Text File Window opens and displays content correctly.
- Ensure no console errors or layout issues.
- Add any needed styling refinements if required.
