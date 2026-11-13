import { Heart } from 'lucide-react';

interface LikeButtonProps {
  liked: boolean;
  onToggle: () => void;
  label?: string;
  compact?: boolean;
}

export function LikeButton({ liked, onToggle, label, compact = false }: LikeButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-pressed={liked}
      aria-label={liked ? `Unlike ${label || 'item'}` : `Like ${label || 'item'}`}
      className={`inline-flex items-center gap-1.5 rounded border font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#167C80] ${
        compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
      } ${
        liked
          ? 'bg-[#FDF2F2] border-[#DC2626]/40 text-[#B91C1C] hover:bg-[#FEE2E2]'
          : 'bg-white border-[#D9E2E8] text-[#667784] hover:border-[#167C80] hover:text-[#173B57]'
      }`}
    >
      <Heart className={`w-3.5 h-3.5 transition-colors ${liked ? 'fill-[#DC2626] text-[#DC2626]' : ''}`} />
      <span>{liked ? 'Liked' : 'Like'}</span>
    </button>
  );
}
