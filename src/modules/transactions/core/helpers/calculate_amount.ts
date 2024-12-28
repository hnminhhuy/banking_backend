import { TransactionModel } from '../models/transaction.model';

export function calBalanceChange(
  transaction: TransactionModel,
  affectedUserId: string,
) {
  const amount =
    transaction.amount * (transaction.remitterId === affectedUserId ? -1 : 1);

  let fee = 0;

  if (
    transaction.remitterId === affectedUserId &&
    transaction.remitterPaidFee
  ) {
    fee = -transaction.transactionFee;
  } else if (
    transaction.beneficiaryId === affectedUserId &&
    !transaction.remitterPaidFee
  ) {
    fee = -transaction.transactionFee;
  }

  return amount + fee;
}
