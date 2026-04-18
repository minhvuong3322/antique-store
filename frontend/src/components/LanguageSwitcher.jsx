import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const LanguageSwitcher = () => {
    const { t, i18n } = useTranslation()
    const [isChanging, setIsChanging] = useState(false)

    const toggleLanguage = async () => {
        if (isChanging) return

        setIsChanging(true)
        const currentLang = i18n.language || 'vi'
        const newLang = currentLang === 'vi' ? 'en' : 'vi'

        try {
            await i18n.changeLanguage(newLang)
            localStorage.setItem('i18nextLng', newLang)
            setIsChanging(false)
        } catch (error) {
            console.error('Error changing language:', error)
            setIsChanging(false)
        }
    }

    return (
        <button
            onClick={toggleLanguage}
            disabled={isChanging}
            className="p-2 hover:bg-vintage-gold/10 rounded-lg transition-all duration-300"
            title={`${t('common.language')} (${i18n.language === 'vi' ? 'Tiếng Việt' : 'English'})`}
        >
            <Globe
                className={`w-5 h-5 text-vintage-darkwood dark:text-vintage-cream ${isChanging ? 'animate-spin' : ''}`}
            />
            <span className="sr-only">
                {i18n.language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
            </span>
        </button>
    )
}

export default LanguageSwitcher
