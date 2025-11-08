#!/bin/bash

mkdir -p docs
{
    echo "# 📚 Documentación de Comandos Make"
    echo ""
    for makefile in Makefile makefiles/*.mk makefiles/*/Makefile; do
        [ -f "$makefile" ] && {
            echo "## 📂 $(basename "$makefile" .mk | sed 's/Makefile/main/')"
            echo ""
            grep "^[a-zA-Z0-9_-]*:.*##" "$makefile" | sed 's/^\([^:]*\):.*##\(@[a-zA-Z-]*\)\?\s*\(.*\)/### `make \1`\n\n\3\n/'
        }
    done
} > docs/README.md
echo "✅ Documentación generada en docs/README.md"