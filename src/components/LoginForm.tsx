import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { username, password });
    // Здесь будет логика входа
  };

  return (
    <div className="relative backdrop-blur-lg bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-8 rounded-2xl border border-purple-500/30 shadow-2xl">
      <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-60"></div>
      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-xl opacity-40"></div>

      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Icon name="Gamepad2" size={40} className="text-purple-400 mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              GamePortal
            </h1>
          </div>
          <p className="text-gray-300 text-lg">Войди в игру</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-purple-300 font-medium">
              Имя игрока
            </Label>
            <div className="relative group">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-black/40 border-purple-500/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 transition-all duration-300 group-hover:border-purple-400/70"
                placeholder="Введи свой никнейм"
                required
              />
              <Icon
                name="User"
                size={20}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 opacity-60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-purple-300 font-medium">
              Пароль
            </Label>
            <div className="relative group">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/40 border-purple-500/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 transition-all duration-300 group-hover:border-purple-400/70"
                placeholder="Введи пароль"
                required
              />
              <Icon
                name="Lock"
                size={20}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 opacity-60"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
          >
            <Icon name="Play" size={20} className="mr-2" />
            Войти в игру
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-purple-400 hover:text-purple-300 transition-colors duration-300 text-sm"
          >
            Забыл пароль?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
