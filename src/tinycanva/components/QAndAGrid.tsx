import { qAndAs } from '@src/tinycanva/data';
import type { QAndA } from '@src/tinycanva/data/types';

function QAndA({ emoji, question, answer: Answer }: QAndA) {
  return (
    <div className="mt-8 w-full md:w-[calc(48%-24px)]">
      <div className="text-4xl mb-2">{emoji}</div>
      <div className="font-serif text-lg md:text-xl mt-2 font-bold">
        {question}
      </div>
      <div className="mt-3 leading-relaxed text-sm md:text-base space-y-4">
        <Answer />
      </div>
    </div>
  );
}

export function QAndAGrid() {
  return (
    <section
      id="faq"
      className="mt-8 flex justify-between flex-wrap"
    >
      {qAndAs.map((qa) => (
        <QAndA
          key={qa.question}
          {...qa}
        />
      ))}
    </section>
  );
}
