const random = bound => Math.floor(Math.random() * bound)
const randomElement = a => a[random(a.length)]

const swap = (a, i, j) => {
    const temp = a[i]
    a[i] = a[j]
    a[j] = temp
}

const flatMap = f => a => [].concat(...a.map(f))
const range = n => {
    const r = []
    for(let i = 0; i < n; i++)
    r.push(i)
    return r
}
const hexRange = m => range(m).map(i => i.toString(16))
const prepend = p => e => [].concat(...p, e)
const append = p => e => [].concat(e, ...p)
const prefixes = a => {
    const pref = []
    for(let l = 0; l < a.length; l++) {
        pref.push(a.slice(0, l))
    }
    return pref
}

const shuffle = a => {
    const b = a.slice()
    for(let i = 0; i < b.length; i++) {
        const j = random(b.length - i) + i
        swap(b, i, j)
    }
    return b
}

const addresses = (m, n) => {
    if (n === 1)
    return [[]]
    else 
    return flatMap(p => hexRange(m).map(append(p)))(addresses(m, n - 1)) 
}

const table = (mapping, m) => address => {
    const fit = prefix => Object.keys(mapping).filter(key => key.startsWith(prefix)).map(key => mapping[key])
    const best_fit = prefix => randomElement(fit(prefix))
    return prefixes(address).map(p => range(m).map(a => prepend(p)(a).join('')).map(best_fit))
}

const peer = m => address => {
    const id = address.join('')
    const table = prefixes(address).map(p => range(m).map(a => prepend(p)(a).join('')))
    return { id, table }
}

const peers = (m, n) => addresses(m, n).map(peer(m))


const network = (m, n) => names => {
    const addrs = addresses(m, n)
    const ids = addrs.map(a => a.join(''))
    const mapping = shuffle(names)
    .map((n, i) => ([n, ids[i]])) 
    .reduce((map, [n, id]) => ({[id]:n, ...map}), {})
    const tables = addrs.map(table(mapping, m))
    return { mapping, ids, tables }
}

const names = ['Sebastian', 'Emil', 'Christian', 'Morten', 'Armin', 'Mette', 'Nicolae', 'Kenneth', 'Oscar']
