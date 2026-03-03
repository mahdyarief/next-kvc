# Set email sesuai akun utama Vercel
git config --local user.email "kelasvibecoding@gmail.com"

# Set nama sesuai akun utama Vercel
git config --local user.name "kelasvibecoding"

# Perbarui Identitas Commit Terakhir
git commit --amend --reset-author --no-edit

# Force Push (Hati-hati!)
git push origin main --force-with-lease