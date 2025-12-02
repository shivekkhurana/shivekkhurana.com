import { features } from '@src/tinycanva/data';
import type { Feature } from '@src/tinycanva/data/types';

function FeatureItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="mb-3">
      <div>{title}</div>
      <div className="hidden md:block mt-2 opacity-50">{body}</div>
    </div>
  );
}

function PricingPlanHeader({
  price,
  title,
  subTitle,
}: {
  price: string;
  title: string;
  subTitle?: string;
}) {
  return (
    <div className="mt-3 mb-3 border-b border-white/40 pb-4">
      <div className="text-4xl md:text-5xl lg:text-6xl font-serif mb-3 md:mb-2 lg:mb-4">
        {price}
      </div>
      <div className="text-lg md:text-xl lg:text-2xl font-bold mb-1">
        {title}
      </div>
      {subTitle && (
        <div className="h-0 md:h-auto text-xs md:text-sm italic opacity-70">
          {subTitle}
        </div>
      )}
    </div>
  );
}

const freeFeatures = features.filter((f) => f.free);
const paidFeatures = features.filter((f) => !f.free);
const midPoint = Math.ceil(paidFeatures.length / 2);
const partedPaidFeatures = [
  paidFeatures.slice(0, midPoint),
  paidFeatures.slice(midPoint),
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="border-2 border-white/80 rounded-lg px-4 md:px-6 lg:px-8 mt-12 p-4"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold">
          Pricing
        </h1>
        <span className="text-2xl">💰</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between mt-8">
        <div className="w-full md:w-[30%] mb-8 md:mb-0">
          <PricingPlanHeader
            price="$ 0.00"
            title="Reduce Mode"
          />
          {freeFeatures.map((f) => (
            <FeatureItem
              key={f.title}
              title={f.title}
              body={f.body}
            />
          ))}
        </div>

        <div className="w-full md:w-[70%] md:pl-0 lg:pl-8">
          <PricingPlanHeader
            price="$ 49.00"
            title="Transduce Mode"
            subTitle="Everything in Reduce Mode plus"
          />
          <div className="flex flex-col md:flex-row justify-between">
            <div className="w-full md:w-1/2">
              {partedPaidFeatures[0].map((f) => (
                <FeatureItem
                  key={f.title}
                  title={f.title}
                  body={f.body}
                />
              ))}
            </div>

            <div className="w-full md:w-1/2">
              {partedPaidFeatures[1].map((f) => (
                <FeatureItem
                  key={f.title}
                  title={f.title}
                  body={f.body}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between font-bold text-lg mt-8">
        <div className="w-full md:w-[30%] cursor-pointer bg-white text-black rounded-lg py-2 rounded-lg text-center mb-3 md:mb-0">
          <a
            href="https://www.newline.co/samples/course/tinycanva-clojure-for-react-developers"
            className="block w-full"
          >
            Enroll Free
          </a>
        </div>

        <div
          style={{ backgroundColor: '#2A6A5E' }}
          className="w-full md:w-[70%] md:ml-0 lg:ml-8 cursor-pointer text-white rounded-lg py-2 rounded-lg text-center mt-3 md:mt-0"
        >
          <a
            href="https://www.newline.co/courses/tinycanva-clojure-for-react-developers"
            className="block w-full"
          >
            Enroll Full ($ 49.00)
          </a>
        </div>
      </div>

      <div className="text-sm opacity-50 mt-3">
        Enrollments, payments and course delivery is handled by Newline.
      </div>
    </section>
  );
}
