/**
 * Format currency to Vietnamese Dong or USD
 */
export const formatCurrency = (amount, currency = 'VND') => {
    if (currency === 'VND') {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount)
}

/**
 * Format date to localized string
 */
export const formatDate = (date, locale = 'vi-VN') => {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date))
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}


