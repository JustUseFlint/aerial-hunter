import asyncio, sys
from playwright.async_api import async_playwright
BASE, OUT = sys.argv[1], sys.argv[2]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs=[]
        for W,H,S,M,name in [(1440,900,1,False,'d'),(393,852,3,True,'m')]:
            c = await b.new_context(viewport={'width':W,'height':H}, device_scale_factor=S, is_mobile=M, has_touch=M)
            pg = await c.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto(BASE+'service-area/', wait_until='networkidle'); await pg.wait_for_timeout(1500)
            y = await pg.evaluate("(()=>{const m=document.querySelector('.map');const r=m.getBoundingClientRect();return r.top+scrollY-90})()")
            await pg.evaluate('''async (y)=>{const L=window.ahLenis;const f=scrollY;for(let k=1;k<=12;k++){const t=f+(y-f)*k/12;if(L)L.scrollTo(t,{immediate:true});else scrollTo(0,t);await new Promise(r=>setTimeout(r,50))}}''', y)
            await pg.wait_for_timeout(2500)
            el = await pg.query_selector('.map:not(.map-s) [data-county="vermillion"], .map:not(.map-s) .cty >> nth=1')
            if el: await el.click(); await pg.wait_for_timeout(1200)
            await pg.screenshot(path=f'{OUT}map-{name}.png'); await c.close()
        print(errs); await b.close()
asyncio.run(main())
