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
