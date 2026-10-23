"""Recover runtime images from the self-contained review build."""
from pathlib import Path
import base64, re
root = Path(__file__).resolve().parent
candidates = [root.parent / 'index.html', root / 'El-camino-de-las-calaveras.html']
release = next((p for p in candidates if p.exists() and 'data:image/webp;base64,' in p.read_text()), None)
assert release, 'A self-contained release HTML is required next to authoring/ or in this folder.'
source = (root / 'src/art.js').read_text()
paths = dict(re.findall(r'"name"\s*:\s*"([^"]+)"\s*,\s*"path"\s*:\s*"([^"]+)"', source))
images = re.findall(r'"name"\s*:\s*"([^"]+)"\s*,\s*"path"\s*:\s*"data:image/webp;base64,([^"]+)"', release.read_text())
assert len(images) == len(paths), (len(images), len(paths))
for name, data in images:
    target = (root / paths[name]).resolve()
    assert target.is_relative_to(root.resolve())
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(base64.b64decode(data))
print('Recovered', len(images), 'runtime assets. Run npm test and python3 bundle.py.')
