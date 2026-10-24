import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, MapPin, Search, Users } from 'lucide-react'
import { publicExhibitors, publicExpos, publicSessions } from '../../../data/publicData'
import { PublicLayout } from '../components/PublicComponents'
export default function ExhibitorsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = [
    "All",
    ...new Set(mockExhibitors.map((item) => item.category)),
  ];
  const filtered = mockExhibitors.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      `${item.name} ${item.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <PublicLayout
      eyebrow="THE PEOPLE BEHIND THE BRANDS"
      title="Meet the makers."
      copy="Explore the companies bringing new ideas, thoughtful products, and useful change to the floor."
    >
      <section className="public-section wrap">
        <div className="page-toolbar">
          <div className="public-search">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search exhibitors"
            />
          </div>
          <div className="category-tabs">
            {categories.map((item) => (
              <button
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="exhibitor-grid">
          {filtered.map((exhibitor) => (
            <article className="exhibitor-card" key={exhibitor.id}>
              <div className="exhibitor-logo">{exhibitor.name.slice(0, 2)}</div>
              <span className="eyebrow">{exhibitor.category}</span>
              <h2>{exhibitor.name}</h2>
              <p>{exhibitor.description}</p>
              <div>
                <span>
                  <MapPin size={14} /> Booth {exhibitor.booth}
                </span>
                <ArrowUpRight size={15} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
