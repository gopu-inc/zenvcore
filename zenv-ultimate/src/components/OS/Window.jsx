import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';

export const Window = ({ id, title, children, isOpen, onClose, isActive, onFocus, icon: Icon }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      onMouseDown={onFocus}
      className={`absolute top-10 left-10 w-[800px] h-[500px] bg-[#1e1e1e] rounded-lg shadow-2xl border overflow-hidden flex flex-col ${
        isActive ? 'border-blue-500 z-50' : 'border-gray-700 z-10'
      }`}
      style={{ minWidth: 300, minHeight: 200 }}
    >
      {/* Title Bar */}
      <div className={`h-10 px-4 flex items-center justify-between select-none ${isActive ? 'bg-[#2d2d2d]' : 'bg-[#1a1a1a]'}`}>
        <div className="flex items-center gap-2 text-gray-300">
          {Icon && <Icon size={16} />}
          <span className="font-bold text-sm">{title}</span>
        </div>
        <div className="flex gap-2">
           <button onClick={onClose} className="hover:bg-red-500 p-1 rounded text-white"><X size={14}/></button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto bg-[#0a0a0a] relative">
        {children}
      </div>
    </motion.div>
  );
};