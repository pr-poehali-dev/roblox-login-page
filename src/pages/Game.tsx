import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface GameUser {
  username: string;
  loginTime: string;
}

const Game = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<GameUser | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("gameUser");
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("gameUser");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Icon name="Gamepad2" size={32} className="text-purple-400" />
            <h1 className="text-2xl font-bold">GamePortal</h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-purple-300">Привет, {user.username}!</span>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </header>

        <div className="text-center py-12">
          <Icon
            name="Trophy"
            size={64}
            className="text-yellow-400 mx-auto mb-4"
          />
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎮 Добро пожаловать в игру!
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Игрок{" "}
            <span className="text-purple-400 font-bold">{user.username}</span>{" "}
            успешно вошел в систему
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-800/40 to-pink-800/40 p-6 rounded-xl border border-purple-500/30">
              <Icon
                name="Zap"
                size={32}
                className="text-yellow-400 mx-auto mb-3"
              />
              <h3 className="text-lg font-bold mb-2">Быстрая игра</h3>
              <p className="text-gray-300 text-sm">Начни играть прямо сейчас</p>
            </div>

            <div className="bg-gradient-to-br from-blue-800/40 to-purple-800/40 p-6 rounded-xl border border-blue-500/30">
              <Icon
                name="Users"
                size={32}
                className="text-blue-400 mx-auto mb-3"
              />
              <h3 className="text-lg font-bold mb-2">Мультиплеер</h3>
              <p className="text-gray-300 text-sm">Играй с друзьями онлайн</p>
            </div>

            <div className="bg-gradient-to-br from-green-800/40 to-blue-800/40 p-6 rounded-xl border border-green-500/30">
              <Icon
                name="Settings"
                size={32}
                className="text-green-400 mx-auto mb-3"
              />
              <h3 className="text-lg font-bold mb-2">Настройки</h3>
              <p className="text-gray-300 text-sm">Персонализируй игру</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
