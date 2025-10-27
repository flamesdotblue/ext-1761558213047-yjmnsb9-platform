import { Link } from 'react-router-dom'
import { CheckCircle, Smartphone, ShoppingBag, MessageSquare } from 'lucide-react'

export default function HomeHero() {
  return (
    <main>
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Votre boutique en ligne, en 5 minutes
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Boutik Express aide les petits commerçants africains à créer une vitrine en ligne et recevoir des commandes via WhatsApp.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/register" className="px-5 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700">Créer ma boutique</Link>
              <Link to="/login" className="px-5 py-3 rounded-full border border-gray-300 hover:bg-gray-50">Se connecter</Link>
            </div>
            <ul className="mt-8 space-y-3">
              <li className="flex items-center gap-2 text-gray-700"><CheckCircle className="text-green-600" size={18}/> Gratuit pour démarrer</li>
              <li className="flex items-center gap-2 text-gray-700"><CheckCircle className="text-green-600" size={18}/> Lien public de votre boutique</li>
              <li className="flex items-center gap-2 text-gray-700"><CheckCircle className="text-green-600" size={18}/> Commandes via WhatsApp</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FeatureCard icon={<ShoppingBag />} title="Ajoutez vos produits" desc="Nom, prix, photo, description"/>
            <FeatureCard icon={<MessageSquare />} title="Ventes WhatsApp" desc="Discussion préremplie en 1 clic"/>
            <FeatureCard icon={<Smartphone />} title="Mobile-first" desc="Belle vitrine sur téléphone"/>
            <FeatureCard icon={<CheckCircle />} title="Simple" desc="Pas de complications techniques"/>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold">Comment ça marche</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <Step num="1" title="Créez votre compte"/>
          <Step num="2" title="Ajoutez vos produits"/>
          <Step num="3" title="Partagez votre lien"/>
        </div>
        <div className="mt-10">
          <Link to="/register" className="px-5 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700">Commencer maintenant</Link>
        </div>
      </section>

      <section className="bg-gray-50 border-t">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h3 className="text-xl font-semibold">Témoignages</h3>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <Testi name="Chez Aïcha" text="J'ai mis mes perruques en ligne en quelques minutes. Les commandes WhatsApp arrivent !"/>
            <Testi name="Couture Bella" text="Mes clientes consultent mes modèles et me contactent directement."/>
            <Testi name="Snack Délice" text="Je partage le lien sur WhatsApp, les clients voient le menu du jour."/>
          </div>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border">
      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">{icon}</div>
      <h4 className="mt-3 font-semibold">{title}</h4>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  )
}

function Step({ num, title }) {
  return (
    <div className="p-5 bg-white rounded-xl shadow-sm border">
      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">{num}</div>
      <h4 className="mt-3 font-semibold">{title}</h4>
      <p className="text-sm text-gray-600">C'est facile et rapide.</p>
    </div>
  )
}

function Testi({ name, text }) {
  return (
    <div className="p-5 bg-white rounded-xl shadow-sm border">
      <p className="text-gray-700">“{text}”</p>
      <div className="mt-3 text-sm text-gray-500">— {name}</div>
    </div>
  )
}
