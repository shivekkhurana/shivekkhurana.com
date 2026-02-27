import Img from '@src/components/Img';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  pfp: string;
  companyLogo?: string;
  linkedIn?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div>
      <p className="text-base opacity-80 mb-4 italic">{testimonial.quote}</p>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Img
            path={testimonial.pfp}
            alt={testimonial.name}
            defaultWidth={80}
            className="w-10 h-10 rounded-full object-cover"
          />
          {testimonial.companyLogo && (
            <img
              src={testimonial.companyLogo}
              alt={testimonial.company}
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded object-contain bg-white border border-current/10"
            />
          )}
        </div>
        <div>
          <p className="text-sm font-bold">
            {testimonial.linkedIn ? (
              <a
                href={testimonial.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {testimonial.name}
              </a>
            ) : (
              testimonial.name
            )}
          </p>
          <p className="text-xs opacity-70">
            {testimonial.title}
            {testimonial.company && ` @ ${testimonial.company}`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const featured = testimonials[0];
  const others = testimonials.slice(1);

  return (
    <div className="mb-16">
      <h2 className="text-xl font-bold mb-8">What people say</h2>
      {/* Featured testimonial (full width) */}
      <div className="mb-6">
        <TestimonialCard testimonial={featured} />
      </div>
      {/* Other testimonials (3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {others.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
}
