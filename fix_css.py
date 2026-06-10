from pathlib import Path
import re

path = Path('public/styles.css')
text = path.read_text(encoding='utf-8')
text_new = re.sub(r'var\(--spacing-unit\)\s*\*\s*([0-9.]+)', r'calc(var(--spacing-unit) * \1)', text)
if text_new != text:
    path.write_text(text_new, encoding='utf-8')
    print('Updated CSS calc expressions')
else:
    print('No changes needed')
