export type TransactionStatus = "Pending" | "Completed" | "Failed" | "FlaggedForReview";

export interface Transaction {
  id: string;
  name: string;        // Ekran gösterimi için alıcı/gönderen adı
  senderUsername: string;
  receiverUsername: string;
  amount: number;
  currency: string;
  description?: string | null;
  status: TransactionStatus;
  riskScore?: number | null;
  category: string | null;
  createdAt: string;
  time?: string;       // Opsiyonel: 14:20 formatı için
  date?: string;       // Opsiyonel: Bugün/Dün formatı için
  icon: string;        // BU SATIRI EKLE: İkon desteği için şart
}

export interface UserProfile {
  userId: string;
  name: string;
  balance: number;
  currency: string;
}