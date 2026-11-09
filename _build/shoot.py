import asyncio, sys, json
from playwright.async_api import async_playwright
# usage: shoot.py BASE OUTPREFIX WIDTH HEIGHT SCALE MOBILE path1 path2 ...  (each path -> several scroll screenshots)
BASE, OUT, W, Hh, S, MOB = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), float(sys.argv[5]), sys.argv[6]=='1'
PATHS = sys.argv[7:]
STEPS = int(__import__('os').environ.get('STEPS','8'))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        c = await b.new_context(viewport={'width':W,'height':Hh}, device_scale_factor=S, is_mobile=MOB, has_touch=MOB)
        errs = []
        for path in PATHS:
            pg = await c.new_page()
            pg.on('console', lambda m, path=path: errs.append(f'{path}:{m.type}:{m.text}') if m.type in ('error','warning') else None)
            pg.on('pageerror', lambda e, path=path: errs.append(f'{path}:pageerror:{e}'))
            pg.on('requestfailed', lambda r, path=path: errs.append(f'{path}:reqfail:{r.url}'))
            r = await pg.goto(BASE+path, wait_until='networkidle')
            await pg.wait_for_timeout(2200)
            name = path.strip('/').replace('/','_') or 'home'
            total = await pg.evaluate('document.documentElement.scrollHeight')
            for i in range(STEPS):
                y = int((total - Hh) * i / max(1, STEPS-1))
                # scroll gradually so scrubbed animations progress naturally
                await pg.evaluate('''async (y)=>{const L=window.ahLenis; const from=scrollY; const n=12; for(let k=1;k<=n;k++){const t=from+(y-from)*k/n; if(L) L.scrollTo(t,{immediate:true}); else scrollTo(0,t); await new Promise(r=>setTimeout(r,40));}}''', y)
                await pg.wait_for_timeout(1300)
                await pg.screenshot(path=f'{OUT}{name}-{W}-{i:02d}.png')
            ow = await pg.evaluate('[document.documentElement.scrollWidth, innerWidth]')
            if ow[0] > ow[1]: errs.append(f'{path}:OVERFLOW-X {ow}')
            await pg.close()
        print(json.dumps(errs, indent=1))
        await b.close()
asyncio.run(main())
