from .uz import UZ_TEXTS
from .ru import RU_TEXTS
from .en import EN_TEXTS

LOCALES = {
    'uz': UZ_TEXTS,
    'ru': RU_TEXTS,
    'en': EN_TEXTS,
}

def get_text(key: str, lang: str = 'uz', **kwargs) -> str:
    texts = LOCALES.get(lang, UZ_TEXTS)
    text = texts.get(key, UZ_TEXTS.get(key, key))
    if kwargs:
        try:
            return text.format(**kwargs)
        except Exception:
            return text
    return text
