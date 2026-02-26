import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CourseModule {
  title: string;
  topics: string[];
}

interface Course {
  id: number;
  name: string;
  fee: number;
  tagline: string;
  icon: string;
  color: string;
  modules: CourseModule[];
}

const courses: Course[] = [
  {
    id: 1,
    name: 'Predictive Nadi Astrology',
    fee: 10000,
    tagline: 'Master the ancient science of Nadi Astrology for precise life predictions',
    icon: '☿',
    color: 'from-amber-50 to-yellow-50',
    modules: [
      {
        title: 'Rules of Nadi Astrology',
        topics: ['Ayanamsa', 'Nirayana Bhava Chalit', 'Casting Nirayana Bhav Chalit', 'Dasa & Sub lord', 'Aspects & Conjunctions', 'Position & Lordship of Planets', 'How to Judge a Planet', 'Strength of Planet', 'Cusps', 'Results of Planets', 'Timing of an Event', 'Transits of Planets', 'Negation of an event'],
      },
      {
        title: 'Education',
        topics: ['Houses & Planets', 'Combination', 'No Education / No inclination', 'Foreign Education', 'Scholarships', 'Success in Competition Exams & Interviews', 'Field of Education', 'Prizes or Awards', 'Illustrations'],
      },
      {
        title: 'Litigation',
        topics: ['Houses & Planets', 'Combinations & Timing', 'Imprisonment & Causes', 'Political confinement', 'Going underground', 'House arrest', 'Kidnapping', 'Winning in litigation', 'Illustrations'],
      },
      {
        title: 'Property & Vehicle',
        topics: ['Purchase of property — Houses, Planets, Combination & Timing', 'Transits & Purchase through Loan', 'Location & Status of property', 'Commercial & Construction of property', 'Rental income, Loss, Partition, Sale', 'Purchase of vehicles — Houses, Facilitator, Timing', 'Colour, Luxury, Commercial vehicle', 'Theft, Non-repayment, Sale of Vehicle'],
      },
      {
        title: 'Marriage',
        topics: ['Timing of marriage', 'Plutonic love, Physical love, Scandalous love', 'Love marriage & Extra marital affair', 'Kundali Milan', 'Divorce & Live-in relationships', 'Manglik & Gun Milan'],
      },
      {
        title: 'Childbirth',
        topics: ['Timing of conceiving', 'Pregnancy periods', 'Twin Birth', 'Adoption', 'Custody of children', 'Gender of child'],
      },
      {
        title: 'Health',
        topics: ['Timing of disease', 'Good health and bad health combinations', 'Chronic disease and surgery', 'Improvement in health', 'Type of disease'],
      },
      {
        title: 'Longevity & Travel',
        topics: ['Timing of Longevity', 'Death at time of marriage and pilgrimage', 'Getting visa — US, Europe, Canada, Australia, NZ', 'Getting PR, Work Visa and Citizenship', 'Long Travel & Return to motherland', 'Purpose of Travel'],
      },
      {
        title: 'Professional Career',
        topics: ['Getting a job', 'Change in job & Transfer', 'Change to business and vice versa', 'Type of job or business', 'Job in foreign', 'Ups and downs in job/business', 'Getting a government job'],
      },
      {
        title: 'Prasna Jyotish, Remedies & Muhurat',
        topics: ['Answers to specific questions', 'Same-day event answers', 'Mundane questions', 'Vastu, Name correction, Mantra, Tantra, Yantra', 'Graphology, Meditation, Yoga, Fasting', 'Daan, Pooja, Hawan, Pilgrimage', 'Muhurat of marriage & Grah Pravesh', 'Birth time correction'],
      },
    ],
  },
  {
    id: 2,
    name: 'Advanced Numerology',
    fee: 17500,
    tagline: 'Decode the hidden language of numbers for deep predictive insights',
    icon: '∞',
    color: 'from-purple-50 to-lavender',
    modules: [
      {
        title: 'Foundations',
        topics: ['Study of Numerology for predictive purpose', 'Nature of a person — Anxiety, depression, sentimental', 'Drug addict, drunkard, Frustrated, Overconfident', 'Miser, Spendthrift, mismanaging funds, brand cautious'],
      },
      {
        title: 'Character Analysis',
        topics: ['Combination of a cheat and variety in it', 'Combination of a Conman', 'How to differentiate sex scandal and financial scandal', 'Differentiating debts, bankruptcy, litigation combinations'],
      },
      {
        title: 'Hindu Dasa System',
        topics: ['Vimshottari Dasa', 'Mahadasa & Antar Dasa', 'Pratyantar Dasa', 'Calculation of Dasa', 'Examples & Exercises'],
      },
      {
        title: 'Name Correction & Combinations',
        topics: ['Name Correction techniques', 'Combinations of Billionaires', 'High-end Actors, Actresses, Stage performers', 'Combinations of Leaders & Dictators', 'Person who respects and serves parents after marriage'],
      },
      {
        title: 'Specialized Predictions',
        topics: ['Combinations of Builders & property buyers', 'People who win in speculations, share market, casinos', 'People good in management', 'Successful and unsuccessful travels', 'Timing to get Visas, PR, Green Card, foreign settlement'],
      },
      {
        title: 'Advanced Techniques',
        topics: ['True lover and Cheat in love', 'Merging Numerology with Nadi Astrology', 'Higher predictive techniques'],
      },
    ],
  },
  {
    id: 3,
    name: 'Mystery of Palmistry',
    fee: 15000,
    tagline: 'Read the map of destiny written on your hands',
    icon: '✋',
    color: 'from-green-50 to-emerald-50',
    modules: [
      {
        title: 'Foundations & Hand Shapes',
        topics: ['Palmistry predictive course', 'Panchtattva and its application to Human evolution', 'Shape of hands — Earth, Water, Fire and Air', 'Fingers — Jupiter, Saturn, Sun, Mercury, Thumb (Space)'],
      },
      {
        title: 'Mounts & Fingerprints',
        topics: ['Mounts — Venus, Lower Mars, Upper Mars, Neptune, Moon, Sun, Saturn, Jupiter, Mercury', 'Finger Prints — Earth, Water, Fire and Air', 'Mix, Composite fingerprints'],
      },
      {
        title: 'Lines of the Hand',
        topics: ['Major Lines — Earth, Water, Fire and Air', 'Girdle of Venus, Via Lasciva, Moon Line', 'Ambition Line, Sun line, Passion Line', 'Mercury Line, Mars line, Axe lines', 'Vertical & Horizontal Lines on Venus and Mars', 'Emotional Suffocation Lines', 'Relationship & Children lines', 'Medical Stigmata'],
      },
      {
        title: 'Signs & Patterns',
        topics: ['Predictive Techniques to calculate timing of event', 'Nails — Shape, Colour, Signs, Thickness', 'Signs — Star, Cross, Squares, Tridents, Triangle, Bars', 'Black spots, Solomon Ring, Grill, Temple', 'Skin Patterns — Raja loop, Seriousness Loops, Bee'],
      },
      {
        title: 'Career, Compatibility & Medical',
        topics: ['Career & Academics — Self Discovery and Career Counselling', 'Compatibility — For Marriage & Friendship', 'Medical Palmistry — Depression, BP, IBS, Diabetes', 'Eye-Sight, Allergy, ENT, Lipid Profile, Metabolism', 'Problems to Conceive, Lungs & Respiratory'],
      },
      {
        title: 'Life Events',
        topics: ['Travel and immigration', 'Litigations and other problems', 'Marriage, Compatibility, Divorce', 'Children possibilities, Sexual Behaviour, Infertility', 'Career — Business, Services, Jobs', 'Financial analysis'],
      },
    ],
  },
  {
    id: 4,
    name: 'Nadi Cards',
    fee: 5000,
    tagline: 'Unlock the secrets of Nadi cards for accurate life readings',
    icon: '🃏',
    color: 'from-rose-50 to-pink-50',
    modules: [
      {
        title: 'Introduction to Nadi Cards',
        topics: ['Introduction to Nadi Cards (Red, Blue, Yellow)', 'General interpretation of cards'],
      },
      {
        title: 'Life Events via Cards',
        topics: ['Timing of Marriage', 'Type of in-laws — Greedy, wealthy, heredity disease', 'Types of love affairs & Divorce', 'Child birth', 'Property purchase — Landed property, Construction'],
      },
      {
        title: 'Health, Career & More',
        topics: ['Education', 'Health — Type of disease, Timing of disease and good health', 'Timing of death', 'Profession — Up and down, Getting a job, Promotion, Type of job and business'],
      },
      {
        title: 'Litigation, Travel & Miscellaneous',
        topics: ['Litigation — Win in litigation, Jail, Bail', 'Travel — Getting Visa, PR, Citizenship, Timing of travel', 'Miscellaneous — Win and loss in matches', 'Speculation, Lost and found'],
      },
    ],
  },
];

function CourseCard({ course }: { course: Course }) {
  const [expanded, setExpanded] = useState(false);
  const [openModule, setOpenModule] = useState<number | null>(null);

  return (
    <div className={`card-hover rounded-xl overflow-hidden border border-gold/20 shadow-spiritual bg-gradient-to-br ${course.color}`}>
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-2xl">
              {course.icon}
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-charcoal leading-tight">{course.name}</h3>
              <p className="text-sm text-charcoal/60 mt-0.5 font-light">{course.tagline}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-serif text-2xl font-semibold text-gold-dark">
              ₹{course.fee.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-charcoal/50 mt-0.5">Course Fee</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Badge variant="secondary" className="text-xs bg-gold/10 text-gold-dark border-gold/20">
            <BookOpen size={10} className="mr-1" />
            {course.modules.length} Modules
          </Badge>
          <Badge variant="secondary" className="text-xs bg-sage/10 text-sage-dark border-sage/20">
            <Star size={10} className="mr-1" fill="currentColor" />
            Expert Level
          </Badge>
        </div>
      </div>

      {/* Expand/Collapse Syllabus */}
      <div className="px-6 pb-6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-medium text-sage-dark hover:text-sage transition-colors group"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {expanded ? 'Hide Syllabus' : 'View Full Syllabus'}
        </button>

        {expanded && (
          <div className="mt-4 space-y-2 animate-fade-in">
            {course.modules.map((mod, idx) => (
              <div key={idx} className="border border-gold/15 rounded-lg overflow-hidden bg-white/60">
                <button
                  onClick={() => setOpenModule(openModule === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gold/5 transition-colors"
                >
                  <span className="font-medium text-sm text-charcoal">{mod.title}</span>
                  {openModule === idx ? (
                    <ChevronUp size={14} className="text-gold shrink-0" />
                  ) : (
                    <ChevronDown size={14} className="text-gold shrink-0" />
                  )}
                </button>
                {openModule === idx && (
                  <div className="px-4 pb-3 border-t border-gold/10">
                    <ul className="mt-2 space-y-1">
                      {mod.topics.map((topic, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2 text-sm text-charcoal/70">
                          <span className="text-gold mt-1 shrink-0">•</span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CoursesSection() {
  return (
    <div className="py-20 px-4 bg-cream-bg">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="celestial-divider w-12" />
            <Star size={14} className="text-gold" fill="currentColor" />
            <div className="celestial-divider w-12" />
          </div>
          <h2 className="section-heading">Our Courses</h2>
          <p className="section-subheading max-w-2xl mx-auto">
            Comprehensive programs in ancient predictive sciences, taught by expert practitioners
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
