export type MemoColor = "blue" | "green" | "orange" | "pink" | "purple" | "teal" | "yellow";

/** 홈의 필터(분류). 이름과 대표 색을 가진다. */
export type Category = {
  id: string;
  name: string;
  color: MemoColor;
};

/** 글을 쓰는 가족 한 명 */
export type Member = {
  id: string;
  name: string;
};

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
  /** 분류 이름. 분류가 없으면 null ("분류 없음") */
  category: string | null;
  /** 쓴 사람(가족 이름). 모르면 null */
  author: string | null;
  color: MemoColor;
  pinned: boolean;
  body: MemoBlock[];
};
