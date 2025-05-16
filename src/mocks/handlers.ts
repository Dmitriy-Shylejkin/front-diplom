import { rest } from 'msw';

export const handlers = [
  rest.post('/login', async (req, res, ctx) => {
    const { email, password } = await req.json();

    if (email === 'admin@example.com' && password === 'admin') {
      return res(
        ctx.status(200),
        ctx.json({ token: 'mock-token', user: { email, role: 'admin' } })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({ message: 'Неверный логин или пароль' })
    );
  }),

  rest.get('/faculties', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 'fitu', name: 'Факультет ИТ и управления (ФИТУ)', icon: '🖥️' },
        { id: 'fiop', name: 'Факультет инноватики (ФИОП)', icon: '⚙️' },
        { id: 'mf', name: 'Механический факультет (МФ)', icon: '🔩' },
        { id: 'sf', name: 'Строительный факультет (СФ)', icon: '🧱' },
        { id: 'enf', name: 'Энергетический факультет (ЭнФ)', icon: '⚡' },
        { id: 'ggngd', name: 'Геологии и нефтегазового дела', icon: '🪨' },
        { id: 'ifio', name: 'ИФИО', icon: '📘' },
        { id: 'npc', name: 'Колледж ЮРГПУ (НПИ)', icon: '🎓' },
        { id: 'vuc', name: 'Военный учебный центр', icon: '🎖️' },
        { id: 'asiigr', name: 'АСИиГР', icon: '📚' },
        { id: 'ib', name: 'Каф. ИБ', icon: '🔒' },
        { id: 'tf', name: 'Технологический факультет', icon: '🔧' },
      ])
    );
  }),
];