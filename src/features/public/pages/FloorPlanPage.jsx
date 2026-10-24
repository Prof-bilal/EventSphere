import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, MapPin, Search, Users } from 'lucide-react'
import { publicExhibitors, publicExpos, publicSessions } from '../../../data/publicData'
import { PublicLayout } from '../components/PublicComponents'
export default function FloorPlanPage() {
  return (
    <PublicLayout
      eyebrow="FIND YOUR WAY AROUND"
      title="There’s room for every idea."
      copy="Explore the Future Makers Expo floor plan and find the people you came to meet."
    >
      <section className="public-section wrap public-floor">
        <div className="floor-public-map">
          {Array.from({ length: 20 }, (_, index) => (
            <span
              className={
                index === 3 || index === 9 || index === 16 ? "occupied" : ""
              }
              key={index}
            >
              B{String(index + 1).padStart(2, "0")}
            </span>
          ))}
        </div>
        <div className="floor-public-caption">
          <span className="legend available" /> Available{" "}
          <span className="legend occupied" /> Exhibitor booth{" "}
          <span className="floor-note">
            Select a booth to see who is there.
          </span>
        </div>
      </section>
    </PublicLayout>
  );
}
