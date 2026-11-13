# GEMINI.md - LECASU Simulador Solar

## Regras de Infraestrutura e Deploy (Servidor cPanel)
1. Trabalhar EXCLUSIVAMENTE dentro de /home/mwxntafa/repositories/Sistema-Financeiro-ERP-LECASU-LDA. Nunca editar ficheiros diretamente em /home/mwxntafa/public_html/erp.lecasu.co.mz.
2. Nunca modificar, apagar ou fazer commit da pasta db/ nem de ficheiros .env de produção.
3. Após qualquer alteração de código validada, fazer git add, git commit e git push origin main, e executar /home/mwxntafa/bin/deploy-erp.sh para publicar em produção.
4. Manter a estrutura do projeto (HTML/JS/PWA + api.php) sem introduzir dependências que quebrem o ambiente cPanel.
