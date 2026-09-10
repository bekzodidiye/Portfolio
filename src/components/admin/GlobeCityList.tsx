import React from 'react';
import { MapPin } from 'lucide-react';
import { RealGeoPoint } from '../../services/realVisitorStorage';

interface GlobeCityListProps {
  geoPoints: RealGeoPoint[];
  activePoint: RealGeoPoint | null;
  onSelectCity: (point: RealGeoPoint) => void;
}

export const GlobeCityList: React.FC<GlobeCityListProps> = ({
  geoPoints,
  activePoint,
  onSelectCity,
}) => {
  return (
    <div className="lg:col-span-4 space-y-3">
      <div className="text-xs font-mono text-slate-400 uppercase">Qayd Etilgan Shaharlar:</div>
      <div className="space-y-1.5 max-h-[320px] overflow-y-auto no-scrollbar">
        {geoPoints.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 font-mono">
            Hozircha tashrif geografiyasi to'planmoqda...
          </div>
        ) : (
          geoPoints.map((pt) => (
            <div
              key={pt.city}
              onClick={() => onSelectCity(pt)}
              className={`p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                activePoint?.city === pt.city
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold truncate">
                  {pt.city}, {pt.country}
                </span>
              </div>
              <span className="font-mono text-[11px] text-emerald-400 shrink-0 font-semibold">
                {pt.visitors} tashrif
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
