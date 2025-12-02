import { WeLoveClojure } from '@src/tinycanva/data';

export function Header() {
  return (
    <header className="pt-8">
      <div className="flex justify-center items-center text-sm md:text-base">
        <a
          href="/authors/shivekkhurana"
          className="inline-block mx-2 underline font-bold"
        >
          Shivek Khurana
        </a>{' '}
        and
        <a
          href="https://newline.co"
          className="inline-block"
        >
          <img
            className="h-4 h-6 md:h-8 mx-2 pt-1"
            src="/img/newline-logo-white.svg"
            alt="Newline.co Logo"
          />
        </a>
        presents
      </div>

      <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal mt-8 mb-4 text-center w-full md:w-4/5 lg:w-3/5 mx-auto">
        Tinycanva: Clojure for React Developers
      </h1>

      <h2 className="text-lg md:text-xl lg:text-2xl font-normal opacity-60 my-0 text-center">
        A course on building a web-based graphics editor with Clojure.
      </h2>

      <div className="bg-white text-black rounded-lg p-4 md:p-6 lg:p-8 mt-8 pb-12 flex gap-4 flex-col items-center justify-center">
        <h3 className="font-serif text-xl md:text-2xl lg:text-3xl font-normal text-center">
          Clojure is a remarkable tool for thought
        </h3>
        <WeLoveClojure />
      </div>
    </header>
  );
}
