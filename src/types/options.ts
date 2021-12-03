type CommonOption = "----";

export type InternalAccess =
  | CommonOption
  | "Splashtop"
  | "シンクライアント"
  | "その他";
export type Device =
  | CommonOption
  | "会社貸与PC"
  | "会社貸与タブレット"
  | "個人所有PC"
  | "個人所有タブレット";
export type Contact =
  | CommonOption
  | "会社携帯"
  | "個人携帯"
  | "自宅固定電話"
  | "個人携帯（ＢＹＯＤ）"
  | "ＢＰ社連絡先";

export type OptionsProps = {
  darkMode: boolean;
};

export const isApproveConfirm = "isApproveConfirm";
