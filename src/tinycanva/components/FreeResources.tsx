import { freeResources } from '@src/tinycanva/data';

function FreeResource({
  resource,
}: {
  resource: { title: string; subTitle: string; url: string };
}) {
  return (
    <a
      href={resource.url}
      className=""
    >
      <h3 className="underline text-sm md:text-base mb-0 mt-2">
        {resource.title}
      </h3>
      <p className="opacity-80 text-sm my-1">{resource.subTitle}</p>
    </a>
  );
}

export function FreeResources() {
  return (
    <section
      id="more-resources"
      className="mt-12 pb-12"
    >
      <h2 className="text-xl md:text-2xl lg:text-3xl font-serif">
        Can't commit to a course?
      </h2>
      <p className="mt-4">
        We understand that everyone might not have the time or motivation to go
        through an extensive course. Here is our recommendation on other free
        resources to jump-start your Clojure journey:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-4">
        {freeResources.map((r) => (
          <FreeResource
            key={r.url}
            resource={r}
          />
        ))}
      </div>
    </section>
  );
}
