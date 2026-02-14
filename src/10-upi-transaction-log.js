/**
 * 💸 UPI Transaction Log Analyzer
 *
 * Aaj kal sab UPI pe chalta hai! Tujhe ek month ke transactions ka log
 * milega, aur tujhe pura analysis karna hai - kitna aaya, kitna gaya,
 * kiski saath zyada transactions hue, etc.
 *
 * Rules:
 *   - transactions is array of objects:
 *     [{ id: "TXN001", type: "credit"/"debit", amount: 500,
 *        to: "Rahul", category: "food", date: "2025-01-15" }, ...]
 *   - Skip transactions where amount is not a positive number
 *   - Skip transactions where type is not "credit" or "debit"
 *   - Calculate (on valid transactions only):
 *     - totalCredit: sum of all "credit" type amounts
 *     - totalDebit: sum of all "debit" type amounts
 *     - netBalance: totalCredit - totalDebit
 *     - transactionCount: total number of valid transactions
 *     - avgTransaction: Math.round(sum of all valid amounts / transactionCount)
 *     - highestTransaction: the full transaction object with highest amount
 *     - categoryBreakdown: object with category as key and total amount as value
 *       e.g., { food: 1500, travel: 800 } (include both credit and debit)
 *     - frequentContact: the "to" field value that appears most often
 *       (if tie, return whichever appears first)
 *     - allAbove100: boolean, true if every valid transaction amount > 100 (use every)
 *     - hasLargeTransaction: boolean, true if some valid amount >= 5000 (use some)
 *   - Hint: Use filter(), reduce(), sort(), find(), every(), some(),
 *     Object.entries(), Math.round(), typeof
 *
 * Validation:
 *   - Agar transactions array nahi hai ya empty hai, return null
 *   - Agar after filtering invalid transactions, koi valid nahi bacha, return null
 *
 * @param {Array<{ id: string, type: string, amount: number, to: string, category: string, date: string }>} transactions
 * @returns {{ totalCredit: number, totalDebit: number, netBalance: number, transactionCount: number, avgTransaction: number, highestTransaction: object, categoryBreakdown: object, frequentContact: string, allAbove100: boolean, hasLargeTransaction: boolean } | null}
 *
 * @example
 *   analyzeUPITransactions([
 *     { id: "T1", type: "credit", amount: 5000, to: "Salary", category: "income", date: "2025-01-01" },
 *     { id: "T2", type: "debit", amount: 200, to: "Swiggy", category: "food", date: "2025-01-02" },
 *     { id: "T3", type: "debit", amount: 100, to: "Swiggy", category: "food", date: "2025-01-03" }
 *   ])
 *   // => { totalCredit: 5000, totalDebit: 300, netBalance: 4700,
 *   //      transactionCount: 3, avgTransaction: 1767,
 *   //      highestTransaction: { id: "T1", ... },
 *   //      categoryBreakdown: { income: 5000, food: 300 },
 *   //      frequentContact: "Swiggy", allAbove100: false, hasLargeTransaction: true }
 */
export function analyzeUPITransactions(transactions) {
	if (!Array.isArray(transactions) || !transactions.length) return null;

	const finalTransactions = transactions.filter(
		(e) => e.amount > 0 && (e.type === "credit" || e.type === "debit"),
	);

	if (!finalTransactions.length) return null;

	const amounts = finalTransactions.map((e) => e.amount);

	const totalCredit = finalTransactions
		.filter((e) => e.type === "credit")
		.reduce((acc, curr) => (acc += curr.amount), 0);

	const totalDebit = finalTransactions
		.filter((e) => e.type === "debit")
		.reduce((acc, curr) => (acc += curr.amount), 0);

	const totalTransactions = finalTransactions.reduce(
		(acc, curr) => (acc += curr.amount),
		0,
	);

	const avgTransaction = Math.round(
		totalTransactions / finalTransactions.length,
	);

	const categoryBreakdown = {};

	finalTransactions.forEach((e, i) => {
		if (!categoryBreakdown[e.category])
			categoryBreakdown[e.category] = e.amount;
		else categoryBreakdown[e.category] += e.amount;
	});

	const contacts = finalTransactions.map((e) => e.to);

	contacts.sort();

	let j;
	let frequentContactIndex;

	contacts.forEach((e, i) => {
		if (i === 0) j = 0;
		else if (e === contacts[i - 1]) j = i;
		frequentContactIndex = j;
	});

	const frequentContact = contacts[frequentContactIndex] || contacts[0];

	return {
		totalCredit,
		totalDebit,
		netBalance: totalCredit - totalDebit,
		transactionCount: finalTransactions.length,
		avgTransaction,
		highestTransaction: finalTransactions.filter(
			(e) => e.amount === Math.max(...amounts),
		)[0],
		categoryBreakdown,
		frequentContact,
		allAbove100: finalTransactions.every((e) => e.amount > 100),
		hasLargeTransaction: finalTransactions.some((e) => e.amount >= 5000),
	};
}
