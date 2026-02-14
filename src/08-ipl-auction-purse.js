/**
 * 🏏 IPL Auction Purse Manager
 *
 * IPL mega auction chal rahi hai! Team ka total purse (budget) diya hai
 * aur players ki list di hai jinhe khareedna hai. Tujhe calculate karna
 * hai ki team ne kitna spend kiya, kitna bacha, aur kuch stats banana hai.
 *
 * Rules:
 *   - team object: { name: "CSK", purse: 9000 } (purse in lakhs)
 *   - players array: [{ name: "Dhoni", role: "wk", price: 1200 }, ...]
 *   - role can be: "bat", "bowl", "ar" (all-rounder), "wk" (wicketkeeper)
 *   - Calculate:
 *     - totalSpent: sum of all player prices (use reduce)
 *     - remaining: purse - totalSpent
 *     - playerCount: total players bought
 *     - costliestPlayer: player object with highest price
 *     - cheapestPlayer: player object with lowest price
 *     - averagePrice: Math.round(totalSpent / playerCount)
 *     - byRole: object counting players per role using reduce
 *       e.g., { bat: 3, bowl: 4, ar: 2, wk: 1 }
 *     - isOverBudget: boolean, true agar totalSpent > purse
 *   - Hint: Use reduce(), filter(), sort(), find(), every(), some(),
 *     Array.isArray(), Math.round(), spread operator
 *
 * Validation:
 *   - Agar team object nahi hai ya team.purse positive number nahi hai, return null
 *   - Agar players array nahi hai ya empty hai, return null
 *
 * @param {{ name: string, purse: number }} team - Team info with budget
 * @param {Array<{ name: string, role: string, price: number }>} players
 * @returns {{ teamName: string, totalSpent: number, remaining: number, playerCount: number, costliestPlayer: object, cheapestPlayer: object, averagePrice: number, byRole: object, isOverBudget: boolean } | null}
 *
 * @example
 *   iplAuctionSummary(
 *     { name: "CSK", purse: 9000 },
 *     [{ name: "Dhoni", role: "wk", price: 1200 }, { name: "Jadeja", role: "ar", price: 1600 }]
 *   )
 *   // => { teamName: "CSK", totalSpent: 2800, remaining: 6200, playerCount: 2,
 *   //      costliestPlayer: { name: "Jadeja", role: "ar", price: 1600 },
 *   //      cheapestPlayer: { name: "Dhoni", role: "wk", price: 1200 },
 *   //      averagePrice: 1400, byRole: { wk: 1, ar: 1 }, isOverBudget: false }
 *
 *   iplAuctionSummary({ name: "RCB", purse: 500 }, [{ name: "Kohli", role: "bat", price: 1700 }])
 *   // => { ..., remaining: -1200, isOverBudget: true }
 */
export function iplAuctionSummary(team, players) {
	if (
		!team ||
		typeof team !== "object" ||
		!team.purse ||
		team.purse < 0 ||
		!Array.isArray(players) ||
		!players.length
	)
		return null;

	const prices = players.map((e) => e.price);

	const totalSpent = players.reduce((acc, curr) => (acc += curr.price), 0);

	const byRole = {};

	const bat = players.reduce((acc, curr) => {
		if (curr.role === "bat") return (acc += 1);
		return acc;
	}, 0);

	if (bat) byRole["bat"] = bat;

	const bowl = players.reduce((acc, curr) => {
		if (curr.role === "bowl") return (acc += 1);
		return acc;
	}, 0);

	if (bowl) byRole["bowl"] = bowl;

	const ar = players.reduce((acc, curr) => {
		if (curr.role === "ar") return (acc += 1);
		return acc;
	}, 0);

	if (ar) byRole["ar"] = ar;

	const wk = players.reduce((acc, curr) => {
		if (curr.role === "wk") return (acc += 1);
		return acc;
	}, 0);

	if (wk) byRole["wk"] = wk;

	return {
		teamName: team.name,
		totalSpent,
		remaining: team.purse - totalSpent,
		playerCount: players.length,
		costliestPlayer: players.filter(
			(e) => e.price === Math.max(...prices),
		)[0],
		cheapestPlayer: players.filter(
			(e) => e.price === Math.min(...prices),
		)[0],
		averagePrice: Math.round(totalSpent / players.length),
		byRole,
		isOverBudget: totalSpent > team.purse,
	};
}
