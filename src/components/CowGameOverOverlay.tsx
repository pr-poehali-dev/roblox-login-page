import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface CowGameOverOverlayProps {
  isVisible: boolean;
  onRestart: () => void;
  onClose: () => void;
}

const CowGameOverOverlay = ({
  isVisible,
  onRestart,
  onClose,
}: CowGameOverOverlayProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-purple-900/30 to-black/30" />

      {/* Анимированная корова */}
      <div
        className={`relative text-center transform transition-all duration-1000 ${
          isAnimating ? "animate-scale-in" : "scale-95 opacity-0"
        }`}
      >
        <div className="mb-8 animate-bounce">
          <div className="text-9xl mb-4 filter drop-shadow-2xl">🐄</div>
          <div className="text-6xl font-bold text-red-400 mb-4 animate-pulse">
            МУУ-У-У!
          </div>
        </div>

        <div className="bg-black/60 p-8 rounded-2xl border-2 border-red-500/50 backdrop-blur-md">
          <h2 className="text-4xl font-bold text-red-300 mb-4">
            💥 Игра окончена!
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Корова не одобряет твоё обращение с минами! 🐮
          </p>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={onRestart}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg"
            >
              <Icon name="RotateCcw" size={20} className="mr-2" />
              Попробовать снова
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-500 text-gray-300 hover:bg-gray-500/20 px-8 py-3 text-lg"
            >
              <Icon name="X" size={20} className="mr-2" />
              Закрыть
            </Button>
          </div>
        </div>

        {/* Дополнительные анимированные элементы */}
        <div
          className="absolute -top-10 -left-10 text-4xl animate-bounce"
          style={{ animationDelay: "0.5s" }}
        >
          💥
        </div>
        <div
          className="absolute -top-10 -right-10 text-4xl animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          🔥
        </div>
        <div
          className="absolute -bottom-10 -left-10 text-4xl animate-bounce"
          style={{ animationDelay: "1.5s" }}
        >
          💣
        </div>
        <div
          className="absolute -bottom-10 -right-10 text-4xl animate-bounce"
          style={{ animationDelay: "2s" }}
        >
          ☠️
        </div>
      </div>
    </div>
  );
};

export default CowGameOverOverlay;
