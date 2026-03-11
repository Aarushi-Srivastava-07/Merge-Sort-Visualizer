# Merge Sort Visualizer (Divide & Conquer)

This project provides an interactive web page to visualize the **Merge Sort** algorithm, a classic example of the divide‑and‑conquer paradigm. Users can generate random arrays, step through each merge operation, and observe how the array is sorted incrementally. The page also includes a clear explanation of the divide, conquer, and combine steps, along with time complexity analysis.

## Features

- **Step‑by‑step animation** – Click “Step” to perform one merge at a time, or “Play” to watch the entire process.
- **Adjustable array size** – Use the slider to change the number of elements (2–20).
- **Random array generation** – Each click on “Randomize” creates a new array of random integers.
- **Highlighting** – The range being merged is highlighted in yellow so you can easily follow the current operation.
- **Explanation panel** – Describes the divide‑conquer‑combine steps and gives the recurrence relation `T(n) = 2T(n/2) + O(n)` leading to `O(n log n)` time complexity.

## How to Use

1. Open `index.html` in any modern web browser.
2. Adjust the array size with the slider.
3. Click **Randomize** to generate a new array.
4. Use **Step** to advance one merge at a time, or **Play** to watch continuously.
5. **Reset** returns to the initial (unsorted) state.
6. The status bar shows the current step and description.

## Implementation Details

- **Algorithm**: Bottom‑up (iterative) merge sort is used to generate a sequence of merge steps. This approach makes it easy to record the array state after each merge.
- **Step generation**: The `generateSteps` function simulates the entire sorting process, storing a snapshot of the array after every merge. Each snapshot includes the indices of the merged range.
- **Rendering**: The array is displayed as a row of coloured bars. Bars within the currently merged range get a special class (`merged-range`) for visual feedback.
- **Controls**: JavaScript handles button events, manages a play interval, and updates the display.

## Files

- `index.html` – Structure of the web page.
- `style.css` – All styling, including layout, colours, and responsiveness.
- `script.js` – Core logic: array generation, merge sort, step recording, and UI interaction.
- `README.md` – This documentation.

## Time Complexity Explanation

The recurrence for merge sort is:
T(n) = 2T(n/2) + O(n)

- **Divide**: O(1) – just compute the middle index.
- **Conquer**: 2T(n/2) – recursively sort two halves.
- **Combine**: O(n) – merging two sorted subarrays.

Solving the recurrence gives **O(n log n)**.


