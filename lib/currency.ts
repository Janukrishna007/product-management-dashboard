// Currency formatting utility
export const formatINR = (amount: number): string => {
    return `₹${amount.toFixed(2)}`
}

// Convert USD to INR (approximate rate: 1 USD = 83 INR)
export const convertToINR = (usdAmount: number): number => {
    return usdAmount * 83
}

// Format and convert USD to INR
export const formatUSDtoINR = (usdAmount: number): string => {
    return formatINR(convertToINR(usdAmount))
}
