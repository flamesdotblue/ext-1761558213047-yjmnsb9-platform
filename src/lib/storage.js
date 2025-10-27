import { v4 as uuidv4 } from 'uuid'

// LocalStorage based mock backend to make the app immediately functional
// Collections: users, products

const LS_KEYS = {
  users: 'bx_users',
  products: 'bx_products',
  session: 'bx_session',
}

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function ensureUniqueSlug(base) {
  const users = read(LS_KEYS.users)
  let slug = base
  let i = 1
  while (users.some((u) => u.storeSlug === slug)) {
    slug = `${base}-${i++}`
  }
  return slug
}

export function getCurrentUser() {
  const s = localStorage.getItem(LS_KEYS.session)
  if (!s) return null
  const { userId } = JSON.parse(s)
  const users = read(LS_KEYS.users)
  return users.find((u) => u.id === userId) || null
}

export function onAuthChange(callback) {
  const handler = () => callback(getCurrentUser())
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}

export async function createUser({
  email,
  password,
  name,
  businessName,
  businessDescription = '',
  phoneNumber = '',
  whatsappNumber = '',
}) {
  const users = read(LS_KEYS.users)
  if (users.some((u) => u.email === email)) {
    throw new Error('Cet email est déjà utilisé.')
  }
  const baseSlug = slugify(businessName || name || 'ma-boutique')
  const user = {
    id: uuidv4(),
    name: name || '',
    email,
    password, // only for local mock
    phoneNumber,
    businessName: businessName || name || 'Ma Boutique',
    businessDescription,
    storeSlug: ensureUniqueSlug(baseSlug || `boutique-${Math.floor(Math.random() * 1000)}`),
    whatsappNumber,
    plan: 'free',
    createdAt: Date.now(),
    active: true,
    stats: { viewsCount: 0, lastVisitDate: null, ordersCount: 0 },
  }
  users.push(user)
  write(LS_KEYS.users, users)
  localStorage.setItem(LS_KEYS.session, JSON.stringify({ userId: user.id }))
  return user
}

export async function loginUser(email, password) {
  const users = read(LS_KEYS.users)
  const user = users.find((u) => u.email === email && u.password === password)
  if (!user) throw new Error('Identifiants invalides.')
  if (!user.active) throw new Error('Ce compte est désactivé.')
  localStorage.setItem(LS_KEYS.session, JSON.stringify({ userId: user.id }))
  return user
}

export async function logoutUser() {
  localStorage.removeItem(LS_KEYS.session)
}

export async function updateUser(patch) {
  const users = read(LS_KEYS.users)
  const current = getCurrentUser()
  if (!current) throw new Error('Non connecté')
  const idx = users.findIndex((u) => u.id === current.id)
  const next = { ...users[idx], ...patch }
  if (patch.businessName && patch.businessName !== users[idx].businessName) {
    const base = slugify(patch.businessName)
    next.storeSlug = ensureUniqueSlug(base)
  }
  users[idx] = next
  write(LS_KEYS.users, users)
  // refresh session broadcast
  localStorage.setItem(LS_KEYS.session, JSON.stringify({ userId: next.id }))
  return next
}

export function listUsers() {
  return read(LS_KEYS.users)
}

export function setUserActive(userId, active) {
  const users = read(LS_KEYS.users)
  const idx = users.findIndex((u) => u.id === userId)
  if (idx >= 0) {
    users[idx].active = active
    write(LS_KEYS.users, users)
  }
}

// Products
export function addProduct({ ownerId, name, description = '', price = 0, imageURL = '', category = 'Général' }) {
  const product = {
    id: uuidv4(),
    ownerId,
    name,
    description,
    price: Number(price) || 0,
    imageURL,
    category,
    createdAt: Date.now(),
  }
  const products = read(LS_KEYS.products)
  products.unshift(product)
  write(LS_KEYS.products, products)
  return product
}

export function updateProduct(productId, patch) {
  const products = read(LS_KEYS.products)
  const idx = products.findIndex((p) => p.id === productId)
  if (idx < 0) return null
  products[idx] = { ...products[idx], ...patch }
  write(LS_KEYS.products, products)
  return products[idx]
}

export function deleteProduct(productId) {
  const products = read(LS_KEYS.products)
  const next = products.filter((p) => p.id !== productId)
  write(LS_KEYS.products, next)
}

export function getProductsByOwner(ownerId) {
  const products = read(LS_KEYS.products)
  return products.filter((p) => p.ownerId === ownerId)
}

export function getUserBySlug(slug) {
  const users = read(LS_KEYS.users)
  return users.find((u) => u.storeSlug === slug) || null
}

export function recordStoreView(userId) {
  const users = read(LS_KEYS.users)
  const idx = users.findIndex((u) => u.id === userId)
  if (idx >= 0) {
    users[idx].stats = users[idx].stats || { viewsCount: 0 }
    users[idx].stats.viewsCount = (users[idx].stats.viewsCount || 0) + 1
    users[idx].stats.lastVisitDate = Date.now()
    write(LS_KEYS.users, users)
  }
}

// Seed demo data if empty
(function seed() {
  const users = read(LS_KEYS.users)
  const products = read(LS_KEYS.products)
  if (users.length === 0) {
    const demo = [
      {
        name: 'Aïcha',
        email: 'aicha@demo.com',
        password: 'demo123',
        businessName: 'Chez Aïcha',
        businessDescription: 'Perruques et soins capillaires',
        whatsappNumber: '+221771234567',
      },
      {
        name: 'Bella',
        email: 'bella@demo.com',
        password: 'demo123',
        businessName: 'Couture Bella',
        businessDescription: 'Vêtements sur mesure',
        whatsappNumber: '+2250501122233',
      },
      {
        name: 'TechPhone',
        email: 'tech@demo.com',
        password: 'demo123',
        businessName: 'TechPhone',
        businessDescription: 'Accessoires et réparation de téléphones',
        whatsappNumber: '+237690112233',
      },
      {
        name: 'Snack Délice',
        email: 'snack@demo.com',
        password: 'demo123',
        businessName: 'Snack Délice',
        businessDescription: 'Plats locaux et jus naturels',
        whatsappNumber: '+22370112233',
      },
    ]
    const created = demo.map((d) => ({
      ...d,
      id: uuidv4(),
      phoneNumber: '',
      storeSlug: ensureUniqueSlug(slugify(d.businessName)),
      plan: 'free',
      createdAt: Date.now(),
      active: true,
      stats: { viewsCount: 0, lastVisitDate: null, ordersCount: 0 },
    }))
    write(LS_KEYS.users, created)

    const demoProducts = []
    created.forEach((u) => {
      for (let i = 1; i <= 4; i++) {
        demoProducts.push({
          id: uuidv4(),
          ownerId: u.id,
          name: `${u.businessName} Produit ${i}`,
          description: 'Produit de démonstration de haute qualité.',
          price: 1000 * i,
          imageURL: `https://picsum.photos/seed/${encodeURIComponent(u.businessName + i)}/600/400`,
          category: i % 2 === 0 ? 'Services' : 'Produits',
          createdAt: Date.now(),
        })
      }
    })
    write(LS_KEYS.products, demoProducts)
  }
})()

export function sanitizePhone(number) {
  return String(number || '')
    .replace(/\s+/g, '')
    .replace(/^\+/, '')
}
