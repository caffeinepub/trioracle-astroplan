import React, { useState } from 'react';
import { Star, Video, FileText, Sparkles, Hand } from 'lucide-react';
import SpecialServiceBookingForm, {
  VIDEO_PREDICTION_SERVICE_ID,
  WRITTEN_PREDICTION_SERVICE_ID,
} from './SpecialServiceBookingForm';

type ServiceType = 'Video Prediction' | 'Written Prediction';

interface SpecialService {
  id: number;
  type: ServiceType;
  icon: React.ReactNode;
  title: string;
  shortDesc: string;
  fee: number;
  accentColor: string;
  badgeColor: string;
}

const specialServices: SpecialService[] = [
  {
    id: VIDEO_PREDICTION_SERVICE_ID,
    type: 'Video Prediction',
    icon: <Video size={26} />,
    title: 'Video Prediction',
    shortDesc:
      'Receive a personalised video reading where our expert analyses your palm lines and numerology to reveal your nature, life path, and future guidance — delivered directly to you.',
    fee: 2500,
    accentColor: 'border-violet-200 bg-violet-50/60',
    badgeColor: 'bg-violet-100 text-violet-700',
  },
  {
    id: WRITTEN_PREDICTION_SERVICE_ID,
    type: 'Written Prediction',
    icon: <FileText size={26} />,
    title: 'Written Prediction',
    shortDesc:
      'Get a comprehensive written report covering your personality traits, financial outlook, relationship patterns, family dynamics, and future guidance — all in rich, actionable detail.',
    fee: 2500,
    accentColor: 'border-amber-200 bg-amber-50/60',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
];

export default function SpecialUniqueServiceSection() {
  const [activeModal, setActiveModal] = useState<{ type: ServiceType; id: number } | null>(null);

  return (
    <div
      id="special-services"
      className="py-20 px-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, oklch(0.97 0.012 85) 0%, oklch(0.93 0.018 280) 100%)',
      }}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <img
          src="/assets/generated/section-divider.dim_1200x80.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="celestial-divider w-12" />
            <Sparkles size={14} className="text-gold" fill="currentColor" />
            <div className="celestial-divider w-12" />
          </div>
          <h2 className="section-heading">Special Unique Service</h2>

          {/* Combined intro description */}
          <div className="max-w-3xl mx-auto mt-6 space-y-3">
            <p className="text-charcoal/75 leading-relaxed text-base">
              Through the ancient sciences of <span className="font-semibold text-gold-dark">Palmistry</span> and{' '}
              <span className="font-semibold text-gold-dark">Numerology</span>, we reveal the deepest truths of your
              nature — your strengths, hidden patterns, and the unique blueprint of your soul.
            </p>
            <p className="text-charcoal/70 leading-relaxed text-base">
              Beyond understanding who you are, we predict and advise on the future challenges and opportunities across
              every dimension of your life:{' '}
              <span className="font-medium text-charcoal/85">Finances &amp; Wealth</span>,{' '}
              <span className="font-medium text-charcoal/85">Relationships &amp; Love</span>, and{' '}
              <span className="font-medium text-charcoal/85">Family &amp; Home</span> — everything in rich, actionable
              detail so you can navigate your path with clarity and confidence.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Hand size={15} className="text-gold/70" />
              <p className="text-sm text-charcoal/55 italic">
                Share your palm photos, birth details, and your deepest questions — we'll do the rest.
              </p>
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {specialServices.map((service) => (
            <div
              key={service.id}
              className={`card-hover rounded-2xl border-2 ${service.accentColor} p-7 flex flex-col shadow-spiritual`}
            >
              {/* Icon + Fee */}
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-white/80 border border-gold/20 flex items-center justify-center text-gold-dark shadow-sm">
                  {service.icon}
                </div>
                <div className="text-right">
                  <div className="font-serif text-3xl font-bold text-gold-dark">
                    ₹{service.fee.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-charcoal/50 mt-0.5">per session</div>
                </div>
              </div>

              {/* Badge */}
              <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${service.badgeColor}`}>
                {service.type}
              </span>

              {/* Title */}
              <h3 className="font-serif text-2xl font-semibold text-charcoal mb-3">{service.title}</h3>

              {/* Description */}
              <p className="text-sm text-charcoal/65 leading-relaxed flex-1 mb-6">{service.shortDesc}</p>

              {/* What's included */}
              <ul className="space-y-1.5 mb-6">
                {[
                  'Nature & personality analysis',
                  'Financial & career outlook',
                  'Relationship & family guidance',
                  'Future problem advisory',
                  'Palmistry + Numerology combined',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-charcoal/65">
                    <Star size={10} className="text-gold shrink-0" fill="currentColor" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => setActiveModal({ type: service.type, id: service.id })}
                className="btn-sage text-sm w-full py-3 font-medium"
              >
                Book / Inquire
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {activeModal && (
        <SpecialServiceBookingForm
          open={!!activeModal}
          onClose={() => setActiveModal(null)}
          serviceType={activeModal.type}
          serviceId={activeModal.id}
        />
      )}
    </div>
  );
}
