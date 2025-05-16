import { rest } from 'msw';

export const handlers = [
  rest.post('/login', async (req, res, ctx) => {
    const { email, password } = await req.json();
    console.log('fdffafdaff')

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
        { id: 'fitu', name: 'Факультет ИТ и управления'},
        { id: 'fiop', name: 'Факультет инноватики (ФИОП)' },
        { id: 'mf', name: 'Механический факультет (МФ)' },
        { id: 'sf', name: 'Строительный факультет (СФ)' },
        { id: 'enf', name: 'Энергетический факультет (ЭнФ)' },
        { id: 'ggngd', name: 'Геологии и нефтегазового дела' },
        { id: 'ifio', name: 'ИФИО' },
        { id: 'npc', name: 'Колледж ЮРГПУ (НПИ)' },
        { id: 'vuc', name: 'Военный учебный центр' },
        { id: 'asiigr', name: 'АСИиГР' },
        { id: 'ib', name: 'Каф. ИБ' },
        { id: 'tf', name: 'Технологический факультет' },
      ])
    );
  }),

  rest.get('/programs', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          "id": 1,
          "name": "Информационные системы и искусственный интеллект",
          "code": "09.03.02",
          "shortName": "ИСИИ",
          "facultyId": 1,
          "createdAt": "2025-05-15T15:57:39.536Z",
          "updatedAt": "2025-05-15T15:57:39.536Z"
        },
        {
          "id": 2,
          "name": "Прикладная математика и компьютерные науки",
          "code": "01.03.02",
          "shortName": "ПМиКН",
          "facultyId": 1,
          "createdAt": "2025-05-15T15:57:39.536Z",
          "updatedAt": "2025-05-15T15:57:39.536Z"
        },
        {
          "id": 3,
          "name": "Электроэнергетика и электротехника",
          "code": "13.03.02",
          "shortName": "ЭЭиЭТ",
          "facultyId": 5,
          "createdAt": "2025-05-15T15:57:39.536Z",
          "updatedAt": "2025-05-15T15:57:39.536Z"
        },
        {
          "id": 4,
          "name": "Строительство уникальных зданий и сооружений",
          "code": "08.05.01",
          "shortName": "СУЗиС",
          "facultyId": 4,
          "createdAt": "2025-05-15T15:57:39.536Z",
          "updatedAt": "2025-05-15T15:57:39.536Z"
        },
        {
          "id": 5,
          "name": "Нефтегазовое дело",
          "code": "21.03.01",
          "shortName": "НГД",
          "facultyId": 6,
          "createdAt": "2025-05-15T15:57:39.536Z",
          "updatedAt": "2025-05-15T15:57:39.536Z"
        },
        {
          "id": 6,
          "name": "Мехатроника и робототехника",
          "code": "15.03.06",
          "shortName": "МиР",
          "facultyId": 3,
          "createdAt": "2025-05-15T15:57:39.536Z",
          "updatedAt": "2025-05-15T15:57:39.536Z"
        },
        {
          "id": 7,
          "name": "Бизнес-информатика",
          "code": "38.03.05",
          "shortName": "БИ",
          "facultyId": 1,
          "createdAt": "2025-05-15T15:57:39.536Z",
          "updatedAt": "2025-05-15T15:57:39.536Z"
        },
        {
          "id": 8,
          "name": "Технология машиностроения",
          "code": "15.03.05",
          "shortName": "ТМ",
          "facultyId": 3,
          "createdAt": "2025-05-15T15:57:39.536Z",
          "updatedAt": "2025-05-15T15:57:39.536Z"
        },
        {
          "id": 9,
          "name": "Информационная безопасность",
          "code": "10.03.01",
          "shortName": "ИБ",
          "facultyId": 11,
          "createdAt": "2025-05-15T15:57:39.536Z",
          "updatedAt": "2025-05-15T15:57:39.536Z"
        },
        {
          "id": 10,
          "name": "Геология и разведка полезных ископаемых",
          "code": "21.05.02",
          "shortName": "ГиРПИ",
          "facultyId": 6,
          "createdAt": "2025-05-15T15:57:39.536Z",
          "updatedAt": "2025-05-15T15:57:39.536Z"
        }
      ])
    );
  }),

  rest.get('/groups', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 'fitu', name: 'Факультет ИТ и управления'},
        { id: 'fiop', name: 'Факультет инноватики (ФИОП)' },
        { id: 'mf', name: 'Механический факультет (МФ)' },
        { id: 'sf', name: 'Строительный факультет (СФ)' },
        { id: 'enf', name: 'Энергетический факультет (ЭнФ)' },
        { id: 'ggngd', name: 'Геологии и нефтегазового дела' },
        { id: 'ifio', name: 'ИФИО' },
        { id: 'npc', name: 'Колледж ЮРГПУ (НПИ)' },
        { id: 'vuc', name: 'Военный учебный центр' },
        { id: 'asiigr', name: 'АСИиГР' },
        { id: 'ib', name: 'Каф. ИБ' },
        { id: 'tf', name: 'Технологический факультет' },
      ])
    );
  }),
];