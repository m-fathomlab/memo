export type MemoColor = "blue" | "green" | "orange" | "pink";

export type MemoBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string } // **굵게** 표시를 쓸 수 있다
  | { type: "list"; items: string[] };

export type Memo = {
  id: string;
  title: string;
  preview: string;
  /** 목록에 보이는 날짜 */
  date: string;
  /** 상세 화면에 보이는 날짜 */
  dateTime: string;
  category: "업무" | "개인" | "아이디어";
  color: MemoColor;
  pinned: boolean;
  body: MemoBlock[];
};

export const memos: Memo[] = [
  {
    id: "1",
    title: "디자인 리뷰 회의록",
    preview: "검수 기준과 다음 할 일 정리",
    date: "오늘",
    dateTime: "10월 30일 오전 9:12",
    category: "업무",
    color: "blue",
    pinned: true,
    body: [
      { type: "heading", text: "회의 요약" },
      {
        type: "paragraph",
        text: "홈 화면의 색과 간격을 **변수로 통일**하기로 했다. 칩과 카드 모서리 기준부터 정리한다.",
      },
      { type: "subheading", text: "결정한 것" },
      {
        type: "list",
        items: [
          "묶음은 오토레이아웃, 늘어날 것은 Fill",
          "색과 간격은 변수로 연결",
          "시안은 프레임 링크로 넘기기",
        ],
      },
      { type: "subheading", text: "다음 할 일" },
      {
        type: "paragraph",
        text: "금요일까지 각자 맡은 화면을 채점한다. **점수보다 깎인 이유**를 먼저 공유한다.",
      },
      { type: "subheading", text: "남은 질문" },
      { type: "paragraph", text: "다크 모드 색은 다음 회의에서 정한다." },
    ],
  },
  {
    id: "2",
    title: "주말 등산 준비",
    preview: "물 두 병, 간식, 바람막이 챙기기",
    date: "어제",
    dateTime: "10월 29일 오후 7:40",
    category: "개인",
    color: "green",
    pinned: true,
    body: [
      { type: "heading", text: "준비물" },
      { type: "paragraph", text: "토요일 아침 7시에 출발한다. **비 소식**이 있으니 겉옷을 꼭 챙긴다." },
      { type: "subheading", text: "챙길 것" },
      { type: "list", items: ["물 두 병", "간식과 초콜릿", "바람막이", "여분 양말"] },
      { type: "subheading", text: "집합" },
      { type: "paragraph", text: "역 앞 편의점에서 만나기로 했다." },
    ],
  },
  {
    id: "3",
    title: "장보기 목록",
    preview: "우유, 계란, 사과, 커피 원두",
    date: "오늘",
    dateTime: "10월 30일 오전 8:05",
    category: "개인",
    color: "pink",
    pinned: false,
    body: [
      { type: "heading", text: "이번 주 장보기" },
      { type: "paragraph", text: "퇴근길에 한 번에 사 온다. **커피 원두**는 거의 떨어졌다." },
      { type: "subheading", text: "살 것" },
      { type: "list", items: ["우유", "계란", "사과", "커피 원두"] },
    ],
  },
  {
    id: "4",
    title: "앱 아이콘 아이디어",
    preview: "메모지 모서리가 접힌 모양",
    date: "오늘",
    dateTime: "10월 30일 오전 10:30",
    category: "아이디어",
    color: "orange",
    pinned: false,
    body: [
      { type: "heading", text: "아이콘 스케치" },
      { type: "paragraph", text: "메모지 모서리가 **접힌 모양**을 바탕으로 한다. 파란색 한 가지로 단순하게 간다." },
      { type: "subheading", text: "시도해 볼 것" },
      { type: "list", items: ["접힌 모서리를 크게", "둥근 사각형 안에 넣기", "작은 크기에서도 읽히는지 확인"] },
    ],
  },
  {
    id: "5",
    title: "읽을 책",
    preview: "디자인 시스템 책 두 권",
    date: "어제",
    dateTime: "10월 29일 오후 9:15",
    category: "개인",
    color: "green",
    pinned: false,
    body: [
      { type: "heading", text: "독서 목록" },
      { type: "paragraph", text: "이번 달에는 **디자인 시스템** 책 두 권을 먼저 읽는다." },
      { type: "subheading", text: "목록" },
      { type: "list", items: ["디자인 시스템 입문", "토큰으로 만드는 UI"] },
    ],
  },
];

export function getMemo(id: string) {
  return memos.find((memo) => memo.id === id);
}
