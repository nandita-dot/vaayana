import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Box, 
  RotateCw, 
  Layers, 
  Eye, 
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';

type Shape3DType = 'cube' | 'cuboid' | 'cone';

export const ThreeDShapeViewer: React.FC = () => {
  const { language } = useLanguage();
  const [selectedShape, setSelectedShape] = useState<Shape3DType>('cube');
  const [rotation, setRotation] = useState({ x: -25, y: 35 });
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [showNet, setShowNet] = useState(false);
  const [highlightPart, setHighlightPart] = useState<'faces' | 'edges' | 'vertices' | null>(null);

  const isDraggingRef = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    setIsAutoSpin(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setRotation(prev => ({
      x: Math.max(-85, Math.min(85, prev.x - dy * 0.5)),
      y: (prev.y + dx * 0.5) % 360
    }));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const shapeDetails = {
    cube: {
      nameEn: 'Cube',
      nameMl: 'സമചതുരക്കട്ട',
      faces: 6,
      edges: 12,
      vertices: 8,
      facesDescEn: '6 identical flat square faces',
      facesDescMl: 'തുല്യ വിസ്തീർണ്ണമുള്ള 6 സമചതുര പ്രതലങ്ങൾ',
      examplesEn: 'Dice, Rubik\'s cube, sugar cube, ice cube',
      examplesMl: 'ഡൈസ് (പകിട), റൂബിക്സ് ക്യൂബ്, ഐസ് കട്ട, പഞ്ചസാരക്കട്ട',
      color: '#9ACD32'
    },
    cuboid: {
      nameEn: 'Cuboid',
      nameMl: 'ദീർഘചതുരക്കട്ട',
      faces: 6,
      edges: 12,
      vertices: 8,
      facesDescEn: '6 flat rectangular faces (opposite faces are identical)',
      facesDescMl: '6 ദീർഘചതുര പ്രതലങ്ങൾ (എതിർ പ്രതലങ്ങൾ തുല്യം)',
      examplesEn: 'Matchbox, brick, geometry box, textbook',
      examplesMl: 'തീപ്പെട്ടി, ഇഷ്ടിക, ജോമട്രി ബോക്സ്, പാഠപുസ്തകം',
      color: '#38BDF8'
    },
    cone: {
      nameEn: 'Cone',
      nameMl: 'സ്തൂപിക (കോൺ)',
      faces: 2, // 1 circular flat base + 1 curved surface
      edges: 1, // circular boundary
      vertices: 1, // apex
      facesDescEn: '1 flat circular base + 1 smooth curved surface tapering to an apex',
      facesDescMl: '1 പരന്ന വൃത്താകൃതിയിലുള്ള അടിത്തറയും 1 വളഞ്ഞ പ്രതലവും 1 അഗ്രവും',
      examplesEn: 'Ice-cream cone, birthday party hat, traffic cone',
      examplesMl: 'ഐസ്ക്രീം കോൺ, പിറന്നാൾ തൊപ്പി, ട്രാഫിക് കോൺ',
      color: '#FB923C'
    }
  };

  const details = shapeDetails[selectedShape];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-vaayana-lime/20 border border-vaayana-lime/40 flex items-center justify-center text-vaayana-lime font-black">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-vaayana-textLight">
              {language === 'ml' ? 'ത്രിമാന രൂപങ്ങളുടെ പര്യവേക്ഷണം (3D Shapes)' : '3D Geometric Shape Explorer'}
            </h3>
            <p className="text-xs text-vaayana-textLightMuted">
              {language === 'ml' ? 'സമചതുരക്കട്ട, ദീർഘചതുരക്കട്ട, സ്തൂപിക എന്നിവ 3D യിൽ തിരിച്ചു കാണാം' : 'Touch & drag to rotate Cube, Cuboid and Cone in 3D'}
            </p>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isAutoSpin
                ? 'bg-vaayana-lime text-vaayana-dark border-vaayana-lime'
                : 'bg-vaayana-dark text-vaayana-textLightMuted border-vaayana-darkBorder hover:text-vaayana-textLight'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoSpin ? 'animate-spin' : ''}`} />
            <span>{language === 'ml' ? 'കറക്കുക' : 'Auto Rotate'}</span>
          </button>

          <button
            onClick={() => setShowNet(!showNet)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              showNet
                ? 'bg-amber-400 text-vaayana-dark border-amber-400'
                : 'bg-vaayana-dark text-vaayana-textLightMuted border-vaayana-darkBorder hover:text-vaayana-textLight'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'ml' ? 'നെറ്റ് (2D Net)' : '2D Unfolding Net'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Stage + Information Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Shape Selection Tabs */}
        <div className="lg:col-span-3 space-y-3">
          {(['cube', 'cuboid', 'cone'] as const).map(shape => {
            const isSelected = selectedShape === shape;
            const data = shapeDetails[shape];
            return (
              <button
                key={shape}
                onClick={() => {
                  setSelectedShape(shape);
                  setRotation({ x: -25, y: 35 });
                }}
                className={`w-full text-left p-4 rounded-3xl border transition-all flex items-center justify-between group active:scale-95 ${
                  isSelected
                    ? 'bg-vaayana-softSurface border-vaayana-lime shadow-soft'
                    : 'bg-vaayana-darkSurface border-vaayana-darkBorder hover:border-vaayana-darkMuted text-vaayana-textLightMuted'
                }`}
              >
                <div>
                  <h4 className={`text-base font-black ${isSelected ? 'text-vaayana-textDark font-malayalam' : 'text-vaayana-textLight font-malayalam'}`}>
                    {data.nameMl}
                  </h4>
                  <p className="text-xs font-bold font-mono opacity-80">
                    {data.nameEn}
                  </p>
                </div>
                <div 
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: data.color }}
                />
              </button>
            );
          })}

          {/* Interactive Highlight Toggles */}
          <div className="p-4 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder space-y-2 mt-4">
            <span className="text-xs font-mono font-bold text-vaayana-textLightMuted block uppercase">
              {language === 'ml' ? 'ഭാഗങ്ങൾ തിരിച്ചറിയാം' : 'Highlight Part'}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setHighlightPart(highlightPart === 'faces' ? null : 'faces')}
                className={`p-2 rounded-xl text-xs font-bold text-center transition-all ${highlightPart === 'faces' ? 'bg-vaayana-lime text-vaayana-dark' : 'bg-vaayana-dark text-vaayana-textLightMuted'}`}
              >
                {language === 'ml' ? 'പ്രതലം' : 'Faces'}
              </button>
              <button
                onClick={() => setHighlightPart(highlightPart === 'edges' ? null : 'edges')}
                className={`p-2 rounded-xl text-xs font-bold text-center transition-all ${highlightPart === 'edges' ? 'bg-amber-400 text-vaayana-dark' : 'bg-vaayana-dark text-vaayana-textLightMuted'}`}
              >
                {language === 'ml' ? 'വക്ക്' : 'Edges'}
              </button>
              <button
                onClick={() => setHighlightPart(highlightPart === 'vertices' ? null : 'vertices')}
                className={`p-2 rounded-xl text-xs font-bold text-center transition-all ${highlightPart === 'vertices' ? 'bg-sky-400 text-vaayana-dark' : 'bg-vaayana-dark text-vaayana-textLightMuted'}`}
              >
                {language === 'ml' ? 'മൂല' : 'Vertices'}
              </button>
            </div>
          </div>
        </div>

        {/* Center: 3D Stage */}
        <div className="lg:col-span-6 bg-vaayana-softSurface p-6 sm:p-8 rounded-4xl border border-vaayana-softBorder shadow-card flex flex-col items-center justify-between min-h-[380px] relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs text-vaayana-textDarkMuted">
            <span className="font-bold flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-vaayana-limeDark" />
              {language === 'ml' ? 'വിരൽ കൊണ്ട് തിരിച്ചു നോക്കൂ' : 'Drag to rotate 360°'}
            </span>
            <span className="font-mono text-[11px]">
              X: {Math.round(rotation.x)}° Y: {Math.round(rotation.y)}°
            </span>
          </div>

          {/* 3D Viewport with CSS 3D Transforms */}
          <div 
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="w-full flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing select-none py-8"
            style={{ perspective: '900px' }}
          >
            {showNet ? (
              /* 2D Unfolding Net View */
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-white/80 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-2"
              >
                <div className="text-xs font-bold text-slate-700">
                  {language === 'ml' ? `${details.nameMl} — പരന്ന രൂപം (Net)` : `${details.nameEn} 2D Net`}
                </div>
                {selectedShape === 'cube' && (
                  <div className="grid grid-cols-4 gap-1 p-2">
                    <div className="w-10 h-10 col-start-2 bg-lime-200 border-2 border-lime-600 rounded flex items-center justify-center text-xs font-bold">1</div>
                    <div className="w-10 h-10 col-start-1 col-span-4 flex gap-1">
                      <div className="w-10 h-10 bg-lime-200 border-2 border-lime-600 rounded flex items-center justify-center text-xs font-bold">2</div>
                      <div className="w-10 h-10 bg-lime-300 border-2 border-lime-700 rounded flex items-center justify-center text-xs font-bold">3</div>
                      <div className="w-10 h-10 bg-lime-200 border-2 border-lime-600 rounded flex items-center justify-center text-xs font-bold">4</div>
                      <div className="w-10 h-10 bg-lime-200 border-2 border-lime-600 rounded flex items-center justify-center text-xs font-bold">5</div>
                    </div>
                    <div className="w-10 h-10 col-start-2 bg-lime-200 border-2 border-lime-600 rounded flex items-center justify-center text-xs font-bold">6</div>
                  </div>
                )}
                {selectedShape === 'cuboid' && (
                  <div className="grid grid-cols-4 gap-1 p-2">
                    <div className="w-14 h-8 col-start-2 bg-sky-200 border-2 border-sky-600 rounded flex items-center justify-center text-xs font-bold">Top</div>
                    <div className="col-start-1 col-span-4 flex gap-1">
                      <div className="w-8 h-12 bg-sky-100 border-2 border-sky-500 rounded flex items-center justify-center text-[10px] font-bold">L</div>
                      <div className="w-14 h-12 bg-sky-200 border-2 border-sky-600 rounded flex items-center justify-center text-xs font-bold">Front</div>
                      <div className="w-8 h-12 bg-sky-100 border-2 border-sky-500 rounded flex items-center justify-center text-[10px] font-bold">R</div>
                      <div className="w-14 h-12 bg-sky-200 border-2 border-sky-600 rounded flex items-center justify-center text-xs font-bold">Back</div>
                    </div>
                    <div className="w-14 h-8 col-start-2 bg-sky-200 border-2 border-sky-600 rounded flex items-center justify-center text-xs font-bold">Base</div>
                  </div>
                )}
                {selectedShape === 'cone' && (
                  <div className="flex flex-col items-center gap-1 p-2">
                    <div className="w-16 h-16 rounded-full bg-orange-200 border-2 border-orange-600 flex items-center justify-center text-xs font-bold">
                      Base (Circle)
                    </div>
                    <div className="w-24 h-16 border-t-2 border-x-2 border-orange-500 rounded-t-full bg-orange-100 flex items-center justify-center text-[10px] font-bold">
                      Curved Sector
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              /* Interactive 2D Vector Isometric Geometric Shape Visualizer */
              <div className="w-full h-72 relative flex items-center justify-center p-4">
                <svg viewBox="0 0 280 220" className="w-full h-full max-h-64 drop-shadow-md select-none">
                  <defs>
                    <linearGradient id="cubeTop" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={highlightPart === 'faces' ? '#D9F99D' : '#C4B5FD'} />
                      <stop offset="100%" stopColor={highlightPart === 'faces' ? '#BEF264' : '#A78BFA'} />
                    </linearGradient>
                    <linearGradient id="cubeLeft" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={highlightPart === 'faces' ? '#A3E635' : '#8B5CF6'} />
                      <stop offset="100%" stopColor={highlightPart === 'faces' ? '#84CC16' : '#7C3AED'} />
                    </linearGradient>
                    <linearGradient id="cubeRight" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={highlightPart === 'faces' ? '#65A30D' : '#6D28D9'} />
                      <stop offset="100%" stopColor={highlightPart === 'faces' ? '#4D7C0F' : '#5B21B6'} />
                    </linearGradient>

                    <linearGradient id="cuboidTop" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={highlightPart === 'faces' ? '#D9F99D' : '#A7F3D0'} />
                      <stop offset="100%" stopColor={highlightPart === 'faces' ? '#BEF264' : '#6EE7B7'} />
                    </linearGradient>
                    <linearGradient id="cuboidLeft" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={highlightPart === 'faces' ? '#A3E635' : '#34D399'} />
                      <stop offset="100%" stopColor={highlightPart === 'faces' ? '#84CC16' : '#10B981'} />
                    </linearGradient>
                    <linearGradient id="cuboidRight" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={highlightPart === 'faces' ? '#65A30D' : '#059669'} />
                      <stop offset="100%" stopColor={highlightPart === 'faces' ? '#4D7C0F' : '#047857'} />
                    </linearGradient>

                    <linearGradient id="coneGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={highlightPart === 'faces' ? '#FDE047' : '#FED7AA'} />
                      <stop offset="50%" stopColor={highlightPart === 'faces' ? '#FACC15' : '#FB923C'} />
                      <stop offset="100%" stopColor={highlightPart === 'faces' ? '#EAB308' : '#EA580C'} />
                    </linearGradient>
                  </defs>

                  {/* CUBE */}
                  {selectedShape === 'cube' && (
                    <g transform="translate(140, 110)">
                      {/* Top Face */}
                      <polygon
                        points="0,-60 60,-25 0,10 -60,-25"
                        fill="url(#cubeTop)"
                        stroke={highlightPart === 'edges' ? '#F59E0B' : '#4C1D95'}
                        strokeWidth={highlightPart === 'edges' ? 4 : 2}
                      />
                      {/* Left Face */}
                      <polygon
                        points="-60,-25 0,10 0,80 -60,45"
                        fill="url(#cubeLeft)"
                        stroke={highlightPart === 'edges' ? '#F59E0B' : '#4C1D95'}
                        strokeWidth={highlightPart === 'edges' ? 4 : 2}
                      />
                      {/* Right Face */}
                      <polygon
                        points="0,10 60,-25 60,45 0,80"
                        fill="url(#cubeRight)"
                        stroke={highlightPart === 'edges' ? '#F59E0B' : '#4C1D95'}
                        strokeWidth={highlightPart === 'edges' ? 4 : 2}
                      />
                      {/* Vertices Dots */}
                      {highlightPart === 'vertices' && (
                        <g fill="#38BDF8" stroke="#0369A1" strokeWidth="2">
                          <circle cx="0" cy="-60" r="6" />
                          <circle cx="60" cy="-25" r="6" />
                          <circle cx="0" cy="10" r="6" />
                          <circle cx="-60" cy="-25" r="6" />
                          <circle cx="-60" cy="45" r="6" />
                          <circle cx="0" cy="80" r="6" />
                          <circle cx="60" cy="45" r="6" />
                          <circle cx="0" cy="10" r="6" />
                        </g>
                      )}
                    </g>
                  )}

                  {/* CUBOID */}
                  {selectedShape === 'cuboid' && (
                    <g transform="translate(140, 110)">
                      {/* Top Face */}
                      <polygon
                        points="0,-50 90,-20 0,10 -90,-20"
                        fill="url(#cuboidTop)"
                        stroke={highlightPart === 'edges' ? '#F59E0B' : '#064E3B'}
                        strokeWidth={highlightPart === 'edges' ? 4 : 2}
                      />
                      {/* Left Face */}
                      <polygon
                        points="-90,-20 0,10 0,65 -90,35"
                        fill="url(#cuboidLeft)"
                        stroke={highlightPart === 'edges' ? '#F59E0B' : '#064E3B'}
                        strokeWidth={highlightPart === 'edges' ? 4 : 2}
                      />
                      {/* Right Face */}
                      <polygon
                        points="0,10 90,-20 90,35 0,65"
                        fill="url(#cuboidRight)"
                        stroke={highlightPart === 'edges' ? '#F59E0B' : '#064E3B'}
                        strokeWidth={highlightPart === 'edges' ? 4 : 2}
                      />
                      {/* Vertices Dots */}
                      {highlightPart === 'vertices' && (
                        <g fill="#38BDF8" stroke="#0369A1" strokeWidth="2">
                          <circle cx="0" cy="-50" r="6" />
                          <circle cx="90" cy="-20" r="6" />
                          <circle cx="0" cy="10" r="6" />
                          <circle cx="-90" cy="-20" r="6" />
                          <circle cx="-90" cy="35" r="6" />
                          <circle cx="0" cy="65" r="6" />
                          <circle cx="90" cy="35" r="6" />
                        </g>
                      )}
                    </g>
                  )}

                  {/* CONE */}
                  {selectedShape === 'cone' && (
                    <g transform="translate(140, 105)">
                      {/* Curved Surface Body */}
                      <path
                        d="M 0 -75 L 70 50 A 70 24 0 0 1 -70 50 Z"
                        fill="url(#coneGrad)"
                        stroke={highlightPart === 'edges' ? '#F59E0B' : '#9A3412'}
                        strokeWidth={highlightPart === 'edges' ? 3 : 2}
                      />
                      {/* Base Ellipse Rim */}
                      <ellipse
                        cx="0"
                        cy="50"
                        rx="70"
                        ry="24"
                        fill={highlightPart === 'faces' ? '#FDE047' : '#FED7AA'}
                        stroke={highlightPart === 'edges' ? '#F59E0B' : '#9A3412'}
                        strokeWidth={highlightPart === 'edges' ? 4 : 2}
                      />
                      {/* Apex Vertex Dot */}
                      {highlightPart === 'vertices' && (
                        <circle cx="0" cy="-75" r="7" fill="#38BDF8" stroke="#0369A1" strokeWidth="2.5" />
                      )}
                    </g>
                  )}
                </svg>
              </div>
            )}
          </div>

          <div className="w-full text-center text-xs font-bold text-vaayana-textDarkMuted border-t border-vaayana-softBorder pt-3">
            {language === 'ml' ? 'ജ്യാമിതീയ ഘടന വ്യക്തമായി കാണാം' : 'Clear interactive geometric model'}
          </div>
        </div>

        {/* Right Column: Properties & Examples */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Properties Card */}
          <div className="bg-vaayana-softSurface p-6 rounded-3xl border border-vaayana-softBorder shadow-card space-y-3">
            <h4 className="text-base font-black text-vaayana-textDark font-malayalam flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-vaayana-limeDark" />
              <span>{language === 'ml' ? 'പ്രത്യേകതകൾ' : 'Properties'}</span>
            </h4>

            <div className="space-y-2 text-xs font-bold text-vaayana-textDark">
              <div className="flex justify-between p-2.5 rounded-xl bg-vaayana-soft">
                <span>{language === 'ml' ? 'പ്രതലങ്ങൾ (Faces):' : 'Faces:'}</span>
                <span className="font-mono text-vaayana-limeDark font-black text-sm">{details.faces}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-vaayana-soft">
                <span>{language === 'ml' ? 'വക്കുകൾ (Edges):' : 'Edges:'}</span>
                <span className="font-mono text-sky-600 font-black text-sm">{details.edges}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-vaayana-soft">
                <span>{language === 'ml' ? 'മൂലകൾ (Vertices):' : 'Vertices:'}</span>
                <span className="font-mono text-amber-600 font-black text-sm">{details.vertices}</span>
              </div>
            </div>

            <p className="text-xs text-vaayana-textDarkMuted font-medium pt-1 leading-relaxed">
              {language === 'ml' ? details.facesDescMl : details.facesDescEn}
            </p>
          </div>

          {/* Everyday Examples */}
          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 text-amber-950 space-y-2 shadow-sm">
            <span className="text-xs font-black uppercase tracking-wider block text-amber-800">
              {language === 'ml' ? 'നിത്യജീവിതത്തിലെ ഉദാഹരണങ്ങൾ' : 'Real-World Objects'}
            </span>
            <p className="text-sm font-bold font-malayalam leading-relaxed">
              {language === 'ml' ? details.examplesMl : details.examplesEn}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
