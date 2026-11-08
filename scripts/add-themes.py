#!/usr/bin/env python3
"""Adds the 1.1.0 themes to HubSkins by re-colouring the Graphite block.
Run once from the repo root: python3 scripts/add-themes.py
Edits shared/themes.js, shared/derived.js and styles/hubskins.css."""
import re, json

def hx(h): h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))
def tohex(c): return '#%02x%02x%02x' % tuple(max(0,min(255,round(v))) for v in c)
def mix(a,b,t): return tuple(a[i]+(b[i]-a[i])*t for i in range(3))
def lum(c): return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]
def rl(c):
    f=lambda v:(v/255/12.92) if v/255<=0.03928 else ((v/255+0.055)/1.055)**2.4
    return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2])
def contrast(a,b):
    x,y=sorted([rl(a),rl(b)],reverse=True); return (x+0.05)/(y+0.05)

OLD=dict(bg='#141415',inset='#0d0d0e',surface='#1b1b1d',raised='#232326',border='#333337',text='#ececee',muted='#a6a6ad',
  accent='#ff9a4d',accentStrong='#f08a3a',success='#6fd38f',danger='#ff7a70',attention='#f0c050',done='#b8a0f0',severe='#ff9a4d',sponsors='#f090c0')
OLD_SYN={'#ff9a4d':'keyword','#9fd49a':'string','#8ab8f0':'constant','#f0c050':'entity','#f0a8a0':'tag','#d0a8e8':'variable','#94949b':'comment'}
OLD_GRAPH=['#202023','#4a3220','#8a5428','#f08a3a','#ffd0a8']

T=[
 dict(id='grid-orchid',name='Grid Orchid',tag='Orchid on graph paper',
  font=dict(family='Space Grotesk',file='space-grotesk-latin-700-normal.woff2',weight=700,spacing='0'),
  c=dict(bg='#130c1f',inset='#0c0714',surface='#1b1230',raised='#251a40',border='#3d2b66',text='#f3eaff',muted='#b9a5d9',accent='#d68cff',accentStrong='#b44dff',success='#6ff0b0',danger='#ff6f8e',attention='#ffd36b',done='#9d9bff',severe='#ff9b6b',sponsors='#ff7fd0'),
  syntax=dict(keyword='#d68cff',string='#7ef0c8',constant='#8fb0ff',entity='#ffd36b',tag='#ff8fc0',variable='#ffb48a',comment='#8a78ad'),
  graph=['#1c1330','#41206e','#7a2fc2','#b44dff','#f0c9ff'],
  scene='linear-gradient(rgba(214,140,255,0.07) 1px, transparent 1px) 0 0 / 40px 40px, linear-gradient(90deg, rgba(214,140,255,0.07) 1px, transparent 1px) 0 0 / 40px 40px, radial-gradient(900px 480px at 90% -10%, rgba(180,77,255,0.22), transparent 70%)'),
 dict(id='midnight-grid',name='Midnight Grid',tag='Navy blueprint grid',
  font=None,
  c=dict(bg='#08111f',inset='#050b15',surface='#0e1b30',raised='#14243f',border='#23406a',text='#e6f0ff',muted='#9db6d6',accent='#5eb0ff',accentStrong='#2f8cf0',success='#4fe0a0',danger='#ff7b8a',attention='#ffcf6a',done='#b19dff',severe='#ff9e6a',sponsors='#ff8fc8'),
  syntax=dict(keyword='#8fa8ff',string='#5fe3b8',constant='#5eb0ff',entity='#ffcf6a',tag='#7fd8ff',variable='#ffa885',comment='#6f8aaa'),
  graph=['#0f1d33','#154a8a','#2272c8','#2f8cf0','#b4dcff'],
  scene='linear-gradient(rgba(94,176,255,0.05) 1px, transparent 1px) 0 0 / 24px 24px, linear-gradient(90deg, rgba(94,176,255,0.05) 1px, transparent 1px) 0 0 / 24px 24px, linear-gradient(rgba(94,176,255,0.09) 1px, transparent 1px) 0 0 / 120px 120px, linear-gradient(90deg, rgba(94,176,255,0.09) 1px, transparent 1px) 0 0 / 120px 120px, radial-gradient(1000px 500px at 50% -25%, rgba(47,140,240,0.18), transparent 70%)'),
 dict(id='fastlap',name='Fastlap',tag='Carbon + pit-lane yellow',
  font=dict(family='Barlow Condensed',file='barlow-condensed-latin-700-normal.woff2',weight=700,spacing='0.04em',scale=1.12),
  c=dict(bg='#0e0f12',inset='#08090b',surface='#16181d',raised='#1e2128',border='#343842',text='#f4f5f7',muted='#a9aeba',accent='#ffe14a',accentStrong='#ffd60a',success='#3dd68c',danger='#ff4d4d',attention='#ffb020',done='#9aa8ff',severe='#ff7a3d',sponsors='#ff7ac0'),
  syntax=dict(keyword='#ff5a5a',string='#ffe14a',constant='#6cc4ff',entity='#ffb020',tag='#3dd68c',variable='#ff9a5a',comment='#7b808c'),
  graph=['#1a1c22','#4a3f0a','#8f7a0a','#ffd60a','#fff3a6'],
  scene='repeating-linear-gradient(90deg, #d8201f 0 48px, #f2f2f2 48px 96px) 0 100% / 100% 6px no-repeat, repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 6px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 6px), radial-gradient(700px 360px at 100% 0%, rgba(255,214,10,0.10), transparent 70%)'),
 dict(id='shrine',name='Moonlit Shrine',tag='Moon and torii at night',
  font=dict(family='Cinzel',file='cinzel-latin-700-normal.woff2',weight=700,spacing='0.04em',scale=0.95),
  c=dict(bg='#0b0e24',inset='#070918',surface='#121634',raised='#1a1f45',border='#2f356b',text='#eef0ff',muted='#aab0dc',accent='#ff7a66',accentStrong='#e5483a',success='#7be0b0',danger='#ff7a8a',attention='#ffd98a',done='#c3a8ff',severe='#ff9e6a',sponsors='#ff9ad0'),
  syntax=dict(keyword='#ff8f7a',string='#9fe8d0',constant='#9db8ff',entity='#ffd98a',tag='#ffa0b8',variable='#ffb48f',comment='#7f86b8'),
  graph=['#161a3a','#3a2f6e','#8a3a7a','#e5483a','#ffd0b8'],
  scene=('radial-gradient(circle 70px at 84% 14%, rgba(255,246,222,0.92) 0 96%, transparent 100%), '
         'radial-gradient(circle 260px at 84% 14%, rgba(255,240,205,0.16), transparent 100%), '
         'radial-gradient(1.5px 1.5px at 12% 10%, rgba(255,255,255,0.85), transparent 60%), radial-gradient(1.5px 1.5px at 28% 22%, rgba(255,255,255,0.65), transparent 60%), '
         'radial-gradient(1px 1px at 46% 8%, rgba(255,255,255,0.8), transparent 60%), radial-gradient(1.5px 1.5px at 63% 18%, rgba(255,255,255,0.7), transparent 60%), '
         'radial-gradient(1px 1px at 72% 6%, rgba(255,255,255,0.75), transparent 60%), radial-gradient(1px 1px at 94% 30%, rgba(255,255,255,0.6), transparent 60%), '
         'linear-gradient(rgba(229,72,58,0.5), rgba(229,72,58,0.5)) 5% 100% / 9px 150px no-repeat, linear-gradient(rgba(229,72,58,0.5), rgba(229,72,58,0.5)) 11% 100% / 9px 150px no-repeat, '
         'linear-gradient(rgba(229,72,58,0.5), rgba(229,72,58,0.5)) 3.2% calc(100% - 134px) / 11.2% 12px no-repeat, linear-gradient(rgba(229,72,58,0.5), rgba(229,72,58,0.5)) 4.4% calc(100% - 104px) / 8.4% 7px no-repeat, '
         'linear-gradient(0deg, rgba(60,50,120,0.45), transparent 220px)')),
 dict(id='dusk-train',name='Dusk Train',tag='Golden-hour skyline',
  font=dict(family='Josefin Sans',file='josefin-sans-latin-700-normal.woff2',weight=700,spacing='0.02em',scale=1.05),
  c=dict(bg='#121a24',inset='#0b1119',surface='#1a2431',raised='#223041',border='#384b61',text='#f5efe6',muted='#b7c3cf',accent='#ffb15c',accentStrong='#f58f2e',success='#7fdcae',danger='#ff8080',attention='#ffd37a',done='#b9a6ff',severe='#ff9a66',sponsors='#ff9bd0'),
  syntax=dict(keyword='#ffb15c',string='#8fe3c0',constant='#8fc4ff',entity='#ffd37a',tag='#ff9a9a',variable='#d8b0ff',comment='#7f93a8'),
  graph=['#1d2836','#5a3a1a','#9a5a1c','#f58f2e','#ffe0b8'],
  scene=('linear-gradient(0deg, rgba(255,150,70,0.30) 0, rgba(240,110,110,0.14) 160px, transparent 360px), '
         'linear-gradient(#0a0f16, #0a0f16) 4% 100% / 5% 78px no-repeat, linear-gradient(#0a0f16, #0a0f16) 10% 100% / 4% 120px no-repeat, linear-gradient(#0a0f16, #0a0f16) 15% 100% / 6% 64px no-repeat, '
         'linear-gradient(#0a0f16, #0a0f16) 23% 100% / 5% 104px no-repeat, linear-gradient(#0a0f16, #0a0f16) 30% 100% / 7% 70px no-repeat, linear-gradient(#0a0f16, #0a0f16) 40% 100% / 4% 132px no-repeat, '
         'linear-gradient(#0a0f16, #0a0f16) 47% 100% / 6% 86px no-repeat, linear-gradient(#0a0f16, #0a0f16) 58% 100% / 5% 112px no-repeat, linear-gradient(#0a0f16, #0a0f16) 66% 100% / 7% 60px no-repeat, '
         'linear-gradient(#0a0f16, #0a0f16) 76% 100% / 4% 126px no-repeat, linear-gradient(#0a0f16, #0a0f16) 84% 100% / 6% 90px no-repeat, linear-gradient(#0a0f16, #0a0f16) 93% 100% / 5% 108px no-repeat, '
         'linear-gradient(rgba(255,177,92,0.35), rgba(255,177,92,0.35)) 0 100% / 100% 3px no-repeat')),
]

def build_map(t):
    anchors_old=[OLD[k] for k in ('inset','bg','surface','raised','border','muted','text')]
    anchors_new=[t['c'][k] for k in ('inset','bg','surface','raised','border','muted','text')]
    exact={OLD[k]:t['c'][k] for k in ('bg','inset','surface','raised','border','text','muted','accent','accentStrong','success','danger','attention','done','sponsors')}
    return anchors_old,anchors_new,exact

def neutral_map(rgb,ao,an):
    L=lum(rgb); pts=sorted(zip([lum(hx(a)) for a in ao],[hx(a) for a in an]))
    if L<=pts[0][0]: return pts[0][1]
    if L>=pts[-1][0]: return pts[-1][1]
    for (l0,c0),(l1,c1) in zip(pts,pts[1:]):
        if l0<=L<=l1: return mix(c0,c1,(L-l0)/(l1-l0) if l1>l0 else 0)

def recolor(line,t,m,unmatched):
    ao,an,exact=m
    name=line.split(':')[0]
    is_syn='syntax' in name or 'Syntax' in name
    is_graph=('contribution' in name) or ('calendar' in name)
    def sub(mt):
        full=mt.group(0).lower(); base=full[:7]; alpha=full[7:]
        if is_syn and base in OLD_SYN: new=t['syntax'][OLD_SYN[base]]
        elif is_graph and base in OLD_GRAPH: new=t['graph'][OLD_GRAPH.index(base)]
        elif 'severe' in name and base==OLD['severe']: new=t['c']['severe']
        elif base in exact: new=exact[base]
        else:
            rgb=hx(base); mx,mn=max(rgb),min(rgb)
            if (mx-mn)<28:
                new=tohex(neutral_map(rgb,ao,an))
            else:
                bg=hx(OLD['bg']);ac=hx(OLD['accentStrong']);best=None
                for A,B,NA,NB in ((bg,ac,hx(t['c']['bg']),hx(t['c']['accentStrong'])),(ac,(255,255,255),hx(t['c']['accentStrong']),(255,255,255))):
                    d=[B[i]-A[i] for i in range(3)];den=sum(x*x for x in d) or 1
                    tt=max(0,min(1,sum((rgb[i]-A[i])*d[i] for i in range(3))/den))
                    err=sum((rgb[i]-(A[i]+d[i]*tt))**2 for i in range(3))
                    if best is None or err<best[0]: best=(err,mix(NA,NB,tt))
                new=tohex(best[1]); unmatched.add((base,name.strip()))
        return new+alpha
    return re.sub(r'#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?\b',sub,line)

css=open('styles/hubskins.css').read().split('\n')
s=css.index('/* ===== Graphite ===== */')
e=next(i for i in range(s+1,len(css)) if css[i].startswith('/* Scene or picture'))
gblock=css[s:e]
out=[]; derived={}; unm=set()
for t in T:
    m=build_map(t); b=[]
    for l in gblock:
        l=recolor(l,t,m,unm)
        l=l.replace('data-ts-theme="graphite"','data-ts-theme="%s"'%t['id'])
        b.append(l)
    b[0]='/* ===== %s ===== */'%t['name']
    bg=hx(t['c']['bg']);sf=hx(t['c']['surface'])
    for i,l in enumerate(b):
        if l.strip().startswith('--ts-bg-rgb:'): b[i]='  --ts-bg-rgb: %d %d %d;'%bg
        if l.strip().startswith('--ts-surface-rgb:'): b[i]='  --ts-surface-rgb: %d %d %d;'%sf
        if l.strip().startswith('--ts-min-dim:'): b[i]='  --ts-min-dim: 0.8;'
    # scene line
    j=next(i for i,l in enumerate(b) if 'data-ts-scene="on"' in l and l.endswith('{'))
    assert b[j+1].lstrip().startswith('background:')
    b[j+1]='  background: %s, %s !important;'%(t['scene'],t['c']['bg'])
    while b and b[-1]=='': b.pop()
    if t['font']:
        f=t['font']
        b+=['','html[data-ts-theme="%s"][data-ts-mode][data-ts-fonts="on"] :is(main h1, main h2, .markdown-body h3, .vcard-fullname, .AppHeader-context-item-label, strong[itemprop="name"] > a, .Box-title, .gh-header-title, [class*="PageHeader-Title"]) {'%t['id'],
            '  font-family: "HubSkins %s", var(--fontStack-sansSerif, system-ui), sans-serif !important;'%f['family'],
            '  font-weight: %d !important;'%f['weight'],'  letter-spacing: %s !important;'%f['spacing'],'  font-size-adjust: ex-height 0.53;','}']
    b.append('')
    out+=b
    fill=hx(t['c']['accentStrong']);dark=hx(t['c']['bg'])
    onE=t['c']['bg'] if contrast(fill,dark)>=4.5 else '#ffffff'
    derived[t['id']]=dict(text=t['c']['text'],muted=t['c']['muted'],accent=t['c']['accent'],fill=t['c']['accentStrong'],onEmph=onE,minDim=0.8,popupAccent=t['c']['accentStrong'],popupAccentInk='#0e0f14')
css[e:e]=out
open('styles/hubskins.css','w').write('\n'.join(css))
print('unmatched fallbacks:',sorted(unm)[:20])

# themes.js
js=open('shared/themes.js').read()
def jsq(s): return "'"+s+"'"
ents=[]
for t in T:
    f=t['font']
    fs='null' if not f else "{ family: %s, file: %s, weight: %d, spacing: %s%s }"%(jsq(f['family']),jsq(f['file']),f['weight'],jsq(f['spacing']),(', scale: %s'%f['scale']) if 'scale' in f else '')
    c=t['c'];sy=t['syntax']
    ents.append("""    {
      id: %s, name: %s, tag: %s, mode: 'dark',
      font: %s,
      c: { bg: %s, inset: %s, surface: %s, raised: %s, border: %s,
        text: %s, muted: %s, accent: %s, accentStrong: %s,
        success: %s, danger: %s, attention: %s, done: %s, severe: %s, sponsors: %s },
      syntax: { keyword: %s, string: %s, constant: %s, entity: %s, tag: %s, variable: %s, comment: %s },
      graph: [%s],
      scene: %s
    }"""%(jsq(t['id']),jsq(t['name']),jsq(t['tag']),fs,*[jsq(c[k]) for k in ('bg','inset','surface','raised','border','text','muted','accent','accentStrong','success','danger','attention','done','severe','sponsors')],
      *[jsq(sy[k]) for k in ('keyword','string','constant','entity','tag','variable','comment')],', '.join(jsq(g) for g in t['graph']),jsq(t['scene'])))
marker="      scene: 'radial-gradient(900px 400px at 100% -20%, rgba(240,138,58,0.08), transparent 70%)'\n    }\n  ];"
assert marker in js
js=js.replace(marker,marker[:-5].rstrip()+",\n"+",\n".join(ents)+"\n  ];")
open('shared/themes.js','w').write(js)

# derived.js
d=open('shared/derived.js').read()
tail='    }\n  };\n})'
assert tail in d
add=''.join(',\n    %s: %s'%(json.dumps(k),json.dumps(v,indent=6).replace('\n      }','\n    }').replace('\n}','\n    }')) for k,v in derived.items())
d=d.replace(tail,'    }'+add+'\n  };\n})',1)
open('shared/derived.js','w').write(d)
print('done')
