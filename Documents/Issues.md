# 已知問題待修復清單
 - 今天發現今日任務清單不知道什麼原因重複產生重複項目，如截圖中所示，並提供匯出json給你參考，幫我檢查今日任務產生的機制並直接修正程式bug
   ```
    {
  "goals": [
    {
      "title": "Workout",
      "frequencyType": "weekly",
      "completedTimes": 0,
      "timesPerPeriod": 3,
      "daysOfWeek": [
        "Saturday",
        "Sunday",
        "Wednesday"
      ],
      "time": "20:00",
      "description": "",
      "progress": 0,
      "id": "1746946516867",
      "createdAt": "2025-05-11T06:55:16.867Z",
      "updatedAt": "2025-05-11T14:05:40.078Z"
    },
    {
      "title": "Reading",
      "frequencyType": "weekly",
      "completedTimes": 0,
      "timesPerPeriod": 3,
      "daysOfWeek": [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "time": "22:00",
      "description": "",
      "progress": 0,
      "id": "1746946535421",
      "createdAt": "2025-05-11T06:55:35.421Z",
      "updatedAt": "2025-05-11T14:06:02.340Z"
    },
    {
      "title": "Meditation",
      "frequencyType": "monthly",
      "completedTimes": 0,
      "timesPerPeriod": 15,
      "daysOfWeek": [
        "Friday",
        "Thursday",
        "Wednesday",
        "Saturday",
        "Sunday",
        "Tuesday",
        "Monday"
      ],
      "time": "22:40",
      "description": "",
      "progress": 0,
      "id": "1746949034957",
      "createdAt": "2025-05-11T07:37:14.957Z",
      "updatedAt": "2025-05-11T14:06:14.943Z"
    },
    {
      "title": "English speaking with ChatGPT",
      "frequencyType": "weekly",
      "completedTimes": 0,
      "timesPerPeriod": 2,
      "daysOfWeek": [
        "Monday",
        "Wednesday",
        "Friday",
        "Sunday",
        "Tuesday",
        "Thursday",
        "Saturday"
      ],
      "time": "21:00",
      "description": "",
      "progress": 0,
      "id": "1746950371295",
      "createdAt": "2025-05-11T07:59:31.295Z",
      "updatedAt": "2025-05-11T08:46:59.363Z"
    },
    {
      "title": "Review Algorithm",
      "frequencyType": "weekly",
      "completedTimes": 0,
      "timesPerPeriod": 4,
      "daysOfWeek": [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "time": "11:00",
      "description": "",
      "progress": 0,
      "id": "1746953299736",
      "createdAt": "2025-05-11T08:48:19.736Z",
      "updatedAt": "2025-05-11T14:06:33.567Z"
    }
  ],
  "tasks": [
    {
      "goalId": "1746946516867",
      "title": "Workout",
      "date": "2025-05-11",
      "time": "20:00",
      "status": "completed",
      "frequencyType": "weekly",
      "createdAt": "2025-05-11T08:58:30.841Z",
      "updatedAt": "2025-05-11T13:55:19.963Z",
      "id": 1
    },
    {
      "goalId": "1746946535421",
      "title": "Reading",
      "date": "2025-05-11",
      "time": "22:00",
      "status": "completed",
      "frequencyType": "day",
      "createdAt": "2025-05-11T08:58:30.844Z",
      "updatedAt": "2025-05-11T13:19:46.048Z",
      "id": 2
    },
    {
      "goalId": "1746949034957",
      "title": "Meditation",
      "date": "2025-05-11",
      "time": "22:40",
      "status": "completed",
      "frequencyType": "monthly",
      "createdAt": "2025-05-11T08:58:30.847Z",
      "updatedAt": "2025-05-11T13:19:53.883Z",
      "id": 3
    },
    {
      "goalId": "1746950371295",
      "title": "English speaking with ChatGPT",
      "date": "2025-05-11",
      "time": "21:00",
      "status": "completed",
      "frequencyType": "weekly",
      "createdAt": "2025-05-11T08:58:30.852Z",
      "updatedAt": "2025-05-11T13:19:44.492Z",
      "id": 4
    },
    {
      "goalId": "1746953299736",
      "title": "Review Algorithm",
      "date": "2025-05-11",
      "time": "11:00",
      "status": "completed",
      "frequencyType": "day",
      "createdAt": "2025-05-11T08:58:30.854Z",
      "updatedAt": "2025-05-11T13:55:18.436Z",
      "id": 5
    },
    {
      "goalId": "1746968353671",
      "title": "Test",
      "date": "2025-05-11",
      "time": "21:05",
      "status": "completed",
      "frequencyType": "day",
      "createdAt": "2025-05-11T12:59:14.655Z",
      "updatedAt": "2025-05-11T13:13:06.605Z",
      "id": 6
    },
    {
      "goalId": "1746968463492",
      "title": "Test2",
      "date": "2025-05-11",
      "time": "21:10",
      "status": "completed",
      "frequencyType": "day",
      "createdAt": "2025-05-11T13:01:13.009Z",
      "updatedAt": "2025-05-11T13:54:57.561Z",
      "id": 7
    },
    {
      "goalId": "1746946535421",
      "title": "Reading",
      "date": "2025-05-12",
      "time": "22:00",
      "status": "completed",
      "frequencyType": "weekly",
      "createdAt": "2025-05-11T22:34:49.238Z",
      "updatedAt": "2025-05-12T11:47:34.883Z",
      "id": 8
    },
    {
      "goalId": "1746949034957",
      "title": "Meditation",
      "date": "2025-05-12",
      "time": "22:40",
      "status": "completed",
      "frequencyType": "monthly",
      "createdAt": "2025-05-11T22:34:49.247Z",
      "updatedAt": "2025-05-12T00:40:52.410Z",
      "id": 9
    },
    {
      "goalId": "1746950371295",
      "title": "English speaking with ChatGPT",
      "date": "2025-05-12",
      "time": "21:00",
      "status": "pending",
      "frequencyType": "weekly",
      "createdAt": "2025-05-11T22:34:49.250Z",
      "updatedAt": "2025-05-11T22:34:49.250Z",
      "id": 10
    },
    {
      "goalId": "1746953299736",
      "title": "Review Algorithm",
      "date": "2025-05-12",
      "time": "11:00",
      "status": "pending",
      "frequencyType": "weekly",
      "createdAt": "2025-05-11T22:34:49.255Z",
      "updatedAt": "2025-05-11T22:34:49.255Z",
      "id": 11
    },
    {
      "goalId": "1746946535421",
      "title": "Reading",
      "date": "2025-05-12",
      "time": "22:00",
      "status": "pending",
      "frequencyType": "weekly",
      "createdAt": "2025-05-11T22:34:49.244Z",
      "updatedAt": "2025-05-12T11:47:42.226Z",
      "id": 12
    },
    {
      "goalId": "1746949034957",
      "title": "Meditation",
      "date": "2025-05-12",
      "time": "22:40",
      "status": "pending",
      "frequencyType": "monthly",
      "createdAt": "2025-05-11T22:34:49.248Z",
      "updatedAt": "2025-05-11T22:34:49.248Z",
      "id": 13
    },
    {
      "goalId": "1746950371295",
      "title": "English speaking with ChatGPT",
      "date": "2025-05-12",
      "time": "21:00",
      "status": "pending",
      "frequencyType": "weekly",
      "createdAt": "2025-05-11T22:34:49.251Z",
      "updatedAt": "2025-05-11T22:34:49.252Z",
      "id": 14
    },
    {
      "goalId": "1746953299736",
      "title": "Review Algorithm",
      "date": "2025-05-12",
      "time": "11:00",
      "status": "pending",
      "frequencyType": "weekly",
      "createdAt": "2025-05-11T22:34:49.257Z",
      "updatedAt": "2025-05-11T22:34:49.257Z",
      "id": 15
    }
  ],
  "exportDate": "2025-05-12T12:42:55.175Z"
}
   ```