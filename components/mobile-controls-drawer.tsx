'use client';

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';

type SnapPoint = 'peek' | 'half' | 'full';

interface MobileControlsDrawerProps {
  children: ReactNode;
  isOpen?: boolean;
}

const SNAP_POINTS = {
  peek: 20, // Just peek - show handle and hint of controls (20vh)
  half: 50, // Half screen (50vh)
  full: 90, // Almost full screen - leave room for header (90vh)
} as const;

export default function MobileControlsDrawer({ children, isOpen = true }: MobileControlsDrawerProps) {
  const [snapPoint, setSnapPoint] = useState<SnapPoint>('peek');
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Calculate height based on snap point and drag offset
  const getDrawerHeight = useCallback((): string => {
    if (!isDragging) {
      return `${SNAP_POINTS[snapPoint]}vh`;
    }

    // During dragging, calculate position
    const viewportHeight = window.innerHeight;
    const currentSnapHeight = (SNAP_POINTS[snapPoint] / 100) * viewportHeight;
    const dragDelta = currentY - startY;
    const newHeight = Math.max(
      (SNAP_POINTS.peek / 100) * viewportHeight,
      Math.min((SNAP_POINTS.full / 100) * viewportHeight, currentSnapHeight - dragDelta),
    );

    return `${(newHeight / viewportHeight) * 100}vh`;
  }, [snapPoint, isDragging, startY, currentY]);

  // Determine snap point based on final drag position
  const determineSnapPoint = useCallback((finalY: number): SnapPoint => {
    const viewportHeight = window.innerHeight;
    const currentSnapHeight = (SNAP_POINTS[snapPoint] / 100) * viewportHeight;
    const dragDelta = finalY - startY;
    const newHeight = currentSnapHeight - dragDelta;
    const newHeightPercent = (newHeight / viewportHeight) * 100;

    // Determine closest snap point
    if (newHeightPercent > SNAP_POINTS.half + (SNAP_POINTS.full - SNAP_POINTS.half) / 2) {
      return 'full';
    } else if (newHeightPercent > SNAP_POINTS.peek + (SNAP_POINTS.half - SNAP_POINTS.peek) / 2) {
      return 'half';
    } else {
      return 'peek';
    }
  }, [snapPoint, startY]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    // Only allow dragging from the handle area
    if (!target.closest('[data-drawer-handle]')) return;

    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      setCurrentY(e.touches[0].clientY);
    },
    [isDragging],
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    const newSnapPoint = determineSnapPoint(currentY);
    setSnapPoint(newSnapPoint);
    setIsDragging(false);
  }, [isDragging, currentY, determineSnapPoint]);

  // Mouse event handlers (for desktop testing)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[data-drawer-handle]')) return;

    setIsDragging(true);
    setStartY(e.clientY);
    setCurrentY(e.clientY);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setCurrentY(e.clientY);
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    const newSnapPoint = determineSnapPoint(currentY);
    setSnapPoint(newSnapPoint);
    setIsDragging(false);
  }, [isDragging, currentY, determineSnapPoint]);

  // Add/remove mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(() => {
    setSnapPoint('peek');
  }, []);

  if (!isOpen) return null;

  const drawerHeight = getDrawerHeight();
  const isExpanded = snapPoint === 'half' || snapPoint === 'full';

  return (
    <>
      {/* Backdrop - only visible when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          style={{
            opacity: snapPoint === 'full' ? 0.6 : snapPoint === 'half' ? 0.4 : 0,
          }}
          onClick={handleBackdropClick}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed bottom-0 left-0 right-0 bg-zd-black z-50 md:hidden transition-all duration-300 ease-out"
        style={{
          height: drawerHeight,
          transitionProperty: isDragging ? 'none' : 'height',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Drawer Handle */}
        <div
          data-drawer-handle
          className="flex items-center justify-center py-3 cursor-grab active:cursor-grabbing border-b border-zd-gray"
        >
          <div className="w-12 h-1 bg-zd-gray rounded-full" />
        </div>

        {/* Drawer Content */}
        <div className="h-[calc(100%-48px)] overflow-y-auto overflow-x-hidden">{children}</div>
      </div>
    </>
  );
}
