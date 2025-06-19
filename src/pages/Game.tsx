import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import Minesweeper from "@/components/Minesweeper";

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

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Icon
              name="Bomb"
              size={64}
              className="text-purple-400 mx-auto mb-4"
            />
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              💣 Сапёр
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Найди все мины, не взорвавшись!
            </p>
          </div>

          <Minesweeper />
        </div>
      </div>
    </div>
  );
};

export default Game;
