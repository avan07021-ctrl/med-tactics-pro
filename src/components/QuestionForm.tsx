import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface QuestionFormProps {
  themes: any[];
  question?: any;
  onSave: (question: any) => void;
  onCancel: () => void;
}

export const QuestionForm = ({ themes, question, onSave, onCancel }: QuestionFormProps) => {
  const [formData, setFormData] = useState({
    theme_id: question?.theme_id || "",
    question: question?.question || "",
    option_a: question?.option_a || "",
    option_b: question?.option_b || "",
    option_c: question?.option_c || "",
    option_d: question?.option_d || "",
    correct_answer: question?.correct_answer || "",
    hint: question?.hint || "",
    source: question?.source || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: question?.id });
  };

  return (
    <Card className="mb-6 border-primary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{question ? "Редактирование вопроса" : "Новый вопрос"}</CardTitle>
            <CardDescription>
              {question ? "Измените данные вопроса" : "Добавьте новый вопрос в базу"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme_id">Тема *</Label>
              <Select
                value={formData.theme_id.toString()}
                onValueChange={(value) => setFormData({ ...formData, theme_id: parseInt(value) })}
                required
              >
                <SelectTrigger id="theme_id">
                  <SelectValue placeholder="Выберите тему" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme.id} value={theme.id.toString()}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="correct_answer">Правильный ответ *</Label>
              <Select
                value={formData.correct_answer}
                onValueChange={(value) => setFormData({ ...formData, correct_answer: value })}
                required
              >
                <SelectTrigger id="correct_answer">
                  <SelectValue placeholder="Выберите вариант" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Вопрос *</Label>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              required
              rows={3}
              placeholder="Введите текст вопроса"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="option_a">Вариант A *</Label>
              <Input
                id="option_a"
                value={formData.option_a}
                onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                required
                placeholder="Текст варианта A"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="option_b">Вариант B *</Label>
              <Input
                id="option_b"
                value={formData.option_b}
                onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                required
                placeholder="Текст варианта B"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="option_c">Вариант C *</Label>
              <Input
                id="option_c"
                value={formData.option_c}
                onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                required
                placeholder="Текст варианта C"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="option_d">Вариант D *</Label>
              <Input
                id="option_d"
                value={formData.option_d}
                onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
                required
                placeholder="Текст варианта D"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hint">Подсказка</Label>
            <Textarea
              id="hint"
              value={formData.hint}
              onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
              rows={2}
              placeholder="Дополнительная подсказка к вопросу (необязательно)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Источник</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="Источник информации (необязательно)"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
            <Button type="submit">
              {question ? "Сохранить изменения" : "Добавить вопрос"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};