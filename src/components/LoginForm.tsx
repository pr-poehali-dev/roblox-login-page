import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";

interface LoginFormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Имя игрока обязательно";
    } else if (formData.username.length < 3) {
      newErrors.username = "Минимум 3 символа";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 6) {
      newErrors.password = "Минимум 6 символов";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const simulateLogin = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    // Имитация API запроса
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Простая проверка для демонстрации
    return username === "admin" && password === "123456";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const success = await simulateLogin(formData.username, formData.password);

      if (success) {
        toast.success("🎮 Добро пожаловать в игру!");
        // Сохраняем данные пользователя
        localStorage.setItem(
          "gameUser",
          JSON.stringify({
            username: formData.username,
            loginTime: new Date().toISOString(),
          }),
        );
        // Перенаправляем в игровую зону
        navigate("/game");
      } else {
        setErrors({ general: "Неверное имя игрока или пароль" });
        toast.error("Ошибка входа в игру");
      }
    } catch (error) {
      setErrors({ general: "Ошибка подключения к серверу" });
      toast.error("Проблемы с подключением");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    toast.info("📧 Инструкции отправлены на почту admin@gameportal.com");
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
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
          {errors.general && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-purple-300 font-medium">
              Имя игрока
            </Label>
            <div className="relative group">
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className={`bg-black/40 border-purple-500/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 transition-all duration-300 group-hover:border-purple-400/70 ${
                  errors.username
                    ? "border-red-500/70 focus:border-red-500"
                    : ""
                }`}
                placeholder="Введи свой никнейм"
                disabled={isLoading}
              />
              <Icon
                name="User"
                size={20}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 opacity-60"
              />
            </div>
            {errors.username && (
              <p className="text-red-400 text-sm">{errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-purple-300 font-medium">
              Пароль
            </Label>
            <div className="relative group">
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`bg-black/40 border-purple-500/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 transition-all duration-300 group-hover:border-purple-400/70 ${
                  errors.password
                    ? "border-red-500/70 focus:border-red-500"
                    : ""
                }`}
                placeholder="Введи пароль"
                disabled={isLoading}
              />
              <Icon
                name="Lock"
                size={20}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 opacity-60"
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                Вход в игру...
              </>
            ) : (
              <>
                <Icon name="Play" size={20} className="mr-2" />
                Войти в игру
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleForgotPassword}
            className="text-purple-400 hover:text-purple-300 transition-colors duration-300 text-sm underline"
          >
            Забыл пароль?
          </button>
        </div>

        {showForgotPassword && (
          <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-300 text-sm text-center">
            💡 Подсказка: попробуй admin / 123456
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
