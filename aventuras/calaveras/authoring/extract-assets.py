"""Recover optimized images embedded in the published review HTML."""
from pathlib import Path
import base64,re
root=Path(__file__).resolve().parent
release=(root.parent/'index.html').read_text()
source=(root/'src/art.js').read_text()
paths=dict(re.findall(r'"name"\s*:\s*"([^"]+)"\s*,\s*"path"\s*:\s*"([^"]+)"',source))
images=re.findall(r'"name"\s*:\s*"([^"]+)"\s*,\s*"path"\s*:\s*"data:image/webp;base64,([^"]+)"',release)
assert len(images)==len(paths),(len(images),len(paths))
for name,data in images:
 target=(root/paths[name]).resolve()
 assert target.is_relative_to(root.resolve())
 target.parent.mkdir(parents=True,exist_ok=True)
 target.write_bytes(base64.b64decode(data))
print('Recovered',len(images),'optimized image assets. Run npm test and python3 bundle.py.')
