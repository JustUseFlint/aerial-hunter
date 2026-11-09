import asyncio, sys, json, urllib.parse
from playwright.async_api import async_playwright
BASE=sys.argv[1]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        out={}
        for (w,h,s,mob) in [(393,852,3,True),(1440,900,1,False)]:
            c=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=s,is_mobile=mob,has_touch=mob)
            seen=set(); queue=[BASE]; errs=[]; bad=[]; anim=[]
            while queue:
                u=queue.pop(0)
                if u in seen: continue
                seen.add(u)
                pg=await c.new_page()
                pg.on('console',lambda m,u=u: errs.append(f'{u}:{m.type}:{m.text}') if m.type in('error','warning') else None)
                pg.on('pageerror',lambda e,u=u: errs.append(f'{u}:pageerror:{e}'))
                r=await pg.goto(u,wait_until='networkidle')
                if not r or r.status!=200: bad.append((u, r.status if r else None))
                await pg.wait_for_timeout(1500)
                info=await pg.evaluate('''()=>({motion:document.documentElement.classList.contains('motion'),st:window.ScrollTrigger?ScrollTrigger.getAll().length:0,split:document.querySelectorAll('.is-split').length,ox:document.documentElement.scrollWidth>innerWidth,links:[...document.querySelectorAll('a[href]')].map(a=>a.href)})''')
                anim.append((u.replace(BASE,'/'),info['motion'],info['st'],info['split'],info['ox']))
                for l in info['links']:
                    l=l.split('#')[0]
                    if l.startswith(BASE) and l not in seen and '?' not in l: queue.append(l)
                    elif l.startswith(BASE) and '?' in l and l not in seen:
                        seen.add(l); rr=await pg.request.get(l); 
                        if rr.status!=200: bad.append((l,rr.status))
                await pg.close()
            out[w]={'pages':len([a for a in anim]),'bad':bad,'errs':errs,'no_motion':[a for a in anim if not a[1]],'overflow':[a[0] for a in anim if a[4]],'sample':anim[:4]}
            await c.close()
        print(json.dumps(out,indent=1))
        await b.close()
asyncio.run(main())
