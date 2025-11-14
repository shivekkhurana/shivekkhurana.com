import MediaCard from './MediaCard';

const shots = [
  {
    src: '/img/hero/warsaw.jpeg',
    alt: 'Shivek in Warsaw',
    color: 'rgba(0, 0, 0, 1)', // beige/brown
    backgroundColor: 'rgba(210, 180, 140, 0.8)',
    title: 'Warsaw',
    type: 'image' as const,
  },
  {
    src: '/img/hero/porto.jpeg',
    alt: 'Walking in Porto garden',
    color: 'rgba(255, 255, 255, 1)',
    backgroundColor: 'rgba(70, 70, 90, 0.8)',
    title: 'Porto',
    type: 'image' as const,
  },
  {
    src: '/img/hero/dubai.jpeg',
    alt: 'Dubai',
    color: 'rgba(0, 0, 0, 1)', // warm orange/gold
    backgroundColor: 'rgba(54, 58, 72, 0.8)',
    title: 'Dubai',
    type: 'image' as const,
  },
  {
    src: '/video/clothing.mp4',
    alt: 'Warsaw',
    color: 'rgba(255, 255, 255, 1)', // red
    backgroundColor: 'rgba(0, 1, 20, 0.8)',
    title: 'Talk',
    type: 'video' as const,
  },
];

function Hero() {
  return (
    <div className="mt-48 mb-24 font-mlm-roman">
      {/* Heading */}
      <h1 className="font-bold text-2xl md:text-3xl mb-6">Shivek Khurana</h1>

      {/* Intro text */}
      <div className="mb-8 space-y-2 text-lg">
        <p>
          I make things. Mostly software, but sometimes clothes, courses,
          videos, or essays.
        </p>
        <p className="opacity-70">
          Recently shut down my company after 4 years, and building a new
          product.
        </p>
      </div>

      {/* Media cards grid */}
      <div className="flex flex-wrap gap-4 md:gap-6 justify-start items-start">
        {shots.map((shot, index) => (
          <MediaCard
            key={index}
            src={shot.src}
            alt={shot.alt}
            color={shot.color}
            backgroundColor={shot.backgroundColor}
            title={shot.title}
            type={shot.type}
          />
        ))}
      </div>
    </div>
  );
}

export default Hero;
