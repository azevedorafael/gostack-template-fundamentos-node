import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
interface CreateTransactionDTO {
  title: string;

  value: number;

  type: 'income' | 'outcome';
}

function agruparPor(
  objetoArray: CreateTransactionDTO[],
  propriedade: string,
): any {
  return objetoArray.reduce(function (acc: any, obj: any) {
    const key = obj[propriedade];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const groupByType = agruparPor(this.transactions, 'type');

    const { outcome, income } = groupByType;
    const outcomeSum = outcome.reduce(function (
      total: number,
      currentValue: CreateTransactionDTO,
    ) {
      return total + currentValue.value;
    },
    0);
    const incomeSum = income.reduce(function (
      total: number,
      currentValue: CreateTransactionDTO,
    ) {
      return total + currentValue.value;
    },
    0);
    const newObj = {
      income: incomeSum,
      outcome: outcomeSum,
      total: incomeSum - outcomeSum,
    };

    return newObj;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
