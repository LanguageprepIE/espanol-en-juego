# AYER: El misterio de la mochila

Original static pixel platform adventure for 3rd Year Junior Cycle Spanish. Four new maps: neighbourhood, park, station and party. Educational content lives in `content.js`, separately from `engine.js` and presentation.

## Students: independent cover work (50 minutes)

1. Open **Verb notebook**. Spend about 8 minutes reviewing regular endings and irregular verbs.
2. Click **Start the investigation**. Use arrows/A D to move, Space/W/Up to jump, E to talk. Read the mission below the game. H gives an optional English hint.
3. Find three witnesses per world. Read their Spanish testimonies and follow the matching lead. At each exit, answer three short questions. A mistake gives an explanation and a small practice route, then another try without lost clues.
4. Reserve the last **15 minutes** for **Mission Report**, available in the top bar at any point.
5. Write five original sentences about yesterday's events, using at least two regular verbs and two irregular verbs. Add a short Spanish reflection. Use your own words; you may consult the verb notebook.
6. Download PDF and upload it to your Teams Assignment. TXT, Copy and Print/Save as PDF are alternatives. Submit your actual partial progress if you run out of time; finishing every world is not required.

The 27-minute play allocation is a lesson plan, not a measured completion time. Experienced players can finish faster; reading, optional exploration and writing vary.

## Teacher notes

- Regular verbs in clues: comprar, hablar, comer, salir, preparar, recuperar, llevar, coger, correr. Irregular notebook aligned to the supplied class list: ir, ser, hacer, tener, poder, venir, estar, poner, ver, leer, querer, decir, dar.
- Interpretation + form selection; first person singular, third person singular/plural and first person plural appear in the adventure. All six persons in notebook.
- Completed-report writing checks only sentence count/length. No automated Spanish grading or validation of the two-regular/two-irregular requirement. Teacher assesses content and language.
- No login, database, analytics, external fonts, game APIs or student uploads. Student responses/name remain in memory and a sessionStorage recovery save in the current browser tab. Closing the tab can lose the session: download before closing. Static hosting serves only game files.
- Badges are distinct from school MB/UB/Merit systems: Ayuda for returning dropped objects (health); Exploración for recovering 12 stars (temporary shield); Detective for solving the checkpoint.
- Original procedural pixel art, SVG previews and oscillator sounds. No commercial sprites. No copied textbook exercises.
- Keyboard is recommended. The on-screen controls also permit touch/mouse play. Tests do not establish compatibility on the school network or physical iPads.

## QA

Run a static server from the repository root: `python3 -m http.server 8765`.
Install Playwright + its Chromium browser in a development environment. Run `node tests/ayer-browser.cjs` from the repository root. Optional environment variables: `AYER_CHROMIUM` (installed executable), `AYER_BASE_URL` (default http://127.0.0.1:8765), `AYER_QA_OUTPUT` (default /tmp).

See `QA.md` for tested behaviour and limitations.
