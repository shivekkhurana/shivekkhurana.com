import { Header } from '@src/tinycanva/components/Header';
import { QAndAGrid } from '@src/tinycanva/components/QAndAGrid';
import { Pricing } from '@src/tinycanva/components/Pricing';
import { FreeResources } from '@src/tinycanva/components/FreeResources';

export function Tinycanva() {
  return (
    <div
      className="text-white bg-black min-h-screen"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="w-[90%] md:w-4/5 lg:w-3/5 mx-auto pt-0">
        <Header />
        <QAndAGrid />
        <Pricing />
        <FreeResources />
      </div>
    </div>
  );
}
