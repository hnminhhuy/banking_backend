import { TransactionModel } from '../models/transaction.model';

export function calculateAmountForRemitter(transaction: TransactionModel) {
  if (transaction.remitterPaidFee) {
    return transaction.amount + transaction.transactionFee;
  }
  return transaction.amount * -1;
}

export function calculateAmountForBeneficiary(transaction: TransactionModel) {
  if (transaction.remitterPaidFee) {
    return transaction.amount;
  }
  return transaction.amount + transaction.transactionFee;
}
