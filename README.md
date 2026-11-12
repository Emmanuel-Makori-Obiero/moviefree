# moviefree

Static site: `index.html` + `index.js` + compiled `output.css` (no framework, no build step at deploy time).

## Design

- Pages, rows, film detail, trailer modal and footer follow a NEON-style white catalogue.
- The header, menu drawer, account/watchlist dropdowns and search (live suggestions + results page) follow Criterion's navbar and search behaviour.
- All film/TV data and images come from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.

## Routes (client-side, query string)

`/` home · `?movie=ID` · `?tv=ID` · `?person=ID` · `?q=dune` search results · `?q=dune&view=films|tv|people` view all · `?q=dune&view=pages&p=2` more results · `?browse=movies|now-playing|upcoming|top-rated|trending|tv|tv-top|all|watchlist|recent` (+ `&genre=` / `&status=released|upcoming`).

## CSS

Edit `input.css`, then rebuild the committed stylesheet:

```bash
npx @tailwindcss/cli -i ./input.css -o ./output.css
```

## Legacy streaming-mirror player

Still in the code but not linked from the new design: the "LEGACY STREAM PLAYER" block near the top of `index.js` and the `#video-modal` markup at the bottom of `index.html`. It can be opened from the console with `window.moviefreeLegacyPlayer.open(item)`.
