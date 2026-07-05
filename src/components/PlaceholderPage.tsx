import BottomNav from './BottomNav'
import './PlaceholderPage.css'

type PlaceholderPageProps = {
  title: string
}

function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="placeholder-page">
      <main className="placeholder-page__main">
        <p className="placeholder-page__eyebrow">Coming soon</p>
        <h1 className="placeholder-page__title">{title}</h1>
      </main>
      <BottomNav />
    </div>
  )
}

export default PlaceholderPage
