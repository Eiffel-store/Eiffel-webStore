import React, { forwardRef } from 'react';
import { ExternalLink } from 'lucide-react';

interface MapPreviewFrameProps {
  lat: number;
  lng: number;
}

export const MapPreviewFrame = forwardRef<HTMLIFrameElement, MapPreviewFrameProps>(
  ({ lat, lng }, ref) => {
    const bboxPadding = 0.008;
    const bbox = `${lng - bboxPadding},${lat - bboxPadding},${lng + bboxPadding},${lat + bboxPadding}`;
    const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

    return (
      <div className="relative w-full h-52 sm:h-56 rounded-lg overflow-hidden border border-zinc-700 shadow-inner bg-zinc-900">
        <iframe
          ref={ref}
          src={mapEmbedUrl}
          title="Delivery Location Map"
          className="w-full h-full border-0 pointer-events-auto"
        />

        {/* Direct Google Maps Link badge */}
        <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 z-10">
          <a
            href={`https://maps.google.com/?q=${lat},${lng}`}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 bg-black/80 hover:bg-black text-amber-400 border border-amber-400/40 rounded text-[10px] font-mono flex items-center gap-1.5 backdrop-blur-sm shadow transition-colors"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Live GPS Coordinates Tag */}
        <div className="absolute bottom-2 left-2 rtl:left-auto rtl:right-2 z-10 px-2.5 py-1 bg-black/80 text-zinc-300 rounded text-[10px] font-mono border border-zinc-800 backdrop-blur-sm">
          GPS: {lat.toFixed(5)}, {lng.toFixed(5)}
        </div>
      </div>
    );
  }
);

MapPreviewFrame.displayName = 'MapPreviewFrame';
