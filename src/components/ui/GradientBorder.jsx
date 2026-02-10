import React from 'react';

const GradientBorder = ({ children, className = "", borderWidth = "3px", borderRadius = "24px" }) => {
  return (
    <div 
      className={`relative ${className}`} 
      style={{ borderRadius: borderRadius }}
    >
      {/* Animated Gradient Layer - Z-Index 0 */}
      <div 
        className="absolute"
        style={{
          top: `calc(-1 * ${borderWidth})`,
          left: `calc(-1 * ${borderWidth})`,
          height: `calc(100% + ${borderWidth} * 2)`,
          width: `calc(100% + ${borderWidth} * 2)`,
          background: 'linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82)',
          borderRadius: `calc(${borderRadius} + ${borderWidth})`,
          backgroundSize: '300% 300%',
          animation: 'animatedgradient 3s ease alternate infinite',
          zIndex: 0
        }}
      />
      
      {/* Content Container - Z-Index 10 (Sits on top) */}
      <div className="relative h-full w-full bg-[#0A0A0F] z-10" style={{ borderRadius: borderRadius }}>
        {children}
      </div>
    </div>
  );
};

export default GradientBorder;
