import clsx from 'clsx';

interface Service {
  title: string;
  description: string;
}

interface ServicesProps {
  services: Service[];
}

export default function Services({ services }: ServicesProps) {
  return (
    <div className="mb-16">
      <h2 className="text-xl font-bold mb-8">What I help with</h2>
      <div className="text-sm grid grid-cols-1 md:grid-cols-2">
        {services.map((service, i) => {
          const isLeftCol = i % 2 === 0;
          const isLastRow = Math.floor(i / 2) === Math.ceil(services.length / 2) - 1;
          const isLastItem = i === services.length - 1;
          return (
            <div
              key={service.title}
              className={clsx(
                'py-2 border-current/10',
                isLeftCol ? 'md:pr-4 md:border-r' : 'md:pl-4',
                !isLastItem && 'border-b',
                isLastRow && 'md:border-b-0'
              )}
            >
              <div className="font-bold">{service.title}</div>
              <div className="opacity-70">{service.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
