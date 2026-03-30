export function formatCurrency(price) {
    return parseFloat(price)?.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
    });
}
