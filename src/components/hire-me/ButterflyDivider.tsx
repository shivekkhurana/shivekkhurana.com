import Img from '@src/components/Img';

export default function ButterflyDivider() {
  return (
    <div className="relative mb-16">
      <div className="border-t"></div>
      <div className="absolute right-12 -top-6">
        <Img
          path="/img/sketches/butterfly.png"
          alt="Butterfly sketch"
          defaultWidth={240}
          className="w-16 h-auto"
        />
      </div>
    </div>
  );
}
