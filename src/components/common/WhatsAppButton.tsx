'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(true);

  const phone = '905445727292';
  const message = 'Merhaba, websiten üzerinden ulaşıyorum';
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Speech bubble / Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-2 mr-1 relative flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-zinc-900/90 text-white text-xs border border-emerald-500/30 backdrop-blur-md shadow-2xl max-w-xs"
          >
            <div className="flex flex-col">
              <span className="font-semibold text-emerald-400">Doğanay Keskin</span>
              <span className="text-zinc-300 text-[11px]">Hemen mesaj atın: &quot;Merhaba, websiten üzerinden ulaşıyorum&quot;</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-zinc-400 hover:text-white p-0.5 rounded-full"
              aria-label="Kapat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-zinc-900 border-r border-b border-emerald-500/30 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium shadow-[0_0_25px_rgba(16,185,129,0.45)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="WhatsApp İletişim"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
        </div>
        <span className="text-sm font-semibold tracking-wide hidden sm:inline">WhatsApp ile Yazın</span>
      </a>
    </div>
  );
}
