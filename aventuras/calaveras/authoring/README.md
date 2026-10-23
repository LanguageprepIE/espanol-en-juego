# Editable source

The public game is ../index.html, a standalone build with its optimized illustrations embedded. To restore the editable project locally:

1. Run `python3 extract-assets.py` here.
2. Run `npm test` (Node 18 or newer).
3. Run `python3 bundle.py` to build the standalone HTML and dist/.

The source uses separate modules for physics, input, story, level, rendering and animation. QA controls are stripped from the standalone HTML. Original generated character artwork was prepared as a transparent six-cell atlas; the public build contains the optimized WebP, not the large design source. Assets/source-work04/characters.png was created using built-in image generation, with three NPCs and three consistent owl poses. See WORK04.md for changes and test limitations.
