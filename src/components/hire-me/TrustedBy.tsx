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
      <p className="text-center text-gray-500 mb-8">
        Companies I've collaborated with
      </p>
      <div className="flex flex-wrap gap-6 items-center mx-0 lg:-mx-48 justify-center">
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
