"""OSM (Overpass JSON) -> data.json en metros locales para la escena de soleamiento.

Origen en Plaza Moyúa aprox. x = este, y = norte. Edificios con patios (inner rings).
"""
import json, math, hashlib

LAT0, LON0 = 43.2657, -2.9360
KX = math.cos(math.radians(LAT0)) * 111320
KY = 110540
RIVER_HALF_WIDTH = 48  # la ría en Abandoibarra mide ~90-100 m

HEIGHT_OVERRIDE = {  # alturas reales aproximadas donde OSM no las tiene
    118499485: 38,   # Guggenheim (la cubierta llega a ~50 m en puntos)
}


def xy(p):
    return [round((p['lon'] - LON0) * KX, 1), round((p['lat'] - LAT0) * KY, 1)]


def join_rings(ways):
    """Une tramos abiertos de un multipolígono en anillos cerrados."""
    rings, open_ = [], [w[:] for w in ways if len(w) > 1]
    while open_:
        cur = open_.pop(0)
        changed = True
        while cur[0] != cur[-1] and changed:
            changed = False
            for i, w in enumerate(open_):
                if w[0] == cur[-1]:
                    cur += w[1:]
                elif w[-1] == cur[-1]:
                    cur += w[::-1][1:]
                elif w[-1] == cur[0]:
                    cur = w + cur[1:]
                elif w[0] == cur[0]:
                    cur = w[::-1] + cur[1:]
                else:
                    continue
                open_.pop(i)
                changed = True
                break
        if cur[0] == cur[-1] and len(cur) >= 4:
            rings.append(cur)
    return rings


def height(el):
    t = el.get('tags', {})
    if el['id'] in HEIGHT_OVERRIDE:
        return HEIGHT_OVERRIDE[el['id']]
    try:
        return float(t['height'].replace('m', '').strip())
    except (KeyError, ValueError):
        pass
    try:
        return float(t['building:levels']) * 3.3 + 1.5
    except (KeyError, ValueError):
        pass
    kind = t.get('building', 'yes')
    if kind in ('roof', 'garage', 'garages', 'kiosk', 'shed', 'hut', 'service', 'transformer_tower'):
        return 4.5
    if kind in ('church', 'cathedral'):
        return 24
    # Ensanche: 6-8 plantas. Variación determinista por id para que no sea un bloque plano.
    r = int(hashlib.md5(str(el['id']).encode()).hexdigest()[:4], 16) / 0xFFFF
    return round(17 + r * 9, 1)


def polys_of(el):
    """Devuelve [(outer, [holes])] en coordenadas lon/lat originales."""
    if el['type'] == 'way':
        g = [(p['lon'], p['lat']) for p in el.get('geometry', [])]
        return [(g, [])] if len(g) >= 4 and g[0] == g[-1] else []
    outers = join_rings([[(p['lon'], p['lat']) for p in m['geometry']]
                         for m in el.get('members', []) if m.get('role') == 'outer' and m.get('geometry')])
    inners = join_rings([[(p['lon'], p['lat']) for p in m['geometry']]
                         for m in el.get('members', []) if m.get('role') == 'inner' and m.get('geometry')])
    res = [(o, []) for o in outers]
    for h in inners:  # asigna cada patio al anillo exterior que contiene su primer punto
        for o, holes in res:
            if inside(h[0], o):
                holes.append(h)
                break
    return res


def inside(pt, ring):
    x, y = pt
    c = False
    for (x1, y1), (x2, y2) in zip(ring, ring[1:]):
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            c = not c
    return c


def to_m(ring):
    return [xy({'lon': a, 'lat': b}) for a, b in ring[:-1]]


def river_polygon(line):
    """Ensancha la línea central de la ría a un polígono."""
    pts = [xy(p) for p in line if p]
    left, right = [], []
    for i, (x, y) in enumerate(pts):
        a = pts[max(i - 1, 0)]
        b = pts[min(i + 1, len(pts) - 1)]
        dx, dy = b[0] - a[0], b[1] - a[1]
        n = math.hypot(dx, dy) or 1
        nx, ny = -dy / n * RIVER_HALF_WIDTH, dx / n * RIVER_HALF_WIDTH
        left.append([round(x + nx, 1), round(y + ny, 1)])
        right.append([round(x - nx, 1), round(y - ny, 1)])
    return left + right[::-1]


def main():
    els = json.load(open('osm.json'))['elements']
    out = {'buildings': [], 'parks': [], 'water': [], 'labels': []}
    named = {'Bilboko Guggenheim museoa': 'Guggenheim', 'Torre Iberdrola dorrea': 'Torre Iberdrola',
             'Euskalduna jauregia': 'Euskalduna', 'Azkuna Zentroa': 'Azkuna Zentroa'}
    for el in els:
        t = el.get('tags', {})
        if 'building' in t:
            if t.get('building') in ('construction',) or t.get('location') == 'underground':
                continue
            h = height(el)
            for o, holes in polys_of(el):
                out['buildings'].append({'h': h, 'o': to_m(o), 'i': [to_m(x) for x in holes]})
            if t.get('name') in named and el['type'] == 'way':
                g = el['geometry']
                c = xy({'lon': sum(p['lon'] for p in g) / len(g), 'lat': sum(p['lat'] for p in g) / len(g)})
                out['labels'].append({'t': named[t['name']], 'x': c[0], 'y': c[1], 'h': h})
        elif t.get('leisure') == 'park':
            for o, holes in polys_of(el):
                out['parks'].append({'o': to_m(o), 'i': [to_m(x) for x in holes]})
        elif t.get('natural') == 'water':
            for o, holes in polys_of(el):
                out['water'].append({'o': to_m(o), 'i': [to_m(x) for x in holes]})
    for el in json.load(open('river.json'))['elements']:
        out['water'].append({'o': river_polygon(el['geometry']), 'i': []})
    json.dump(out, open('data.json', 'w'), separators=(',', ':'))
    print(len(out['buildings']), 'volúmenes,', sum(len(b['i']) for b in out['buildings']), 'patios,',
          len(out['parks']), 'parques,', len(out['water']), 'agua,', out['labels'])


if __name__ == '__main__':
    main()
