import React, { useState } from 'react';
import { Loader2, Image as ImageIcon, X, Eye, MapPin, Images, Hash } from 'lucide-react';
import { useGetAllInquiries } from '../hooks/useQueries';
import type { Inquiry } from '../backend';
import type { ExternalBlob } from '../backend';

const serviceNames: Record<number, string> = {
  1: 'One Question',
  2: 'Matchmaking',
  3: 'Muhurat',
  4: 'Professional Advice',
  5: 'Phone Consultation',
  6: 'Gemstone Consult',
  7: 'Video Prediction',
  8: 'Written Prediction',
};

const SPECIAL_SERVICE_IDS = new Set([7, 8]);

function HandPicturePreview({ inquiry }: { inquiry: Inquiry }) {
  const [showFull, setShowFull] = useState(false);

  if (!inquiry.handPictureBlob) {
    return <span className="text-xs text-charcoal/30 italic">No image</span>;
  }

  const url = inquiry.handPictureBlob.getDirectURL();

  return (
    <>
      <button
        onClick={() => setShowFull(true)}
        className="flex items-center gap-1 text-xs text-gold-dark hover:text-gold transition-colors"
      >
        <ImageIcon size={12} />
        View Image
      </button>

      {showFull && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setShowFull(false)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowFull(false)}
              className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-lg text-charcoal hover:text-destructive"
            >
              <X size={16} />
            </button>
            <img
              src={url}
              alt="Hand picture"
              className="w-full rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}

function PalmPhotosPreview({ photos }: { photos: Array<ExternalBlob | null> }) {
  const [fullViewIndex, setFullViewIndex] = useState<number | null>(null);

  const validPhotos = photos.filter((p): p is ExternalBlob => p !== null);

  if (validPhotos.length === 0) {
    return <span className="text-xs text-charcoal/30 italic">No photos</span>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        {validPhotos.map((photo, idx) => (
          <button
            key={idx}
            onClick={() => setFullViewIndex(idx)}
            className="relative group"
            title={`Palm photo ${idx + 1}`}
          >
            <img
              src={photo.getDirectURL()}
              alt={`Palm ${idx + 1}`}
              className="w-10 h-10 object-cover rounded-md border border-gold/20 hover:border-gold/60 transition-colors"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 rounded-md transition-colors">
              <Eye size={10} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </button>
        ))}
      </div>

      {fullViewIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setFullViewIndex(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setFullViewIndex(null)}
              className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-lg text-charcoal hover:text-destructive z-10"
            >
              <X size={16} />
            </button>
            {/* Navigation */}
            {validPhotos.length > 1 && (
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); setFullViewIndex((i) => i !== null && i > 0 ? i - 1 : validPhotos.length - 1); }}
                  className="bg-white/80 hover:bg-white rounded-full p-1.5 shadow text-charcoal"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setFullViewIndex((i) => i !== null ? (i + 1) % validPhotos.length : 0); }}
                  className="bg-white/80 hover:bg-white rounded-full p-1.5 shadow text-charcoal"
                >
                  ›
                </button>
              </div>
            )}
            <img
              src={validPhotos[fullViewIndex].getDirectURL()}
              alt={`Palm photo ${fullViewIndex + 1}`}
              className="w-full rounded-xl shadow-2xl"
            />
            <p className="text-center text-white/70 text-xs mt-2">
              Photo {fullViewIndex + 1} of {validPhotos.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function PlaceOfBirthDisplay({ inquiry }: { inquiry: Inquiry }) {
  const parts = [inquiry.birthCity, inquiry.birthState, inquiry.birthCountry].filter(Boolean);
  if (parts.length === 0) return <span className="text-xs text-charcoal/30 italic">—</span>;
  return (
    <span className="text-xs text-charcoal/70">{parts.join(', ')}</span>
  );
}

function SeedNumberBadge({ seedNumber }: { seedNumber: bigint }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full font-medium">
      <Hash size={10} />
      Seed: {seedNumber.toString()}
    </span>
  );
}

function SpecialServiceDetails({ inquiry }: { inquiry: Inquiry }) {
  return (
    <div className="mt-2 space-y-1.5 border-t border-gold/10 pt-2">
      {(inquiry.birthCity || inquiry.birthState || inquiry.birthCountry) && (
        <div className="flex items-start gap-1">
          <MapPin size={11} className="text-gold/60 shrink-0 mt-0.5" />
          <PlaceOfBirthDisplay inquiry={inquiry} />
        </div>
      )}
      {inquiry.question && (
        <div>
          <span className="text-xs font-semibold text-charcoal/60">Special Question: </span>
          <span className="text-xs text-charcoal/70">{inquiry.question}</span>
        </div>
      )}
      {inquiry.pastLifeNotes && (
        <div>
          <span className="text-xs font-semibold text-charcoal/60">Past Life Events: </span>
          <span className="text-xs text-charcoal/70">{inquiry.pastLifeNotes}</span>
        </div>
      )}
      {inquiry.palmPhotos && inquiry.palmPhotos.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Images size={11} className="text-gold/60" />
            <span className="text-xs font-semibold text-charcoal/60">Palm Photos:</span>
          </div>
          <PalmPhotosPreview photos={inquiry.palmPhotos} />
        </div>
      )}
    </div>
  );
}

export default function InquiriesTab() {
  const { data: inquiries, isLoading, error } = useGetAllInquiries();

  const formatDate = (time: bigint) => {
    const ms = Number(time / BigInt(1_000_000));
    return new Date(ms).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={32} className="animate-spin text-gold/60" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-destructive/60">
        <p>Failed to load inquiries. You may not have admin access.</p>
      </div>
    );
  }

  if (!inquiries || inquiries.length === 0) {
    return (
      <div className="text-center py-16">
        <Eye size={48} className="text-gold/30 mx-auto mb-4" />
        <p className="font-serif text-xl text-charcoal/40">No inquiries yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-charcoal/50">{inquiries.length} total inquiries</p>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-gold/20 shadow-spiritual">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gold/10 border-b border-gold/20">
              <th className="px-4 py-3 text-left font-semibold text-charcoal/70 text-xs uppercase tracking-wide">#</th>
              <th className="px-4 py-3 text-left font-semibold text-charcoal/70 text-xs uppercase tracking-wide">Service</th>
              <th className="px-4 py-3 text-left font-semibold text-charcoal/70 text-xs uppercase tracking-wide">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-charcoal/70 text-xs uppercase tracking-wide">DOB / TOB</th>
              <th className="px-4 py-3 text-left font-semibold text-charcoal/70 text-xs uppercase tracking-wide">Place of Birth</th>
              <th className="px-4 py-3 text-left font-semibold text-charcoal/70 text-xs uppercase tracking-wide">Question / Notes</th>
              <th className="px-4 py-3 text-left font-semibold text-charcoal/70 text-xs uppercase tracking-wide">Images</th>
              <th className="px-4 py-3 text-left font-semibold text-charcoal/70 text-xs uppercase tracking-wide">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry, idx) => {
              const isSpecial = SPECIAL_SERVICE_IDS.has(Number(inquiry.serviceType));
              const hasSeedNumber = inquiry.seedNumber != null;
              return (
                <tr
                  key={inquiry.id.toString()}
                  className={`border-t border-gold/10 hover:bg-gold/5 ${idx % 2 === 0 ? 'bg-white/60' : 'bg-cream-bg/60'}`}
                >
                  <td className="px-4 py-3 text-charcoal/50">{inquiry.id.toString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${isSpecial ? 'bg-violet-100 text-violet-700' : 'bg-gold/10 text-gold-dark'}`}>
                        {serviceNames[Number(inquiry.serviceType)] || `Service ${inquiry.serviceType}`}
                      </span>
                      {hasSeedNumber && (
                        <SeedNumberBadge seedNumber={inquiry.seedNumber!} />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-charcoal">{inquiry.visitorName}</td>
                  <td className="px-4 py-3 text-charcoal/60">
                    <div>{inquiry.dob}</div>
                    {inquiry.tob && <div className="text-xs text-charcoal/40">{inquiry.tob}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <PlaceOfBirthDisplay inquiry={inquiry} />
                  </td>
                  <td className="px-4 py-3 text-charcoal/70 max-w-xs">
                    {inquiry.question && (
                      <p className="truncate text-xs" title={inquiry.question}>
                        <span className="font-medium text-charcoal/50">Q: </span>{inquiry.question}
                      </p>
                    )}
                    {inquiry.pastLifeNotes && (
                      <p className="truncate text-xs mt-0.5" title={inquiry.pastLifeNotes}>
                        <span className="font-medium text-charcoal/50">Notes: </span>{inquiry.pastLifeNotes}
                      </p>
                    )}
                    {!inquiry.question && !inquiry.pastLifeNotes && <span className="text-charcoal/30 italic text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {isSpecial && inquiry.palmPhotos && inquiry.palmPhotos.length > 0 ? (
                      <PalmPhotosPreview photos={inquiry.palmPhotos} />
                    ) : (
                      <HandPicturePreview inquiry={inquiry} />
                    )}
                  </td>
                  <td className="px-4 py-3 text-charcoal/50 text-xs whitespace-nowrap">{formatDate(inquiry.submittedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {inquiries.map((inquiry) => {
          const isSpecial = SPECIAL_SERVICE_IDS.has(Number(inquiry.serviceType));
          const hasSeedNumber = inquiry.seedNumber != null;
          return (
            <div key={inquiry.id.toString()} className={`rounded-xl border bg-white/60 p-4 space-y-2 ${isSpecial ? 'border-violet-200' : 'border-gold/20'}`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-charcoal">{inquiry.visitorName}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isSpecial ? 'bg-violet-100 text-violet-700' : 'bg-gold/10 text-gold-dark'}`}>
                  {serviceNames[Number(inquiry.serviceType)] || `Service ${inquiry.serviceType}`}
                </span>
              </div>

              {/* Seed Number badge for One Question */}
              {hasSeedNumber && (
                <div>
                  <SeedNumberBadge seedNumber={inquiry.seedNumber!} />
                </div>
              )}

              <div className="text-xs text-charcoal/50">
                DOB: {inquiry.dob}
                {inquiry.tob && <span className="ml-2">Time: {inquiry.tob}</span>}
              </div>

              {isSpecial ? (
                <SpecialServiceDetails inquiry={inquiry} />
              ) : (
                <>
                  {(inquiry.birthCity || inquiry.birthState || inquiry.birthCountry) && (
                    <div className="flex items-center gap-1">
                      <MapPin size={11} className="text-gold/60 shrink-0" />
                      <PlaceOfBirthDisplay inquiry={inquiry} />
                    </div>
                  )}
                  {inquiry.question && (
                    <div>
                      <span className="text-xs font-medium text-charcoal/60">Question: </span>
                      <span className="text-xs text-charcoal/70">{inquiry.question}</span>
                    </div>
                  )}
                  {inquiry.pastLifeNotes && (
                    <div>
                      <span className="text-xs font-medium text-charcoal/60">Notes: </span>
                      <span className="text-xs text-charcoal/70">{inquiry.pastLifeNotes}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <HandPicturePreview inquiry={inquiry} />
                    <span className="text-xs text-charcoal/40">{formatDate(inquiry.submittedAt)}</span>
                  </div>
                </>
              )}

              {isSpecial && (
                <div className="text-xs text-charcoal/40 pt-1">{formatDate(inquiry.submittedAt)}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
