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
        {
          "id": 1,
          "name": "ИСИИ-21-1",
          "programId": 1,
          "curatorId": 5,
          "createdAt": "2025-05-15T12:06:09.975Z",
          "updatedAt": "2025-05-15T12:06:09.975Z"
        },
        {
          "id": 2,
          "name": "ПМиКН-22-2",
          "programId": 2,
          "curatorId": 8,
          "createdAt": "2025-05-15T12:06:09.975Z",
          "updatedAt": "2025-05-15T12:06:09.975Z"
        },
        {
          "id": 3,
          "name": "ЭЭиЭТ-21-3",
          "programId": 3,
          "curatorId": 3,
          "createdAt": "2025-05-15T12:06:09.975Z",
          "updatedAt": "2025-05-15T12:06:09.975Z"
        },
        {
          "id": 4,
          "name": "СУЗиС-23-1",
          "programId": 4,
          "curatorId": 12,
          "createdAt": "2025-05-15T12:06:09.975Z",
          "updatedAt": "2025-05-15T12:06:09.975Z"
        },
        {
          "id": 5,
          "name": "НГД-22-4",
          "programId": 5,
          "curatorId": 7,
          "createdAt": "2025-05-15T12:06:09.975Z",
          "updatedAt": "2025-05-15T12:06:09.975Z"
        },
        {
          "id": 6,
          "name": "МиР-21-2",
          "programId": 6,
          "curatorId": 4,
          "createdAt": "2025-05-15T12:06:09.975Z",
          "updatedAt": "2025-05-15T12:06:09.975Z"
        },
        {
          "id": 7,
          "name": "БИ-23-3",
          "programId": 7,
          "curatorId": 9,
          "createdAt": "2025-05-15T12:06:09.975Z",
          "updatedAt": "2025-05-15T12:06:09.975Z"
        },
        {
          "id": 8,
          "name": "ТМ-22-1",
          "programId": 8,
          "curatorId": 6,
          "createdAt": "2025-05-15T12:06:09.975Z",
          "updatedAt": "2025-05-15T12:06:09.975Z"
        },
        {
          "id": 9,
          "name": "ИБ-21-5",
          "programId": 9,
          "curatorId": 10,
          "createdAt": "2025-05-15T12:06:09.975Z",
          "updatedAt": "2025-05-15T12:06:09.975Z"
        },
        {
          "id": 10,
          "name": "ГиРПИ-23-2",
          "programId": 10,
          "curatorId": 11,
          "createdAt": "2025-05-15T12:06:09.975Z",
          "updatedAt": "2025-05-15T12:06:09.975Z"
        }
      ])
    );
  }),

  rest.get('/students/1', (req, res, ctx) => {
    const { studentId } = req.params;
    const id = Number(studentId);
    
    return res(
      ctx.status(200),
      ctx.json(
        {
            "id": 8,
            "fullName": "Димас",
            "email": "modie8856@gmail.com",
            "phone": "+78005553535",
            "groupId": 3,
            "characteristic": null,
            "createdAt": "2025-05-15T16:27:34.508Z",
            "updatedAt": "2025-05-15T16:27:34.508Z",
        },
      )
    );
  }),

  rest.get('/students', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
            "id": 8,
            "fullName": "Димас",
            "email": "modie8856@gmail.com",
            "phone": "+78005553535",
            "groupId": 3,
            "characteristic": null,
            "createdAt": "2025-05-15T16:27:34.508Z",
            "updatedAt": "2025-05-15T16:27:34.508Z",
        },
        {
            "id": 11,
            "fullName": "Димммммаааа",
            "email": "dm2584709@gmail.com",
            "phone": "+78005553534",
            "groupId": 3,
            "characteristic": null,
            "createdAt": "2025-05-16T13:13:10.991Z",
            "updatedAt": "2025-05-16T13:13:10.991Z",
        },
    ])
    );
  }),
];