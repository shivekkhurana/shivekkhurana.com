interface Company {
  name: string;
  logo: string;
  url: string;
}

interface TrustedByProps {
  companies: Company[];
}

export default function TrustedBy({ companies }: TrustedByProps) {
  return (
    <div className="mb-16">
      <h2 className="text-xl font-bold mb-8">Trusted by</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center md:justify-items-center">
        {companies.map((company) => (
          <a
            key={company.name}
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            title={company.name}
          >
            <img
              src={company.logo}
              alt={company.name}
              className="h-8 w-auto object-contain"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
