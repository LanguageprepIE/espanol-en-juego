"""Build static directory and a self-contained offline review copy; no dependencies."""
from pathlib import Path
import base64,re,shutil
root=Path(__file__).resolve().parent
html=(root/'index.html').read_text()
code='\n'.join((root/'src'/name).read_text() for name in ['art.js','animation.js','level.js','story.js','physics.js','input.js','game.js','render.js','main.js'])
code=re.sub(r'^import .*?;\s*','',code,flags=re.M)
code=re.sub(r'\bexport (?=(?:const|function|class))','',code)
# Explicit QA route is available only in source during development, never in review copy.
code=code.split('// Deterministic QA panel')[0]
for asset in (root/'assets').glob('work0*/*.webp'):
 data=base64.b64encode(asset.read_bytes()).decode()
 code=code.replace(str(asset.relative_to(root)),'data:image/webp;base64,'+data)
html=html.replace('<link rel="stylesheet" href="style.css">','<style>'+ (root/'style.css').read_text()+'</style>')
# A classic inline script also works when downloaded and opened with file://,
# and in preview hosts that do not run module scripts. Keep await inside an IIFE.
boot="""<script>
(async function(){
'use strict';
"""+code+"""
})().catch(function(error){
 console.error(error);
 var message=document.querySelector('#message');
 message.textContent='No se ha podido iniciar el juego. Descarga el HTML y ábrelo en Chrome, Safari o Edge.';
 message.classList.add('show');
});
</script>"""
html=html.replace('<script type="module" src="src/main.js"></script>',boot)
(root/'El-camino-de-las-calaveras.html').write_text(html)
dist=root/'dist';dist.mkdir(exist_ok=True)
for name in ['index.html','style.css']:
 shutil.copy2(root/name,dist/name)
shutil.copytree(root/'src',dist/'src',dirs_exist_ok=True)
shutil.rmtree(dist/'assets',ignore_errors=True)
shutil.copytree(root/'assets/work02',dist/'assets/work02')
if (root/'assets/work03').exists():shutil.copytree(root/'assets/work03',dist/'assets/work03')
print('Built offline review HTML and dist/')

if (root/'assets/work04').exists():shutil.copytree(root/'assets/work04',dist/'assets/work04')
