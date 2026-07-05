import { Link } from 'react-router-dom'
import { ROUTE_PATHS } from '../../routes/routePaths'

function GuidanceCta() {
  return (
    <section className="relative overflow-hidden rounded-2xl">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80")',
        }}
      />
      <div className="absolute inset-0 bg-kwami-green/80" />

      <div className="relative px-5 py-6">
        <h2 className="mb-2 text-xl font-bold text-white">Need Guidance?</h2>
        <p className="mb-5 max-w-[16rem] text-sm leading-relaxed text-white/90">
          Our AI assistant can help you find the right documents in seconds.
        </p>
        <Link
          to={ROUTE_PATHS.chat}
          className="inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-kwami-green transition-colors hover:bg-gray-50"
        >
          Start Chat
        </Link>
      </div>
    </section>
  )
}

export default GuidanceCta
