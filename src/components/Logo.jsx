import { useTheme } from '../context/ThemeContext'

const Logo = ({ size = 'md', showText = true, className = '' }) => {
    const { isDark } = useTheme()
    
    // Size configurations
    const sizeMap = {
        sm: { icon: 24, text: 'text-lg' },
        md: { icon: 32, text: 'text-xl' },
        lg: { icon: 48, text: 'text-3xl' },
        xl: { icon: 64, text: 'text-4xl' }
    }
    
    const config = sizeMap[size] || sizeMap.md
    const iconSize = config.icon
    
    // Colors based on theme
    const primaryColor = isDark ? '#D4A574' : '#CD7F32' // vintage-gold or bronze
    const secondaryColor = isDark ? '#3E2723' : '#5D4037' // darkwood or wood
    const accentColor = '#D4A574' // vintage-gold
    
    return (
        <div className={`flex items-center ${showText ? 'space-x-2' : ''} ${className}`}>
            {/* SVG Logo - Vintage Vase/Antique Pot */}
            <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
            >
                {/* Vintage Vase/Pot Design */}
                {/* Pot base shadow */}
                <ellipse 
                    cx="32" 
                    cy="58" 
                    rx="14" 
                    ry="4" 
                    fill={isDark ? "rgba(62, 39, 35, 0.3)" : "rgba(62, 39, 35, 0.2)"}
                />
                
                {/* Pot body */}
                <path
                    d="M24 32C24 28 26 24 28 22L36 22C38 24 40 28 40 32L40 50C40 52 38 54 36 54L28 54C26 54 24 52 24 50Z"
                    fill={primaryColor}
                />
                
                {/* Pot rim */}
                <path
                    d="M28 22L36 22C38 24 38 26 36 28L28 28C26 26 26 24 28 22Z"
                    fill={secondaryColor}
                />
                
                {/* Decorative band */}
                <path
                    d="M28 34L36 34L36 38L28 38Z"
                    fill={secondaryColor}
                />
                
                {/* Vintage ornament detail - classical pattern */}
                <path
                    d="M30 40L34 40M32 38L32 42"
                    stroke={accentColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                
                {/* Handle left */}
                <path
                    d="M22 36C22 36 20 32 20 28C20 26 22 24 24 24"
                    stroke={secondaryColor}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />
                
                {/* Handle right */}
                <path
                    d="M42 36C42 36 44 32 44 28C44 26 42 24 40 24"
                    stroke={secondaryColor}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />
                
                {/* Vintage shine/highlight */}
                <path
                    d="M28 26C28 26 30 28 32 28C34 28 36 26 36 26"
                    stroke={isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.3)"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
            </svg>
            
            {/* Text */}
            {showText && (
                <div className="flex flex-col">
                    <span className={`font-elegant ${config.text} text-vintage-darkwood dark:text-vintage-gold transition-colors`}>
                        Shop Đồ Cổ
                    </span>
                    <span className={`text-xs text-vintage-gold font-serif italic ${size === 'sm' ? 'hidden' : ''}`}>
                        Antique Store
                    </span>
                </div>
            )}
        </div>
    )
}

export default Logo

