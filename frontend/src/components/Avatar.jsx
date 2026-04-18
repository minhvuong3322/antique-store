const Avatar = ({ user, size = 'md' }) => {
    // Get initials from user name
    const getInitials = (name) => {
        if (!name) return '?'

        const parts = name.trim().split(' ')
        if (parts.length >= 2) {
            // Get first letter of first name and last name
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        }
        // Get first two letters if only one word
        return name.substring(0, 2).toUpperCase()
    }

    const initials = getInitials(user?.full_name || user?.email)

    // Size classes
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base'
    }

    // Generate background color based on name
    const getColorFromName = (name) => {
        if (!name) return 'bg-vintage-gold'

        const colors = [
            'bg-vintage-bronze',
            'bg-vintage-gold',
            'bg-vintage-darkwood',
            'bg-blue-500',
            'bg-green-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500'
        ]

        const index = name.charCodeAt(0) % colors.length
        return colors[index]
    }

    const bgColor = getColorFromName(user?.full_name || user?.email)

    return (
        <div
            className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-bold shadow-md`}
            title={user?.full_name || user?.email}
        >
            {initials}
        </div>
    )
}

export default Avatar
